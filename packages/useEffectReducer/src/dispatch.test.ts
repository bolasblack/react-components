import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectReducer } from './useEffectReducer'

describe('useEffectReducer - onEffect ctx.dispatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('can dispatch from onEffect context', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string; value?: number }) => {
          sequence.push(`reducer-${action.type}`)
          if (action.type === 'start') {
            return [state, { type: 'effect-start' }]
          }
          if (action.type === 'next') {
            return [state + (action.value || 1)]
          }
          return [state]
        },
        async (effect, ctx) => {
          sequence.push(`effect-${effect.type}`)
          // Dispatch from onEffect context
          ctx.dispatch({ type: 'next', value: 10 })
        },
        0,
      ),
    )

    act(() => {
      result.current[1]({ type: 'start' })
    })

    await vi.runAllTimersAsync()

    expect(sequence).toEqual([
      'reducer-start',
      'effect-effect-start',
      'reducer-next',
    ])
    expect(result.current[0]).toBe(10)
  })

  it('can dispatch from run() callback', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string; value?: number }) => {
          sequence.push(`reducer-${action.type}`)
          if (action.type === 'fetch') {
            return [state, { id: 1 }]
          }
          if (action.type === 'success') {
            return [state + (action.value || 1)]
          }
          return [state]
        },
        async (effect, ctx) => {
          sequence.push('effect-start')
          await ctx.run('fetch', async ({ dispatch }) => {
            sequence.push('run-callback')
            await new Promise(resolve => setTimeout(resolve, 100))
            sequence.push('run-dispatch')
            // Dispatch from run() callback
            dispatch({ type: 'success', value: 42 })
          })
          sequence.push('effect-end')
        },
        0,
      ),
    )

    act(() => {
      result.current[1]({ type: 'fetch' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    // Note: dispatch from run() is async, so reducer-success comes after effect-end
    expect(sequence).toEqual([
      'reducer-fetch',
      'effect-start',
      'run-callback',
      'run-dispatch',
      'effect-end',
      'reducer-success',
    ])
    expect(result.current[0]).toBe(42)
  })

  it('does NOT dispatch when task is aborted', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string; id?: number }) => {
          sequence.push(`reducer-${action.type}`)
          if (action.type === 'fetch') {
            return [state, { id: action.id }]
          }
          if (action.type === 'success') {
            return [state + 1]
          }
          return [state]
        },
        async (effect, ctx) => {
          sequence.push(`effect-${effect.id}`)
          // Use same run id 'fetch-task' for all effects
          await ctx
            .run('fetch-task', async ({ dispatch, abort }) => {
              sequence.push(`run-start-${effect.id}`)

              return new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => {
                  sequence.push(`timer-fired-${effect.id}`)
                  // Try to dispatch after completion
                  dispatch({ type: 'success' })
                  resolve()
                }, 100)

                abort.addEventListener('abort', () => {
                  sequence.push(`aborted-${effect.id}`)
                  clearTimeout(timer)
                  // Try to dispatch after abort - should be blocked!
                  dispatch({ type: 'success' })
                  reject(new Error('aborted'))
                })
              })
            })
            .catch(() => {
              sequence.push(`catch-${effect.id}`)
            })
        },
        0,
      ),
    )

    // Start first task
    act(() => {
      result.current[1]({ type: 'fetch', id: 1 })
    })

    // Wait for effect to start processing
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
    })

    // Start second task - should abort first because same run id
    act(() => {
      result.current[1]({ type: 'fetch', id: 2 })
    })

    // Wait for effect to start processing
    await act(async () => {
      await Promise.resolve()
    })

    // Let second task complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(sequence).toContain('aborted-1')
    expect(sequence).toContain('timer-fired-2')

    // Count how many times reducer-success was called
    const successCount = sequence.filter(s => s === 'reducer-success').length

    // Should only have 1 success (from task-2), not 2
    // Because task-1's dispatch after abort should be blocked
    expect(successCount).toBe(1)
    expect(result.current[0]).toBe(1)
  })

  it('blocks multiple dispatches from aborted task', async () => {
    const dispatchLog: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string }) => {
          dispatchLog.push(action.type)
          if (action.type === 'start') {
            return [state, { id: 'task' }]
          }
          return [state + 1]
        },
        async (effect, ctx) => {
          await ctx
            .run('task', async ({ dispatch, abort }) => {
              // Set up abort handler
              abort.addEventListener('abort', () => {
                // Try multiple dispatches after abort
                dispatch({ type: 'after-abort-1' })
                dispatch({ type: 'after-abort-2' })
                dispatch({ type: 'after-abort-3' })
              })

              // Wait forever
              await new Promise(() => {})
            })
            .catch(() => {})
        },
        0,
      ),
    )

    // Start task
    act(() => {
      result.current[1]({ type: 'start' })
    })

    // Cancel it
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    act(() => {
      result.current[1]({ type: 'start' })
    })

    await vi.runAllTimersAsync()

    // Should only have 'start' actions, no 'after-abort-*'
    expect(dispatchLog.filter(t => t.startsWith('after-abort'))).toEqual([])
  })

  it('dispatch in run() can trigger new effects', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string }) => {
          sequence.push(`reducer-${action.type}`)
          if (action.type === 'step1') {
            return [state, { step: 1 }]
          }
          if (action.type === 'step2') {
            return [state, { step: 2 }]
          }
          if (action.type === 'done') {
            return [state + 1]
          }
          return [state]
        },
        async (effect, ctx) => {
          sequence.push(`effect-step${effect.step}`)

          if (effect.step === 1) {
            await ctx.run('step1', async ({ dispatch }) => {
              await new Promise(resolve => setTimeout(resolve, 10))
              dispatch({ type: 'step2' })
            })
          }

          if (effect.step === 2) {
            await ctx.run('step2', async ({ dispatch }) => {
              await new Promise(resolve => setTimeout(resolve, 10))
              dispatch({ type: 'done' })
            })
          }
        },
        0,
      ),
    )

    act(() => {
      result.current[1]({ type: 'step1' })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(sequence).toEqual([
      'reducer-step1',
      'effect-step1',
      'reducer-step2',
      'effect-step2',
      'reducer-done',
    ])
    expect(result.current[0]).toBe(1)
  })

  it('dispatch in onEffect context works with rapid calls', async () => {
    const counters = { effects: 0, dispatches: 0 }

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: string }) => {
          if (action.type === 'trigger') {
            return [state, { trigger: true }]
          }
          if (action.type === 'increment') {
            counters.dispatches++
            return [state + 1]
          }
          return [state]
        },
        async (effect, ctx) => {
          counters.effects++
          ctx.dispatch({ type: 'increment' })
        },
        0,
      ),
    )

    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current[1]({ type: 'trigger' })
      }
    })

    await vi.runAllTimersAsync()

    // All 10 effects should fire
    expect(counters.effects).toBe(10)
    // All 10 dispatches should work
    expect(counters.dispatches).toBe(10)
    expect(result.current[0]).toBe(10)
  })
})
