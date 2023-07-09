import { DependencyList, useRef, useEffect } from 'react'
import {
  AsyncState$Loading,
  AsyncState$Error,
  AsyncState$Success,
} from './types'
import { useAsyncFn } from './useAsyncFn'

export function useAsync<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
  deps: DependencyList = [],
  initialState?: useAsync.State<Result>,
): [useAsync.State<Result>, useAsync.AsyncFn<Result, Args | []>] {
  const isFirstTimeRef = useRef(true)
  const isJustMountedRef = useRef(true)

  if (isFirstTimeRef.current) {
    isFirstTimeRef.current = false

    if (!initialState) {
      initialState = {
        loading: true,
        promise: fn(),
      }
    }
  }

  const res = useAsyncFn(fn, deps, initialState) as [
    useAsync.State<Result>,
    useAsync.AsyncFn<Result, Args | []>,
  ]

  const [, reRun] = res

  useEffect(
    () => {
      // Skip `reRun` when component is just mounted, because we have already
      // executed `fn` before
      if (isJustMountedRef.current) {
        isJustMountedRef.current = false
      } else {
        void reRun()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, reRun],
  )

  return res
}

export namespace useAsync {
  export type State<T> =
    | AsyncState$Loading<T>
    | AsyncState$Success<T>
    | AsyncState$Error<T>

  export type AsyncFn<
    Result = any,
    Args extends any[] = any[],
  > = useAsyncFn.AsyncFn<Result, Args>
}
