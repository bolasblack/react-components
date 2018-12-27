import { Configuration } from 'webpack'
import Sass from 'sass'

export default (baseConfig: Configuration, env: any, config: Configuration) => {
  config.module!.rules = config.module!.rules.concat([
    {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'babel-loader',
          options: require('../../.babelrc'),
        },
        'ts-loader',
        'react-docgen-typescript-loader',
      ],
    },
    {
      test: /\.stories\.(ts|tsx)$/,
      use: [
        {
          loader: '@storybook/addon-storysource/loader',
          options: { parser: 'typescript' },
        },
      ],
      enforce: 'pre',
    },
    {
      test: /\.stories\.(scss|sass)$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: { implementation: Sass },
        },
      ],
      enforce: 'pre',
    },
  ])

  config.resolve!.extensions!.push('.ts', '.tsx')

  return config
}
