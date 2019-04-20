import * as fs from 'fs'
import { Config } from 'bili'

const { dependencies, peerDependencies } = JSON.parse(
  fs.readFileSync('./package.json').toString(),
)

const externals = Object.keys(dependencies)
  .concat(Object.keys(peerDependencies))
  .filter(dep => !dep.startsWith('@types/'))
  .map(dep => require.resolve(dep))

export default <Config>{
  input: 'src/Modal.tsx',
  output: {
    sourceMap: true,
    extractCSS: false,
    target: 'browser',
    format: ['cjs', 'cjs-min', 'es', 'es-min'],
    dir: 'lib',
  },
  externals,
  bundleNodeModules: true,
}
