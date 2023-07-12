import * as React from 'react'
import { useRef } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useAsyncFnFactory } from './useAsyncFnFactory'

export default {
  title: 'Library/use-async/useAsyncFnFactory',
} satisfies Meta

export const BasicUsage: StoryFn = () => {
  const callbacksRef = useRef<null | {
    resolve: (value: string) => void
    reject: (error: Error) => void
  }>(null)

  const [reqState, reRun] = useAsyncFnFactory(
    () => async (timeWhenClick?: string) => {
      return new Promise<string>((resolve, reject) => {
        callbacksRef.current = {
          resolve() {
            if (timeWhenClick == null) {
              resolve(
                `Current time: ${new Date().toString()}, issued after initialized`,
              )
            } else {
              resolve(
                `Current time: ${new Date().toString()}, issued when clicked at ${timeWhenClick}`,
              )
            }
          },
          reject,
        }
      })
    },
    [],
  )

  return (
    <>
      <p>
        <button onClick={() => reRun(new Date().toString())}>
          Load current time
        </button>
        <button
          onClick={() => callbacksRef.current?.resolve(new Date().toString())}
        >
          Load success
        </button>
        <button
          onClick={() => callbacksRef.current?.reject(new Error('Load failed'))}
        >
          Load failed
        </button>
      </p>

      <p>
        {reqState.loading && <span>Loading...</span>}
        {(reqState.error as any) && (
          <span style={{ color: 'red' }}>
            {(reqState.error as any).message}
          </span>
        )}
        {reqState.value && (
          <span style={{ color: 'green' }}>{reqState.value}</span>
        )}
      </p>
    </>
  )
}
