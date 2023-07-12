import { generateConfig } from '../../configs/tsup.config.base'

export default generateConfig({
  entry: [
    'src/index.ts',
    'src/types.ts',
    'src/utils.ts',
    'useAsync.ts',
    'useAsyncFnFactory.ts',
  ],
})
