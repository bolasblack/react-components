import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'

const globals = {
  browser: {
    window: 'readonly',
    document: 'readonly',
    navigator: 'readonly',
    console: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
  },
  react: {
    React: 'readonly',
    ReactDOM: 'readonly',
    JSX: 'readonly',
  },
  vitest: {
    describe: 'readonly',
    it: 'readonly',
    expect: 'readonly',
    test: 'readonly',
    beforeEach: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
    vi: 'readonly',
  },
  nodejs: {
    process: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    module: 'readonly',
    require: 'readonly',
    exports: 'readonly',
    console: 'readonly',
  },
}

export default [
  // Global ignores (must be first)
  {
    ignores: [
      '.git/**',
      'coverage/**',
      'node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/lib/**',
      '**/__snapshots__/**',
    ],
  },

  // Base JavaScript config
  js.configs.recommended,

  // React config
  {
    files: ['packages/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.react,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  // TypeScript config
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {},
    },
    rules: {
      // TypeScript recommended rules
      ...tseslint.configs.recommended.rules,
      // TypeScript rules - off
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-redeclare': 'off', // TypeScript handles this better
      // TypeScript rules - error
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter',
        },
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreVoid: true },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
    },
  },

  // JavaScript specific config
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.nodejs,
      },
    },
  },

  // Test files config
  {
    files: ['**/*.spec.*', '**/*.test.*'],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    rules: {
      'react/no-find-dom-node': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'no-empty-pattern': 'off',
    },
  },

  // Base rules for all files
  {
    rules: {
      'max-classes-per-file': 'off',
      'no-shadow': 'off',
      'no-unused-vars': [
        'error',
        {
          args: 'none',
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
        },
      ],
      curly: ['error', 'multi-line'],
    },
  },

  // Storybook config
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    plugins: {
      storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },

  // Prettier (must be last)
  prettier,
]
