import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactCompiler from 'eslint-plugin-react-compiler'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'public/s_models'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      
      'react/no-unknown-property': ['error', { 
        ignore: [
          'object', 'geometry', 'material', 'rotation', 'intensity', 
          'position', 'dispose', 'primitive', 'args', 'map', 'transparent'
        ] 
      }],

      'react-compiler/react-compiler': 'error',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      '@typescript-eslint/no-explicit-any': 'warn' 
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  eslintConfigPrettier
)