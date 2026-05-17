import { renderHook, act, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useAsync } from './useAsync'
import { defer, sleep } from './utils'

describe('useAsync', () => {
  let deferred: defer.Deferred<string>
  let asyncFn: ReturnType<typeof vi.fn<(...args: any[]) => Promise<string>>>

  beforeEach(async () => {
    deferred = defer<string>()
    asyncFn = vi.fn((..._args: any[]) => deferred.promise)
  })

  it('return success state after promise resolved', async () => {
    const deferValue = 'a'
    const res = renderHook(() => useAsync(asyncFn, []))
    let latestReRunFn: useAsync.AsyncFn | null = null

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      {
        loading: true,
        promise: deferred.promise,
      } as useAsync.State<string>,
      expect.any(Function),
    ])
    latestReRunFn = res.result.current[1]

    deferred.resolve(deferValue)
    await waitFor(() => expect(res.result.current[0].loading).toBe(false))
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      {
        loading: false,
        value: deferValue,
        promise: deferred.promise,
      } as useAsync.State<string>,
      expect.any(Function),
    ])
    expect(res.result.current[1]).toBe(latestReRunFn)
  })

  it('return error state after promise rejected', async () => {
    const fakeError = new Error()
    const res = renderHook(() => useAsync(asyncFn, []))

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      {
        loading: true,
        promise: deferred.promise,
      } as useAsync.State<string>,
      expect.any(Function),
    ])

    deferred.reject(fakeError)
    await waitFor(() => expect(res.result.current[0].loading).toBe(false))
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      {
        loading: false,
        error: fakeError,
        promise: deferred.promise,
      } as useAsync.State<string>,
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

    await waitFor(() => expect(res.result.current[0].loading).toBe(false))

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      {
        loading: false,
        promise: deferred.promise,
        value: deferValue,
      } as useAsync.State<string>,
      expect.any(Function),
    ])
  })

  it('rerun when deps changed', async () => {
    let resolvedTimes = 0
    const asyncFn = vi.fn(
      () =>
        new Promise(resolve => {
          resolve(resolvedTimes++)
        }),
    )

    const res = renderHook((props: { some: number }) => useAsync(asyncFn, [props.some]), {
      initialProps: { some: 0 },
    })
    await waitFor(() => expect(res.result.current[0].loading).toBe(false))

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
    await waitFor(() => {
      expect(res.result.current[0].loading).toBe(false)
      expect(res.result.current[0].value).toBe(1)
    })
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
    const asyncFn = vi.fn(async (val = 'a', timeoutPromise = deferA.promise) => {
      calledTimes++
      await timeoutPromise
      resolvedTimes++
      return val
    })

    const res = renderHook((props: { some: number }) => useAsync(asyncFn, [props.some]), {
      initialProps: { some: 0 },
    })

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
