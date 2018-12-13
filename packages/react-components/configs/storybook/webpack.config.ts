import { Configuration } from 'webpack'

export default (baseConfig: Configuration, env: any, config: Configuration) => {
  config.module!.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: require('../../.babelrc'),
      },
      'ts-loader',
      'react-docgen-typescript-loader',
    ],
  })

  config.module!.rules.push({
    test: /\.stories\.(ts|tsx)$/,
    use: [
      {
        loader: '@storybook/addon-storysource/loader',
        options: { parser: 'typescript' },
      },
    ],
    enforce: 'pre',
  })

  config.resolve!.extensions!.push('.ts', '.tsx')

  return config
}
