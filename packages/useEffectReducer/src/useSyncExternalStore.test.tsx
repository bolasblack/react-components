import { act, renderHook } from '../../../configs/testUtils'
import { useSyncExternalStore } from 'react'
import { describe, expect, it } from 'vitest'

describe('useSyncExternalStore batching behavior', () => {
  it('multiple synchronous updates - how many renders?', () => {
    let renderCount = 0

    // Create a simple store
    const store = (() => {
      let value = 0
      const listeners = new Set<() => void>()

      return {
        subscribe(listener: () => void) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },

        getSnapshot() {
          return value
        },

        setValue(newValue: number) {
          value = newValue
          listeners.forEach(l => l()) // Notify all listeners
        },

        setMultipleTimes() {
          // Set 3 times synchronously
          this.setValue(1)
          this.setValue(2)
          this.setValue(3)
        },
      }
    })()

    const { result } = renderHook(() => {
      renderCount++
      return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
    })

    expect(result.current).toBe(0)
    expect(renderCount).toBe(1)

    // Now trigger multiple updates
    act(() => {
      store.setMultipleTimes()
    })

    // The key question: did it render 3 times or 1 time?
    expect(result.current).toBe(3)
    expect(renderCount).toBe(2) // Initial + 1 batched update!
  })

  it('remove() would cause the same "problem"', () => {
    let renderCount = 0

    const store = (() => {
      let queue: number[] = []
      const listeners = new Set<() => void>()

      return {
        subscribe(listener: () => void) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },

        getSnapshot() {
          // Must return same reference if unchanged!
          return queue
        },

        push(value: number) {
          queue = [...queue, value]
          listeners.forEach(l => l())
        },

        remove(value: number) {
          queue = queue.filter(v => v !== value)
          listeners.forEach(l => l()) // This ALSO triggers listeners!
        },

        pushAndRemove() {
          this.push(1)
          this.push(2)
          this.push(3)
          // Now remove them
          this.remove(1)
          this.remove(2)
          // Total: 5 notifications!
        },
      }
    })()

    const { result } = renderHook(() => {
      renderCount++
      const queue = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
      return queue
    })

    expect(renderCount).toBe(1)

    act(() => {
      store.pushAndRemove()
    })

    // Even with 5 notifications, still only 1 additional render!
    expect(renderCount).toBe(2)
    expect(result.current).toEqual([3])
  })

  it('async updates DO cause multiple renders', async () => {
    let renderCount = 0

    const store = (() => {
      let value = 0
      const listeners = new Set<() => void>()

      return {
        subscribe(listener: () => void) {
          listeners.add(listener)
          return () => listeners.delete(listener)
        },

        getSnapshot() {
          return value
        },

        setValue(newValue: number) {
          value = newValue
          listeners.forEach(l => l())
        },

        async setMultipleTimesAsync() {
          this.setValue(1)
          await Promise.resolve() // Break synchronous execution
          this.setValue(2)
          await Promise.resolve()
          this.setValue(3)
        },
      }
    })()

    const { result } = renderHook(() => {
      renderCount++
      return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
    })

    expect(renderCount).toBe(1)

    await act(async () => {
      await store.setMultipleTimesAsync()
    })

    // With async, each update causes a render!
    expect(renderCount).toBe(4) // 1 initial + 3 updates
    expect(result.current).toBe(3)
  })
})
