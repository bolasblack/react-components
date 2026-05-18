import { act, renderHook } from '../../../configs/testUtils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEffectReducer } from './useEffectReducer'

describe('useEffectReducer - abort and cancellation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('handles run() with AbortController', async () => {
    const results: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'fetch'; id: number }) => {
          return [state, { id: action.id }]
        },
        async (effect, ctx) => {
          try {
            const data = await ctx.run(`task-${effect.id}`, async ({ abort }) => {
              return new Promise<string>((resolve, reject) => {
                const timer = setTimeout(() => {
                  resolve(`done-${effect.id}`)
                }, 100)

                abort.addEventListener('abort', () => {
                  clearTimeout(timer)
                  reject(new Error('aborted'))
                })
              })
            })
            results.push(data)
          } catch (err) {
            // Ignore abort errors
          }
        },
        0,
      ),
    )

    act(() => {
      result.current[1]({ type: 'fetch', id: 1 })
      result.current[1]({ type: 'fetch', id: 2 })
    })

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(results).toEqual(['done-1', 'done-2'])
  })

  it('aborts tasks on unmount', async () => {
    const statuses: string[] = []

    const { result, unmount } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'start' }) => {
          return [state, { type: 'start' }]
        },
        async (effect, ctx) => {
          try {
            await ctx.run('task', async ({ abort }) => {
              return new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => {
                  statuses.push('completed')
                  resolve()
                }, 1000)

                abort.addEventListener('abort', () => {
                  clearTimeout(timer)
                  statuses.push('aborted')
                  reject(new Error('aborted'))
                })
              })
            })
          } catch (err) {
            // Expected
          }
        },
        0,
      ),
    )

    // First trigger the effect
    act(() => {
      result.current[1]({ type: 'start' })
    })

    // Wait a bit for the task to start
    await vi.advanceTimersByTimeAsync(50)

    // Then unmount
    unmount()

    // Check that task was aborted
    expect(statuses).toEqual(['aborted'])
  })

  it('run() with same id aborts previous task', async () => {
    const sequence: string[] = []

    const { result } = renderHook(() =>
      useEffectReducer(
        (state: number, action: { type: 'fetch'; version: number }) => {
          return [state, { version: action.version }]
        },
        async (effect, ctx) => {
          sequence.push(`start-${effect.version}`)
          try {
            await ctx.run('same-id', async ({ abort }) => {
              return new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => {
                  sequence.push(`complete-${effect.version}`)
                  resolve()
                }, 100)

                abort.addEventListener('abort', () => {
                  clearTimeout(timer)
                  sequence.push(`aborted-${effect.version}`)
                  reject(new Error('aborted'))
                })
              })
            })
          } catch (err) {
            // Expected for aborted tasks
          }
        },
        0,
      ),
    )

    // Start first task
    act(() => {
      result.current[1]({ type: 'fetch', version: 1 })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(50)
    })

    expect(sequence).toEqual(['start-1'])

    // Start second task with same run id - should abort first
    act(() => {
      result.current[1]({ type: 'fetch', version: 2 })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10)
    })

    expect(sequence).toContain('aborted-1')
    expect(sequence).toContain('start-2')

    // Let second task complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(sequence).toContain('complete-2')
    // First task should not have completed
    expect(sequence).not.toContain('complete-1')
  })
})
