import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'tsdown'
import type { TsdownPlugin, UserConfig } from 'tsdown'

const inlineCssPlugin: TsdownPlugin = {
  name: 'inline-css',
  resolveId(source, importer) {
    if (!source.endsWith('.css?inline') || !importer) return null

    return `${resolve(dirname(importer), source.slice(0, -'?inline'.length))}?inline`
  },
  load(id) {
    if (!id.endsWith('.css?inline')) return null

    const css = readFileSync(id.slice(0, -'?inline'.length), 'utf8')
    return `export default ${JSON.stringify(css)}`
  },
}

const createOptions = (options: {
  dts: UserConfig['dts']
  entry: UserConfig['entry']
  minify?: UserConfig['minify']
}): UserConfig => ({
  checks: {
    pluginTimings: false,
  },
  clean: false,
  dts: options.dts,
  entry: options.entry,
  outDir: 'lib',
  outExtensions(ctx) {
    const esExt = ctx.format === 'esm' || ctx.format === 'es' ? '.esm' : ''
    const minExt = options.minify ? '.min' : ''
    return { js: `${esExt}${minExt}.js` }
  },
  sourcemap: true,
  format: ['cjs', 'esm'],
  platform: 'browser',
  loader: {
    '.css': 'text',
  },
  minify: options.minify,
  plugins: [inlineCssPlugin],
})

export const generateConfig = (options: {
  entry: UserConfig['entry']
}): ReturnType<typeof defineConfig> =>
  defineConfig([
    createOptions({ dts: true, entry: options.entry }),
    createOptions({ dts: false, entry: options.entry, minify: true }),
  ])
