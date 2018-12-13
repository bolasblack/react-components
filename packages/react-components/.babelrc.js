module.exports = {
  plugins: [
    [
      'babel-plugin-auto-import',
      {
        declarations: [
          { default: 'React', path: 'react' },
          { default: 'ReactDOM', path: 'react-dom' },
        ],
      },
    ],
  ],

  presets: [
    process.env.NODE_ENV !== 'test'
      ? null
      : [
          '@babel/preset-typescript',
          {
            allExtensions: true,
            isTSX: true,
          },
        ],
    [
      '@babel/preset-env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false,
      },
    ],
    '@babel/preset-react',
  ].filter(i => i),
}
