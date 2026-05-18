import { act, renderHook } from '../../../configs/testUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectReducer } from './useEffectReducer'

describe('useEffectReducer - batching behavior', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('support trigger effects in React batching', async () => {
    const effects: string[] = []
    const reducerCalls: number[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'action'; id: number }) => {
          reducerCalls.push(action.id)
          return [state + 1, { id: action.id }]
        },
        async effect => {
          effects.push(`effect-${effect.id}`)
        },
        0,
      ),
    )

    // In a real event handler, React 18 batches these
    act(() => {
      result.current[1]({ type: 'action', id: 1 })
      result.current[1]({ type: 'action', id: 2 })
      result.current[1]({ type: 'action', id: 3 })
    })

    expect(result.current[0]).toBe(3)
    expect(reducerCalls).toEqual([1, 2, 3])

    await vi.runAllTimersAsync()

    expect(effects.length).toBe(3)
    expect(effects).toEqual(['effect-1', 'effect-2', 'effect-3'])
  })

  it('also support separate act() calls work', async () => {
    const effects: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'action'; id: number }) => {
          return [state + 1, { id: action.id }]
        },
        async effect => {
          effects.push(`effect-${effect.id}`)
        },
        0,
      ),
    )

    // Separate act() calls = separate renders = all effects captured
    act(() => {
      result.current[1]({ type: 'action', id: 1 })
    })
    act(() => {
      result.current[1]({ type: 'action', id: 2 })
    })
    act(() => {
      result.current[1]({ type: 'action', id: 3 })
    })

    await vi.runAllTimersAsync()

    expect(effects).toEqual(['effect-1', 'effect-2', 'effect-3'])
  })
})
