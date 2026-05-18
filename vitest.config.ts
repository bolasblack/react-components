import { defineConfig } from 'vitest/config'
import path from 'path'

const reactLegacyTestInclude = [
  'packages/DocumentElement/src/**/*.{test,spec}.{ts,tsx}',
  'packages/Modal/src/**/*.{test,spec}.{ts,tsx}',
  'packages/Popover/src/**/*.{test,spec}.{ts,tsx}',
  'packages/Portal/src/**/*.{test,spec}.{ts,tsx}',
  'packages/useAsync/src/**/*.{test,spec}.{ts,tsx}',
]
const reactLegacyCoverageInclude = [
  'packages/DocumentElement/src/**/*.{ts,tsx}',
  'packages/Modal/src/**/*.{ts,tsx}',
  'packages/Popover/src/**/*.{ts,tsx}',
  'packages/Portal/src/**/*.{ts,tsx}',
  'packages/useAsync/src/**/*.{ts,tsx}',
]
const isReactLegacyTest = process.env.REACT_LEGACY_TEST === '1'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./configs/vitestSetup.ts'],
    include: isReactLegacyTest
      ? reactLegacyTestInclude
      : ['packages/**/src/**/*.{test,spec}.{ts,tsx}'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: isReactLegacyTest ? reactLegacyCoverageInclude : ['packages/**/src/**/*.{ts,tsx}'],
      exclude: [
        'packages/**/src/**/*.{test,spec}.{ts,tsx}',
        'packages/**/src/**/*.stories.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './packages'),
    },
  },
})
