import { renderHook, act } from '@testing-library/react-hooks'
import { useAsyncFnFactory } from './useAsyncFnFactory'
import { defer, sleep } from './utils'

describe('useAsyncFn', () => {
  let deferred: defer.Deferred<string>
  let asyncFn: jest.Mock<Promise<string>, any[]>

  beforeEach(() => {
    deferred = defer<string>()
    asyncFn = jest.fn((..._args: any[]) => deferred.promise)
  })

  it('return success state after promise resolved', async () => {
    const deferValue = 'a'
    const res = renderHook(() => useAsyncFnFactory(() => asyncFn, []))
    let latestReRunFn: useAsyncFnFactory.AsyncFn | null = null

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsyncFnFactory.State<string>>{
        loading: false,
      },
      expect.any(Function),
    ])
    latestReRunFn = res.result.current[1]

    act(() => {
      void expect(res.result.current[1](1, 2, 3)).resolves.toEqual({
        loading: false,
        value: deferValue,
        promise: deferred.promise,
      })
    })
    expect(asyncFn).toBeCalledTimes(1)
    expect(asyncFn).toBeCalledWith(1, 2, 3)
    expect(res.result.current).toEqual([
      <useAsyncFnFactory.State<string>>{
        loading: true,
        promise: deferred.promise,
      },
      expect.any(Function),
    ])
    expect(res.result.current[1]).toBe(latestReRunFn)
    latestReRunFn = res.result.current[1]

    await act(async () => {
      deferred.resolve(deferValue)
      await deferred.promise
    })
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsyncFnFactory.State<string>>{
        loading: false,
        value: deferValue,
        promise: deferred.promise,
      },
      expect.any(Function),
    ])
    expect(res.result.current[1]).toBe(latestReRunFn)
  })

  it('return error state after promise rejected', async () => {
    const fakeError = new Error()
    const res = renderHook(() => useAsyncFnFactory(() => asyncFn, []))

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsyncFnFactory.State<string>>{
        loading: false,
      },
      expect.any(Function),
    ])

    act(() => {
      void expect(res.result.current[1]()).resolves.toEqual({
        loading: false,
        error: fakeError,
        promise: deferred.promise,
      })
    })

    deferred.reject(fakeError)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsyncFnFactory.State<string>>{
        loading: false,
        error: fakeError,
        promise: deferred.promise,
      },
      expect.any(Function),
    ])
  })

  it('support promise finished before mounted', async () => {
    const deferValue = 'a'
    deferred.resolve(deferValue)

    const initialState = {
      loading: true,
      promise: deferred.promise,
    } as const

    const res = renderHook(() =>
      useAsyncFnFactory(() => asyncFn, [], initialState),
    )

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current[0]).toBe(initialState)

    await res.waitForNextUpdate()

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsyncFnFactory.State<string>>{
        loading: false,
        promise: deferred.promise,
        value: deferValue,
      },
      expect.any(Function),
    ])
  })

  it('regenerate rerun function when deps changed', async () => {
    const res = renderHook(
      (props: { some: number }) =>
        useAsyncFnFactory(() => () => asyncFn(), [props.some]),
      { initialProps: { some: 0 } },
    )
    const [initialState, initialReRun] = res.result.current

    act(() => res.rerender({ some: 0 }))
    expect(res.result.current[0]).toBe(initialState)
    expect(res.result.current[1]).toBe(initialReRun)

    act(() => res.rerender({ some: 1 }))
    expect(res.result.current[0]).toBe(initialState)
    expect(res.result.current[1]).not.toBe(initialReRun)
  })

  it('handle async race condition safely', async () => {
    let resolvedTimes = 0
    const asyncFn = jest.fn(
      async (val: string, timeoutPromise: Promise<void>) => {
        await timeoutPromise
        resolvedTimes++
        return val
      },
    )

    const res = renderHook(
      (props: { some: number }) =>
        useAsyncFnFactory(() => asyncFn, [props.some]),
      { initialProps: { some: 0 } },
    )

    // deferA will never resolve
    const deferA = defer<void>()
    act(() => void res.result.current[1]('a', deferA.promise))
    const deferB = defer<void>()
    act(() => void res.result.current[1]('b', deferB.promise))
    const deferC = defer<void>()
    act(() => void res.result.current[1]('c', deferC.promise))

    await sleep(10)
    await act(() => {
      deferC.resolve()
      return deferC.promise
    })

    await sleep(10)
    await act(() => {
      deferB.resolve()
      return deferB.promise
    })

    expect(resolvedTimes).toBe(2)
    expect(res.result.current[0]).toEqual(
      expect.objectContaining({
        loading: false,
        value: 'c',
      }),
    )
  })
})
