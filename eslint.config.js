import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettierConfig from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'warn',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettierConfig,
  { ignores: ['dist/**', 'node_modules/**', 'scripts/**'] },
)
