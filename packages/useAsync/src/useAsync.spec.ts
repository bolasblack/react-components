import { renderHook, act } from '@testing-library/react-hooks'
import { useAsync } from './useAsync'
import { defer, sleep } from './utils'

describe('useAsync', () => {
  let deferred: defer.Deferred<string>
  let asyncFn: jest.Mock<Promise<string>, any[]>

  beforeEach(async () => {
    deferred = defer<string>()
    asyncFn = jest.fn((..._args: any[]) => deferred.promise)
  })

  it('return success state after promise resolved', async () => {
    const deferValue = 'a'
    const res = renderHook(() => useAsync(asyncFn, []))
    let latestReRunFn: useAsync.AsyncFn | null = null

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
        loading: true,
        promise: deferred.promise,
      },
      expect.any(Function),
    ])
    latestReRunFn = res.result.current[1]

    deferred.resolve(deferValue)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
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
    const res = renderHook(() => useAsync(asyncFn, []))

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
        loading: true,
        promise: deferred.promise,
      },
      expect.any(Function),
    ])

    deferred.reject(fakeError)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
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

    const res = renderHook(() => useAsync(asyncFn, []))

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current[0]).toStrictEqual({
      loading: true,
      promise: deferred.promise,
    })

    await res.waitForNextUpdate()

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
        loading: false,
        promise: deferred.promise,
        value: deferValue,
      },
      expect.any(Function),
    ])
  })

  it('rerun when deps changed', async () => {
    let resolvedTimes = 0
    const asyncFn = jest.fn(
      () =>
        new Promise(resolve => {
          resolve(resolvedTimes++)
        }),
    )

    const res = renderHook(
      (props: { some: number }) => useAsync(asyncFn, [props.some]),
      { initialProps: { some: 0 } },
    )
    await res.waitForNextUpdate()

    const [initialState, initialReRun] = res.result.current
    expect(asyncFn).toBeCalledTimes(1)
    expect(initialState).toEqual(
      expect.objectContaining({
        loading: false,
        value: 0,
      }),
    )

    res.rerender({ some: 0 })
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current[0]).toBe(initialState)
    expect(res.result.current[1]).toBe(initialReRun)

    res.rerender({ some: 1 })
    await res.waitForValueToChange(() => res.result.current[0].loading)
    expect(asyncFn).toBeCalledTimes(2)
    expect(res.result.current[0]).toEqual(
      expect.objectContaining({
        loading: false,
        value: 1,
      }),
    )
    expect(res.result.current[1]).not.toBe(initialReRun)
  })

  it('handle async race condition safely', async () => {
    let calledTimes = 0
    let resolvedTimes = 0
    const deferA = defer<void>() // will never be resolved
    const asyncFn = jest.fn(
      async (val = 'a', timeoutPromise = deferA.promise) => {
        calledTimes++
        await timeoutPromise
        resolvedTimes++
        return val
      },
    )

    const res = renderHook(
      (props: { some: number }) => useAsync(asyncFn, [props.some]),
      { initialProps: { some: 0 } },
    )

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

    expect(calledTimes).toBe(3)
    expect(resolvedTimes).toBe(2)
    expect(res.result.current[0]).toEqual(
      expect.objectContaining({
        loading: false,
        value: 'c',
      }),
    )
  })
})
