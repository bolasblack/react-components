/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-floating-promises */

import { renderHook, act } from '@testing-library/react-hooks'
import pDefer from 'p-defer'
import { useAsyncFn } from './useAsyncFn'

describe('useAsyncFn', () => {
  let defer: pDefer.DeferredPromise<string>
  let asyncFn: jest.Mock<Promise<string>, any[]>

  beforeEach(() => {
    defer = pDefer<string>()
    asyncFn = jest.fn((..._args: any[]) => defer.promise)
  })

  it('return success state after promise resolved', async () => {
    const deferValue = 'a'
    const res = renderHook(() => useAsyncFn(asyncFn, []))
    let latestReRunFn: useAsyncFn.AsyncFn | null = null

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsyncFn.State<string>>{
        loading: false,
      },
      expect.any(Function),
    ])
    latestReRunFn = res.result.current[1]

    act(() => {
      expect(res.result.current[1](1, 2, 3)).resolves.toEqual({
        loading: false,
        value: deferValue,
        promise: defer.promise,
      })
    })
    expect(asyncFn).toBeCalledTimes(1)
    expect(asyncFn).toBeCalledWith(1, 2, 3)
    expect(res.result.current).toEqual([
      <useAsyncFn.State<string>>{
        loading: true,
        promise: defer.promise,
      },
      expect.any(Function),
    ])
    expect(res.result.current[1]).toBe(latestReRunFn)
    latestReRunFn = res.result.current[1]

    defer.resolve(deferValue)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsyncFn.State<string>>{
        loading: false,
        value: deferValue,
        promise: defer.promise,
      },
      expect.any(Function),
    ])
    expect(res.result.current[1]).toBe(latestReRunFn)
  })

  it('return error state after promise rejected', async () => {
    const fakeError = new Error()
    const res = renderHook(() => useAsyncFn(asyncFn, []))

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsyncFn.State<string>>{
        loading: false,
      },
      expect.any(Function),
    ])

    act(() => {
      expect(res.result.current[1]()).resolves.toEqual({
        loading: false,
        error: fakeError,
        promise: defer.promise,
      })
    })

    defer.reject(fakeError)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsyncFn.State<string>>{
        loading: false,
        error: fakeError,
        promise: defer.promise,
      },
      expect.any(Function),
    ])
  })

  it('support promise finished before mounted', async () => {
    const deferValue = 'a'
    defer.resolve(deferValue)

    const initialState = {
      loading: true,
      promise: defer.promise,
    } as const

    const res = renderHook(() => useAsyncFn(asyncFn, [], initialState))

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current[0]).toBe(initialState)

    await res.waitForNextUpdate()

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsyncFn.State<string>>{
        loading: false,
        promise: defer.promise,
        value: deferValue,
      },
      expect.any(Function),
    ])
  })

  it('regenerate rerun function when deps changed', async () => {
    const res = renderHook(
      (props: { some: number }) => useAsyncFn(asyncFn, [props.some]),
      { initialProps: { some: 0 } },
    )
    const [initialState, initialReRun] = res.result.current

    act(() => void res.rerender({ some: 0 }))
    expect(res.result.current[0]).toBe(initialState)
    expect(res.result.current[1]).toBe(initialReRun)

    act(() => void res.rerender({ some: 1 }))
    expect(res.result.current[0]).toBe(initialState)
    expect(res.result.current[1]).not.toBe(initialReRun)
  })

  it('handle async race condition safely', async () => {
    let resolvedTimes = 0
    const asyncFn = jest.fn(
      (val: string, timeout: number) =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(val)
            resolvedTimes++
          }, timeout)
        }),
    )

    const res = renderHook(
      (props: { some: number }) => useAsyncFn(asyncFn, [props.some]),
      { initialProps: { some: 0 } },
    )

    act(() => {
      res.result.current[1]('a', 100)
      res.result.current[1]('b', 10)
    })

    await res.waitForNextUpdate()
    await res.waitForNextUpdate()

    expect(resolvedTimes).toBe(2)
    expect(res.result.current[0]).toEqual(
      expect.objectContaining({
        loading: false,
        value: 'b',
      }),
    )
  })
})
