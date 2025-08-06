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
    'unicorn/no-array-reduce': 'off',

    // Does not check if the function is from a library... e.g. a library that
    // exports a "find" function gets flagged as well, not just Array.prototype.find
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-method-this-argument': 'off',

    'unicorn/consistent-function-scoping': 'warn',
    'unicorn/prefer-string-slice': 'warn',
    'unicorn/no-useless-undefined': 'warn',
  },
}
