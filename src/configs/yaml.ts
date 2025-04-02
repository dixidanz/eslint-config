import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from '../types'
import { GLOB_YAML } from '../globs'

import { interopDefault } from '../utils'
import { StylisticConfigDefaults } from './stylistic'

export async function yaml(
  options: OptionsOverrides & OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_YAML],
    overrides = {}
  } = options

  const { indent } = StylisticConfigDefaults

  const [
    pluginYaml,
    parserYaml
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser'))
  ] as const)

  return [
    {
      name: 'dixidan/yaml/setup',
      plugins: {
        yaml: pluginYaml
      }
    },
    {
      files,
      languageOptions: {
        parser: parserYaml
      },
      name: 'dixidan/yaml/rules',
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/plain-scalar': 'error',
        'yaml/vue-custom-block/no-parsing-error': 'error',
        'yaml/no-irregular-whitespace': 'error',

        // stylistic
        'yaml/block-mapping-question-indicator-newline': 'error',
        'yaml/block-sequence-hyphen-indicator-newline': 'error',
        'yaml/indent': ['error', indent],
        'yaml/no-tab-indent': 'error',
        'yaml/flow-mapping-curly-newline': 'error',
        'yaml/flow-mapping-curly-spacing': 'error',
        'yaml/flow-sequence-bracket-newline': 'error',
        'yaml/flow-sequence-bracket-spacing': 'error',
        'yaml/key-spacing': 'error',
        'yaml/quotes': ['error', { avoidEscape: true, prefer: 'single' }],
        'yml/no-multiple-empty-lines': 'error',
        'yaml/spaced-comment': 'error',

        ...overrides
      }
    }
  ]
}
