import { fileURLToPath } from 'node:url'
import tseslint, { type ConfigArray } from 'typescript-eslint'

import { biomeConfig } from './biome.js'
import { unicornConfig } from './unicorn.js'
import { typescriptEslintConfig } from './typescript-eslint.js'
import { vueConfig } from './vue.js'
import { eslintConfig } from './eslint.js'
import { includeIgnoreFile } from '@eslint/compat'

export const config: ConfigArray = tseslint.config(
  includeIgnoreFile(fileURLToPath(new URL('../../../.gitignore', import.meta.url))),
  eslintConfig,
  typescriptEslintConfig,
  vueConfig,
  unicornConfig,
  biomeConfig
)
