import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'

import { GLOB_TOML } from '../globs'
import { interopDefault } from '../utils'
import { StylisticConfigDefaults } from './stylistic'

export async function toml(
  options: OptionsOverrides & OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_TOML],
    overrides = {}
  } = options

  const { indent } = StylisticConfigDefaults

  const [
    pluginToml,
    parserToml
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-toml')),
    interopDefault(import('toml-eslint-parser'))
  ] as const)

  return [
    {
      name: 'dixidan/toml/setup',
      plugins: {
        toml: pluginToml
      }
    },
    {
      files,
      languageOptions: {
        parser: parserToml
      },
      name: 'dixidan/toml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'toml/keys-order': 'error',
        'toml/no-space-dots': 'error',
        'toml/no-unreadable-number-separator': 'error',
        'toml/precision-of-fractional-seconds': 'error',
        'toml/precision-of-integer': 'error',
        'toml/tables-order': 'error',
        'toml/vue-custom-block/no-parsing-error': 'error',
        'toml/comma-style': 'error',

        // stylistic
        'toml/indent': ['error', indent],
        'toml/padding-line-between-pairs': 'error',
        'toml/padding-line-between-tables': 'error',
        'toml/quoted-keys': 'error',
        'toml/array-bracket-newline': 'error',
        'toml/array-bracket-spacing': 'error',
        'toml/array-element-newline': 'error',
        'toml/inline-table-curly-spacing': 'error',
        'toml/key-spacing': 'error',
        'toml/spaced-comment': 'error',
        'toml/table-bracket-spacing': 'error',

        ...overrides
      }
    }
  ]
}
