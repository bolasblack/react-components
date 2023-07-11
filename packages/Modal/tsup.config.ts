import { defineConfig, Options } from 'tsup'

const basicOptions = {
  dts: true,
  entry: ['src/Modal.tsx'],
  outDir: 'lib',
  outExtension(ctx) {
    const middle = ctx.format === 'esm' ? '.esm' : ''
    return { js: `${middle}.js` }
  },
  sourcemap: true,
  format: ['cjs', 'esm'],
  platform: 'browser',
  loader: {
    '.css': 'text',
  },
} satisfies Options

export default defineConfig([basicOptions, { ...basicOptions, minify: true }])
