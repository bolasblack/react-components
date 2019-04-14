export default {
  src: './packages',
  files: '**/*.{md,markdown,mdx}',
  typescript: true,
  codeSandbox: false,
  onCreateWebpackChain: config => {
    config.devtool('cheap-source-map')
    return config
  },
  modifyBabelRc: babelrc => {
    babelrc.presets.push('@babel/preset-env')
    return babelrc
  },
}
