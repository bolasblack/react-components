import { createRequire } from 'node:module'
import type React from 'react'
import * as testingLibraryReact from '@testing-library/react'

export const { fireEvent, render, waitFor } = testingLibraryReact
export type { RenderResult } from '@testing-library/react'

type Act = typeof testingLibraryReact.act

type RenderHookOptions<Props> = {
  initialProps?: Props
  wrapper?: React.ComponentType<React.PropsWithChildren<unknown>>
}

type RenderHookResult<Result, Props> = {
  result: { current: Result }
  rerender: (props?: Props) => void
  unmount: () => void
}

type RenderHook = <Result, Props = undefined>(
  callback: (props: Props) => Result,
  options?: RenderHookOptions<Props>,
) => RenderHookResult<Result, Props>

const require = createRequire(import.meta.url)
const testingLibraryReactWithHooks = testingLibraryReact as typeof testingLibraryReact & {
  act?: Act
  renderHook?: RenderHook
}

export const act: Act =
  testingLibraryReactWithHooks.act ?? (require('react-dom/test-utils') as { act: Act }).act

export const renderHook: RenderHook =
  testingLibraryReactWithHooks.renderHook ??
  (require('@testing-library/react-hooks') as { renderHook: RenderHook }).renderHook
