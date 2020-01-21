import { DependencyList, useCallback, useRef, useState, useEffect } from 'react'
import {
  AsyncState$Idle,
  AsyncState$Loading,
  AsyncState$Error,
  AsyncState$Success,
} from './types'

export function useAsyncFn<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args) => Promise<Result>,
  deps: DependencyList = [],
  initialState: useAsyncFn.State<Result> = { loading: false },
): [useAsyncFn.State<Result>, useAsyncFn.AsyncFn<Result, Args>] {
  const lastCallIdRef = useRef(0)
  const stateRef = useRef<useAsyncFn.State<Result>>(initialState)
  const isMounted = useMountedState()
  const stateChangedTimeRef = useRef(0)
  const [, rerenderComponent] = useState(0)

  const markStateChanged = useCallback(() => {
    stateChangedTimeRef.current = Date.now()
    if (isMounted()) rerenderComponent(Date.now())
  }, [isMounted])

  const handlePromise = useCallback(
    async (promise: Promise<Result>) => {
      const callId = lastCallIdRef.current

      try {
        const value = await promise
        const state = { value, loading: false, promise } as const
        if (callId === lastCallIdRef.current) {
          stateRef.current = state
        }
        markStateChanged()
        return state
      } catch (error) {
        const state = { error, loading: false, promise } as const
        if (callId === lastCallIdRef.current) {
          stateRef.current = { error, loading: false, promise }
        }
        markStateChanged()
        return state
      }
    },
    [markStateChanged],
  )

  const reRun = useCallback(
    async (...args: Args) => {
      ++lastCallIdRef.current
      const promise = fn(...args)
      stateRef.current = { loading: true, promise }
      markStateChanged()
      return handlePromise(promise)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, markStateChanged, handlePromise],
  )

  // handle if state changed when component not mounted
  useEffect(() => {
    if (Date.now() >= stateChangedTimeRef.current) {
      rerenderComponent(Date.now())
    }
  }, [])

  // handle if initialState is loading in initialize phase
  if (
    // if lastCallId is 0, mean hook is called first time
    !lastCallIdRef.current
  ) {
    ++lastCallIdRef.current

    if (stateRef.current.loading && stateRef.current.promise) {
      void handlePromise(stateRef.current.promise)
    }
  }

  return [stateRef.current, reRun]
}

export namespace useAsyncFn {
  export type State<T> =
    | AsyncState$Idle
    | AsyncState$Loading<T>
    | AsyncState$Success<T>
    | AsyncState$Error<T>

  export type AsyncFn<Result = any, Args extends any[] = any[]> = (
    ...args: Args
  ) => Promise<AsyncState$Success<Result> | AsyncState$Error<Result>>
}

function useMountedState(): () => boolean {
  const mountedRef = useRef(false)
  const get = useCallback(() => mountedRef.current, [])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  return get
}
