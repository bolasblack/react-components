import { defineConfig, Options } from 'tsup'

const basicOptions = {
  dts: true,
  entry: [],
  outDir: 'lib',
  outExtension(ctx) {
    const esExt = ctx.format === 'esm' ? '.esm' : ''
    const minExt = ctx.options.minify ? '.min' : ''
    return { js: `${esExt}${minExt}.js` }
  },
  sourcemap: true,
  format: ['cjs', 'esm'],
  platform: 'browser',
  loader: {
    '.css': 'text',
  },
} satisfies Options

export const generateConfig = (options: {
  entry: Options['entry']
}): ReturnType<typeof defineConfig> =>
  defineConfig([
    { ...basicOptions, entry: options.entry },
    { ...basicOptions, entry: options.entry, minify: true },
  ])
