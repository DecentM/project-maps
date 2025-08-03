import eslint from '@eslint/js'
import { Linter } from 'eslint'

export const eslintConfig: Linter.Config = {
  rules: eslint.configs.recommended.rules,
}
