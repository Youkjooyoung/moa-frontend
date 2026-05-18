// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores([
  'dist',
  'dist-ssr',
  'storybook-static',
  '.cache',
  'coverage',
  'node_modules',
]), {
  files: ['**/*.{js,jsx}'],
  extends: [
    js.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
  ],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
    },
  },
  rules: {
    'no-empty': 'warn',
    'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
    'react-hooks/purity': 'warn',
    'react-hooks/set-state-in-effect': 'warn',
    'react-refresh/only-export-components': 'warn',
  },
}, {
  files: ['.storybook/**/*.{js,jsx,mjs,cjs}'],
  languageOptions: {
    globals: globals.node,
  },
}, ...storybook.configs["flat/recommended"]])
