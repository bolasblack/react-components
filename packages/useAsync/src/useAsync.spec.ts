/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-floating-promises */

import { renderHook, act } from '@testing-library/react-hooks'
import pDefer from 'p-defer'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  let defer: pDefer.DeferredPromise<string>
  let asyncFn: jest.Mock<Promise<string>, any[]>

  beforeEach(() => {
    defer = pDefer<string>()
    asyncFn = jest.fn((..._args: any[]) => defer.promise)
  })

  it('return success state after promise resolved', async () => {
    const deferValue = 'a'
    const res = renderHook(() => useAsync(asyncFn, []))
    let latestReRunFn: useAsync.AsyncFn | null = null

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
        loading: true,
        promise: defer.promise,
      },
      expect.any(Function),
    ])
    latestReRunFn = res.result.current[1]

    defer.resolve(deferValue)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
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
    const res = renderHook(() => useAsync(asyncFn, []))

    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
        loading: true,
        promise: defer.promise,
      },
      expect.any(Function),
    ])

    defer.reject(fakeError)
    await res.waitForNextUpdate()
    expect(asyncFn).toBeCalledTimes(1)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
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

    const res = renderHook(() => useAsync(asyncFn, [], initialState))

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current[0]).toBe(initialState)

    await res.waitForNextUpdate()

    expect(asyncFn).toBeCalledTimes(0)
    expect(res.result.current).toEqual([
      <useAsync.State<string>>{
        loading: false,
        promise: defer.promise,
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
    let resolvedTimes = 0
    const asyncFn = jest.fn(
      (val = 'a', timeout = 100) =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve(val)
            resolvedTimes++
          }, timeout)
        }),
    )

    const res = renderHook(
      (props: { some: number }) => useAsync(asyncFn, [props.some]),
      { initialProps: { some: 0 } },
    )

    act(() => {
      res.result.current[1]('b', 50)
      res.result.current[1]('c', 10)
    })

    await res.waitForNextUpdate()
    await res.waitForNextUpdate()
    await res.waitForNextUpdate()

    expect(resolvedTimes).toBe(3)
    expect(res.result.current[0]).toEqual(
      expect.objectContaining({
        loading: false,
        value: 'c',
      }),
    )
  })
})
