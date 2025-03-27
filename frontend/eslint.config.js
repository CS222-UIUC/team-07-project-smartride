import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config(
  { ignores: ['dist'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {},
    rules: {},
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    extends: [
      ...tseslint.configs.strictTypeChecked,
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-x': reactX,
      'react-dom': reactDom,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactX.configs['recommended-typescript'].rules,
      ...reactDom.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
