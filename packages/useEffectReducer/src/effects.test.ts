import { act, renderHook } from '../../../configs/testUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectReducer } from './useEffectReducer'

describe('useEffectReducer - effect queue processing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('clears queue after processing', async () => {
    const effects: string[] = []

    const { result, rerender } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'action'; id: string }) => {
          return [state + 1, { id: action.id }]
        },
        async effect => {
          effects.push(effect.id)
        },
        0,
      ),
    )

    // First batch
    act(() => {
      result.current[1]({ type: 'action', id: 'A' })
      result.current[1]({ type: 'action', id: 'B' })
    })

    await vi.runAllTimersAsync()
    expect(effects).toEqual(['A', 'B'])

    // Second batch
    act(() => {
      result.current[1]({ type: 'action', id: '1' })
    })

    await vi.runAllTimersAsync()
    expect(effects).toEqual(['A', 'B', '1'])

    // Re-render doesn't re-process
    rerender()
    await vi.runAllTimersAsync()
    expect(effects).toEqual(['A', 'B', '1']) // No duplicates!
  })

  it('handles 100 rapid dispatches', async () => {
    const effects: number[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'inc'; value: number }) => {
          return [state + action.value, { value: action.value }]
        },
        async effect => {
          effects.push(effect.value)
        },
        0,
      ),
    )

    act(() => {
      for (let i = 1; i <= 100; i++) {
        result.current[1]({ type: 'inc', value: i })
      }
    })

    expect(result.current[0]).toBe(5050)

    await vi.runAllTimersAsync()

    expect(effects.length).toBe(100)
    expect(effects[0]).toBe(1)
    expect(effects[99]).toBe(100)
  })
})
