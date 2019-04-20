export default {
  src: './packages',
  files: '**/*.{md,markdown,mdx}',
  typescript: true,
  codeSandbox: false,
  onCreateWebpackChain: config => {
    config.devtool('cheap-source-map')

    config.module
      .rule('ts')
      .use('ts-loader')
      .loader('ts-loader')

    // prettier-ignore
    config.module
      .rule('sass')
      .test(/\.s(c|a)ss$/)
      .use('style-loader').loader('style-loader').end()
      .use('css-loader').loader('css-loader').end()
      .use('sass-loader').loader('sass-loader').options({
        implementation: require('sass'),
      })

    return config
  },
  modifyBabelRc: babelrc => {
    babelrc.presets.push('@babel/preset-env')
    return babelrc
  },
}
