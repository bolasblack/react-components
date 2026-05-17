import {
  ActionDispatch,
  AnyActionArg,
  RefObject,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useSyncExternalStore,
} from 'react'

export interface EffectRunContext<A extends AnyActionArg> {
  abort: AbortSignal
  dispatch: ActionDispatch<A>
}

export interface EffectContext<S, A extends AnyActionArg> {
  dispatch: ActionDispatch<A>
  getState(): S

  abort: AbortSignal
  run<T>(id: string, callback: (ctx: EffectRunContext<A>) => Promise<T>): Promise<T>
  cancel(id: string): void
}

type StateEffect<S, E> = readonly [S, E?]

export type ReducerFnResult<S, E> = StateEffect<S, E>

export type ReducerFn<S, A extends AnyActionArg, E> = (
  prevState: S,
  ...args: A
) => ReducerFnResult<S, E>

export type OnEffectFn<S, E, A extends AnyActionArg> = (
  effect: E,
  ctx: EffectContext<S, A>,
) => void | Promise<void>

type OnInitFn<I, S, E> = (i: I) => StateEffect<S, E>

export function useEffectReducer<S, A extends AnyActionArg>(
  reducer: ReducerFn<S, A, void>,
  initialState: S,
): [S, ActionDispatch<A>]
export function useEffectReducer<S, A extends AnyActionArg, E>(
  reducer: ReducerFn<S, A, E>,
  onEffect: OnEffectFn<S, E, A>,
  initialState: S,
): [S, ActionDispatch<A>]
export function useEffectReducer<S, I, A extends AnyActionArg, E>(
  reducer: ReducerFn<S, A, E>,
  initialArg: I,
  init: OnInitFn<I, S, E>,
): [S, ActionDispatch<A>]
export function useEffectReducer<S, I, A extends AnyActionArg, E>(
  reducer: ReducerFn<S, A, E>,
  onEffect: OnEffectFn<S, E, A>,
  initialArg: I,
  init: OnInitFn<I, S, E>,
): [S, ActionDispatch<A>]
export function useEffectReducer<S, I, A extends AnyActionArg, E>(
  reducer: ReducerFn<S, A, E>,
  onEffectOrInitialArgOrState: OnEffectFn<S, E, A> | I | S,
  initialArgOrStateOrInit?: I | S | OnInitFn<I, S, E>,
  initOrUndefined?: OnInitFn<I, S, E>,
): [S, ActionDispatch<A>] {
  type WrappedState = { state: S }

  let onEffect: OnEffectFn<S, E, A>
  let initialArgOrState: I | S
  let initFn: OnInitFn<I, S, E>
  if (typeof onEffectOrInitialArgOrState === 'function') {
    onEffect = onEffectOrInitialArgOrState as OnEffectFn<S, E, A>
    initialArgOrState = initialArgOrStateOrInit as any
    initFn = initOrUndefined as any
  } else {
    onEffect = (async () => {}) as OnEffectFn<S, E, A>
    initialArgOrState = onEffectOrInitialArgOrState as any
    initFn = initialArgOrStateOrInit as any
  }

  const { current: effectStore } = useLazyRef(() => createEffectStore<E>())

  const pendingEffectsRef = useRef<E[]>([])
  useEffect(() => {
    if (pendingEffectsRef.current.length > 0) {
      pendingEffectsRef.current.forEach(effect => {
        effectStore.push(effect)
      })
      pendingEffectsRef.current = []
    }
  })

  const wrappedReducer = useCallback(
    (prevState: WrappedState, ...args: A): WrappedState => {
      const res = reducer(prevState.state, ...args)

      if (res.length > 1) {
        pendingEffectsRef.current.push(res[1]!)
      }

      return { state: res[0] }
    },
    [reducer],
  )

  const wrappedInit = useCallback(
    (i: any): WrappedState => {
      const res: StateEffect<S, E> = initFn == null ? [i] : initFn(i)

      if (res.length > 1) {
        pendingEffectsRef.current.push(res[1]!)
      }

      return { state: res[0] }
    },
    [initFn],
  )

  const [state, dispatch] = useReducer(wrappedReducer, initialArgOrState, wrappedInit)

  const latestStateRef = useLatestRef(state)
  const latestOnEffectRef = useLatestRef(onEffect)
  const abortControllersRef = useRef<Record<string, AbortController>>({})

  // Subscribe to effect queue
  const effectQueue = useSyncExternalStore(
    effectStore.subscribe,
    effectStore.getSnapshot,
    effectStore.getServerSnapshot,
  )

  // Process effects
  useEffect(() => {
    if (effectQueue.length === 0) return
    if (latestOnEffectRef.current == null) return

    const effectRootId = 'process'
    const genEffectSubId = (id: string): string => `sub-processes$$$${id}`

    abortControllersRef.current[effectRootId]?.abort()
    const rootCtrl = new AbortController()
    abortControllersRef.current[effectRootId] = rootCtrl

    effectQueue.forEach(effect => {
      void latestOnEffectRef.current?.(effect, {
        dispatch,
        getState: () => latestStateRef.current.state,
        abort: rootCtrl.signal,
        run: (_id, callback) => {
          const id = genEffectSubId(_id)
          abortControllersRef.current[id]?.abort()
          const taskCtrl = new AbortController()
          abortControllersRef.current[id] = taskCtrl

          return callback({
            abort: taskCtrl.signal,
            dispatch: (...args) => {
              if (taskCtrl.signal.aborted) return
              dispatch(...args)
            },
          }).finally(() => {
            if (abortControllersRef.current[id] === taskCtrl) {
              delete abortControllersRef.current[id]
            }
          })
        },
        cancel: id => {
          const fullId = genEffectSubId(id)
          abortControllersRef.current[fullId]?.abort()
          delete abortControllersRef.current[fullId]
        },
      })
    })

    effectStore.clear()
  }, [effectQueue, effectStore, latestOnEffectRef, latestStateRef])

  // Cleanup on unmount
  useEffect(
    () => () => {
      Object.values(abortControllersRef.current).forEach(ctrl => {
        ctrl.abort()
      })
    },
    [],
  )

  return [state.state, dispatch]
}

interface EffectStore<E> {
  push(effect: E): void
  clear(): void
  subscribe(listener: () => void): () => void
  getSnapshot(): E[]
  getServerSnapshot(): E[]
}
function createEffectStore<E>(): EffectStore<E> {
  let queue: E[] = []
  const listeners = new Set<() => void>()

  return {
    push(effect) {
      queue = [...queue, effect]
      listeners.forEach(l => l())
    },

    clear() {
      if (queue.length > 0) {
        queue = []
        listeners.forEach(l => l())
      }
    },

    subscribe(_listener) {
      const listener = (): void => _listener()
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    getSnapshot() {
      return queue
    },

    getServerSnapshot() {
      return []
    },
  }
}

function useLatestRef<T>(item: T): RefObject<T> {
  const ref = useRef<T>(null) as RefObject<T>
  ref.current = item
  return ref
}

function useLazyRef<T>(factory: () => T): RefObject<T> {
  const ref = useRef<T>(null) as RefObject<T>
  const isAssigned = useRef(false)

  if (!isAssigned.current) {
    isAssigned.current = true
    ref.current = factory()
  }

  return ref
}
