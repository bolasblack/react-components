import { isDev } from './consts'

export default {
  plugins: [
    isDev ? 'react-hot-loader/babel' : undefined,
    [
      'transform-imports',
      {
        ramda: {
          transform: 'ramda/es/${member}',
          preventFullImport: true,
        },
        lodash: {
          transform: 'lodash/${member}',
          preventFullImport: true,
        },
      },
    ],
  ].filter(i => i),
}
