import {
  DependencyList,
  useCallback,
  useRef,
  useState,
  useDebugValue,
  useMemo,
} from 'react'
import { AsyncState } from './types'

export function useAsyncFnFactory<Result = any, Args extends any[] = any[]>(
  fnFactory: () => (...args: Args) => Promise<Result>,
  deps: DependencyList = [],
  initialState: useAsyncFnFactory.State<Result> = { loading: false },
): useAsyncFnFactory.Controller<Result, Args> {
  const stateRef = useRef(initialState)
  const [, rerenderComponent] = useState(Date.now())

  const handlePromiseCallId = useRef(0)
  const handlePromise = useCallback(
    async (promise: Promise<Result>): Promise<AsyncState.Settled<Result>> => {
      while (true) {
        const callId = (handlePromiseCallId.current += 1)

        const newState = await handlePromiseImpl(promise)

        const isStillTheLastBeCall = callId === handlePromiseCallId.current
        if (isStillTheLastBeCall) {
          stateRef.current = newState
          rerenderComponent(Date.now())
          return newState
        }

        // this can make use always return the result for the last call
        promise =
          // state should never be `Idle` after useAsyncFnFactory has ever been called
          (
            stateRef.current as Exclude<
              useAsyncFnFactory.State<Result>,
              AsyncState.Idle
            >
          ).promise
      }

      async function handlePromiseImpl(
        promise: Promise<Result>,
      ): Promise<AsyncState.Settled<Result>> {
        let newState: useAsyncFnFactory.State<Result>
        try {
          const value = await promise
          newState = { value, loading: false, promise }
        } catch (error) {
          newState = { error, loading: false, promise }
        }
        return newState
      }
    },
    [],
  )

  const fn = useMemo(
    () => fnFactory(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  )

  const reRun = useCallback(
    async (...args: Args) => {
      const promise = fn(...args)

      stateRef.current = { loading: true, promise }
      rerenderComponent(Date.now())

      return handlePromise(promise)
    },
    [fn, handlePromise],
  )

  const isFirstTimeRef = useRef(true)
  if (isFirstTimeRef.current) {
    isFirstTimeRef.current = false
    if (stateRef.current.loading && stateRef.current.promise) {
      void handlePromise(stateRef.current.promise)
    }
  }

  const res: useAsyncFnFactory.Controller<Result, Args> = [
    stateRef.current,
    reRun,
  ]

  useDebugValue(res)

  return res
}

export namespace useAsyncFnFactory {
  export type State<T> =
    | AsyncState.Idle
    | AsyncState.Loading<T>
    | AsyncState.Success<T>
    | AsyncState.Failed<T>

  export type AsyncFn<Result = any, Args extends any[] = any[]> = (
    ...args: Args
  ) => Promise<Result>

  export type Controller<Result = any, Args extends any[] = any[]> = [
    State<Result>,
    AsyncFn<AsyncState.Settled<Result>, Args>,
  ]
}
