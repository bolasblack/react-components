module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'babel-plugin-auto-import',
      {
        declarations: [
          { default: 'regeneratorRuntime', path: 'regenerator-runtime' },
        ],
      },
    ],
  ],

  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
      },
    ],
    '@babel/preset-react',
  ],
}
