module.exports = {
  extends: [
    './node_modules/@c4605/toolconfs/eslintrc.base',
    './node_modules/@c4605/toolconfs/eslintrc.prettier',
    './node_modules/@c4605/toolconfs/eslintrc.react',
    'plugin:storybook/recommended',
  ],
  overrides: [
    {
      files: ['**/*.js'],
      env: {
        es2020: true,
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['./node_modules/@c4605/toolconfs/eslintrc.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['**/*.spec.*', '**/*.test.*'],
      rules: {
        'react/no-find-dom-node': 'off',
      },
    },
  ],
}
