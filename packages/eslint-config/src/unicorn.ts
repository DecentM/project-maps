import { Linter } from 'eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export const unicornConfig: Linter.Config = {
  plugins: { unicorn: eslintPluginUnicorn },

  rules: {
    ...eslintPluginUnicorn.configs['recommended'].rules,

    'unicorn/switch-case-braces': 'off',
    'unicorn/empty-brace-spaces': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/number-literal-case': 'off',
    'unicorn/prevent-abbreviations': 'off',

    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/prefer-string-slice': 'warn',
    'unicorn/no-useless-undefined': 'warn',
  },
}
