import { createRequire } from 'node:module'
import { defineConfig } from 'vitest/config'
import path from 'path'

const require = createRequire(import.meta.url)
const { getReactLegacyPackages } = require('./scripts/workspace_packages.ts') as {
  getReactLegacyPackages: (root?: string) => Array<{ dir: string; name: string }>
}
const reactLegacyPackageDirs = getReactLegacyPackages(__dirname).map(pkg => pkg.dir)
const reactLegacyTestInclude = reactLegacyPackageDirs.map(
  dir => `${dir}/src/**/*.{test,spec}.{ts,tsx}`,
)
const reactLegacyCoverageInclude = reactLegacyPackageDirs.map(dir => `${dir}/src/**/*.{ts,tsx}`)
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
