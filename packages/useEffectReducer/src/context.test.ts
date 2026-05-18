import { act, renderHook } from '../../../configs/testUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectReducer } from './useEffectReducer'

describe('useEffectReducer - effect context methods', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('ctx.getState() returns current state', async () => {
    const states: number[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string; value?: number }) => {
          if (action.type === 'set') {
            return [action.value || 0, { trigger: true }]
          }
          return [state]
        },
        async (effect, ctx) => {
          // Record the state when effect runs
          states.push(ctx.getState())
        },
        10,
      ),
    )

    expect(result.current[0]).toBe(10)

    act(() => {
      result.current[1]({ type: 'set', value: 20 })
    })

    await vi.runAllTimersAsync()

    // Effect should see the updated state
    expect(states).toEqual([20])

    act(() => {
      result.current[1]({ type: 'set', value: 30 })
    })

    await vi.runAllTimersAsync()

    expect(states).toEqual([20, 30])
  })

  it('ctx.cancel() aborts a specific run task', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string; id?: string }) => {
          if (action.type === 'start') {
            return [state, { action: 'start', id: action.id }]
          }
          if (action.type === 'cancel') {
            return [state, { action: 'cancel', id: action.id }]
          }
          return [state]
        },
        async (effect, ctx) => {
          if (effect.action === 'start') {
            sequence.push(`start-${effect.id}`)

            ctx
              .run(`task-${effect.id}`, async ({ abort }) => {
                return new Promise<void>((resolve, reject) => {
                  const timer = setTimeout(() => {
                    sequence.push(`complete-${effect.id}`)
                    resolve()
                  }, 100)

                  abort.addEventListener('abort', () => {
                    clearTimeout(timer)
                    sequence.push(`aborted-${effect.id}`)
                    reject(new Error('aborted'))
                  })
                })
              })
              .catch(() => {
                // Ignore abort errors
              })
          }

          if (effect.action === 'cancel') {
            sequence.push(`cancel-${effect.id}`)
            ctx.cancel(`task-${effect.id}`)
          }
        },
        0,
      ),
    )

    // Start a task
    act(() => {
      result.current[1]({ type: 'start', id: 'A' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
    })

    expect(sequence).toEqual(['start-A'])

    // Cancel it explicitly
    act(() => {
      result.current[1]({ type: 'cancel', id: 'A' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(sequence).toEqual(['start-A', 'cancel-A', 'aborted-A'])

    // Let the timer finish
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    // Should not have 'complete-A'
    expect(sequence).toEqual(['start-A', 'cancel-A', 'aborted-A'])
  })

  it('ctx.cancel() is safe to call on non-existent task', async () => {
    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string }) => {
          return [state, { type: action.type }]
        },
        async (effect, ctx) => {
          // Try to cancel a task that doesn't exist
          ctx.cancel('non-existent-task')
        },
        0,
      ),
    )

    // Should not throw
    act(() => {
      result.current[1]({ type: 'trigger' })
    })

    await vi.runAllTimersAsync()

    // Just verify it doesn't crash
    expect(result.current[0]).toBe(0)
  })

  it('ctx.getState() in run() callback reflects latest state', async () => {
    const statesInRun: number[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string; value?: number }) => {
          if (action.type === 'increment') {
            return [state + (action.value || 1)]
          }
          if (action.type === 'fetch') {
            return [state, { trigger: true }]
          }
          return [state]
        },
        async (effect, ctx) => {
          await ctx.run('fetch', async ({ dispatch }) => {
            // Dispatch will update state
            dispatch({ type: 'increment', value: 5 })

            // Wait for dispatch to process
            await new Promise(resolve => setTimeout(resolve, 10))

            // Now getState should reflect the new state
            statesInRun.push(ctx.getState())
          })
        },
        10,
      ),
    )

    act(() => {
      result.current[1]({ type: 'fetch' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20)
    })

    // State should be updated
    expect(result.current[0]).toBe(15)
    // And getState() should have seen the updated value
    expect(statesInRun).toEqual([15])
  })

  it('ctx.abort signal is aborted on unmount', async () => {
    let abortSignal: AbortSignal | null = null

    const { result, unmount } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string }) => {
          return [state, { trigger: true }]
        },
        async (effect, ctx) => {
          abortSignal = ctx.abort
          // Hold a reference to the abort signal
          await new Promise(resolve => setTimeout(resolve, 100))
        },
        0,
      ),
    )

    act(() => {
      result.current[1]({ type: 'trigger' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(abortSignal).not.toBeNull()
    expect((abortSignal as any as AbortSignal).aborted).toBe(false)

    // Unmount should abort the signal
    unmount()

    expect((abortSignal as any as AbortSignal).aborted).toBe(true)
  })
})
