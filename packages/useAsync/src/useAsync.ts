import { DependencyList, useRef, useEffect, useDebugValue } from 'react'
import { AsyncState } from './types'
import { useAsyncFnFactory } from './useAsyncFnFactory'

export function useAsync<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result>,
  deps: DependencyList = [],
): useAsync.Controller<Result, Args | []> {
  const isFirstTimeRenderRef = useRef(true)
  const isFirstTimeMountRef = useRef(true)

  const res = useAsyncFnFactory(
    () =>
      (...args) =>
        fn(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
    isFirstTimeRenderRef.current ? { loading: true, promise: fn() } : undefined,
  ) as useAsync.Controller<Result, Args | []>
  if (isFirstTimeRenderRef.current) isFirstTimeRenderRef.current = false

  const [, reRun] = res
  useEffect(
    () => {
      // Skip `reRun` when component first time mounted, because we have already
      // executed `fn` before
      if (isFirstTimeMountRef.current) {
        isFirstTimeMountRef.current = false
      } else {
        void reRun()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps, reRun],
  )

  useDebugValue(res)

  return res
}

export namespace useAsync {
  export type State<T> =
    | AsyncState.Loading<T>
    | AsyncState.Success<T>
    | AsyncState.Failed<T>

  export type AsyncFn<
    Result = any,
    Args extends any[] = any[],
  > = useAsyncFnFactory.AsyncFn<Result, Args>

  export type Controller<Result = any, Args extends any[] = any[]> = [
    State<Result>,
    AsyncFn<AsyncState.Settled<Result>, Args>,
  ]
}
