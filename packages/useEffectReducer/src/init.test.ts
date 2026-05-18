import { act, renderHook } from '../../../configs/testUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectReducer } from './useEffectReducer'

describe('useEffectReducer - init function', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('uses init function to compute initial state', () => {
    const init = vi.fn((count: number) => {
      return [count * 2] as const
    })

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'inc' }) => {
          return [state + 1]
        },
        5,
        init,
      ),
    )

    expect(init).toHaveBeenCalledWith(5)
    expect(init).toHaveBeenCalledTimes(1)
    expect(result.current[0]).toBe(10)
  })

  it('init function can trigger effects', async () => {
    const effects: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'inc' }) => {
          return [state + 1]
        },
        async (effect: { id: string }) => {
          effects.push(effect.id)
        },
        10,
        (count: number) => {
          return [count * 2, { id: 'init-effect' }]
        },
      ),
    )

    expect(result.current[0]).toBe(20)

    await vi.runAllTimersAsync()

    expect(effects).toEqual(['init-effect'])
  })

  it('init function with onEffect handler', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'action' }) => {
          sequence.push('reducer')
          return [state + 1, { from: 'action' }]
        },
        async (effect: { from: string }) => {
          sequence.push(`effect-${effect.from}`)
        },
        100,
        (initialCount: number) => {
          sequence.push('init')
          return [initialCount, { from: 'init' }]
        },
      ),
    )

    // The init effect is processed immediately during render
    expect(sequence).toEqual(['init', 'effect-init'])
    expect(result.current[0]).toBe(100)

    await vi.runAllTimersAsync()

    act(() => {
      result.current[1]({ type: 'action' })
    })

    await vi.runAllTimersAsync()
    expect(sequence).toEqual(['init', 'effect-init', 'reducer', 'effect-action'])
  })
})
