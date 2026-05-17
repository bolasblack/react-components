import * as React from 'react'
import { useEffect, useReducer } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useEffectReducer } from './useEffectReducer'

type State = {
  status: 'idle' | 'loading' | 'success' | 'failure'
  dog: string | null
  error: string | null
}

type Action =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; data: { message: string } }
  | { type: 'REJECT'; error: string }
  | { type: 'CANCEL' }

type Effect = { type: 'fetchDog' }

export default {
  title: 'Library/use-effect-reducer/DogFetcher',
} satisfies Meta

export const ImplementedBy_useReducer: StoryFn = () => {
  const [state, dispatch] = useReducer(
    (state: State, event: Action): State => {
      switch (event.type) {
        case 'FETCH':
          return {
            ...state,
            status: 'loading',
          }
        case 'RESOLVE':
          return {
            ...state,
            status: 'success',
            dog: event.data.message,
          }
        case 'REJECT':
          return {
            ...state,
            status: 'failure',
            error: event.error,
          }
        case 'CANCEL':
          return {
            ...state,
            status: 'idle',
          }
        default:
          return state
      }
    },
    {
      status: 'idle',
      dog: null,
      error: null,
    },
  )
  const { error, dog, status } = state

  useEffect(() => {
    if (state.status === 'loading') {
      let canceled = false

      const fetchDog = async (): Promise<void> => {
        try {
          const response = await fetch('https://dog.ceo/api/breeds/image/random')
          if (!response.ok) throw new Error('Network error')
          await new Promise(r => setTimeout(r, 1000 * 2))
          const data = (await response.json()) as { message: string }
          if (canceled) return
          dispatch({ type: 'RESOLVE', data })
        } catch (error) {
          if (canceled) return
          dispatch({
            type: 'REJECT',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      void fetchDog()

      return () => {
        canceled = true
      }
    }
  }, [state.status])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {error && <span style={{ color: 'red' }}>{error}</span>}
      <figure
        className="dog"
        onDoubleClick={() => dispatch({ type: 'FETCH' })}
        style={{ margin: 0 }}
      >
        {dog && <img src={dog} alt="doggo" style={{ maxWidth: 320, borderRadius: 8 }} />}
      </figure>

      <button onClick={() => dispatch({ type: 'FETCH' })}>
        {status === 'loading' && 'Fetching...'}
        {status === 'success' && 'Fetch another dog!'}
        {status === 'idle' && 'Fetch dog'}
        {status === 'failure' && 'Try again'}
      </button>
      <button onClick={() => dispatch({ type: 'CANCEL' })}>Cancel</button>
    </div>
  )
}

export const ImplementedBy_useEffectReducer: StoryFn = () => {
  const [state, dispatch] = useEffectReducer(
    (current: State, action: Action): [State, Effect?] => {
      switch (action.type) {
        case 'FETCH':
          // Reducer declares effects inline, so no extra useEffect is needed.
          return [{ ...current, status: 'loading' }, { type: 'fetchDog' }]
        case 'RESOLVE':
          return [{ ...current, status: 'success', dog: action.data.message }]
        case 'REJECT':
          return [{ ...current, status: 'failure', error: action.error }]
        case 'CANCEL':
          return [{ ...current, status: 'idle' }]
        default:
          return [current]
      }
    },
    async (effect, ctx) => {
      if (effect.type !== 'fetchDog') return

      // Root-level abort signal stops work when a new effect runs or the component unmounts.
      const rootAbortSignal = ctx.abort
      // Root dispatch remains valid even after nested scopes complete.
      const rootDispatch = ctx.dispatch

      try {
        await ctx.run('dog', async nestedCtx => {
          const response = await fetch('https://dog.ceo/api/breeds/image/random', {
            signal: nestedCtx.abort,
          })
          if (!response.ok) throw new Error('Network error')
          await new Promise(r => setTimeout(r, 1000 * 2))
          const data = (await response.json()) as { message: string }

          // Dispatch inside this scope becomes a no-op once the scope aborts.
          nestedCtx.dispatch({ type: 'RESOLVE', data })
        })
      } catch (error) {
        if (!rootAbortSignal.aborted) {
          rootDispatch({
            type: 'REJECT',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    },
    {
      status: 'idle',
      dog: null,
      error: null,
    },
  )

  const { error, dog, status } = state

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {error && <span style={{ color: 'red' }}>{error}</span>}
      <figure
        className="dog"
        onDoubleClick={() => dispatch({ type: 'FETCH' })}
        style={{ margin: 0 }}
      >
        {dog && <img src={dog} alt="doggo" style={{ maxWidth: 320, borderRadius: 8 }} />}
      </figure>

      <button onClick={() => dispatch({ type: 'FETCH' })}>
        {status === 'loading' && 'Fetching...'}
        {status === 'success' && 'Fetch another dog!'}
        {status === 'idle' && 'Fetch dog'}
        {status === 'failure' && 'Try again'}
      </button>
      <button onClick={() => dispatch({ type: 'CANCEL' })}>Cancel</button>
    </div>
  )
}
