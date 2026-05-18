import { generateConfig } from '../../configs/tsdown.config.base.mts'

export default generateConfig({
  entry: [
    'src/index.ts',
    'src/types.ts',
    'src/utils.ts',
    'src/useAsync.ts',
    'src/useAsyncFnFactory.ts',
  ],
})
