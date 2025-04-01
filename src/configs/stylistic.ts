import type { StylisticConfig, StylisticOptions, TypedFlatConfigItem } from '../types'

import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false
}

export async function stylistic(
  options: StylisticOptions = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    indent,
    jsx,
    overrides = {},
    quotes,
    semi
  } = {
    ...StylisticConfigDefaults,
    ...options
  }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const config = pluginStylistic.configs.customize({
    indent,
    jsx,
    pluginName: 'style',
    quotes,
    semi
  })

  return [
    {
      name: 'dixidan/stylistic/rules',
      plugins: {
        antfu: pluginAntfu,
        style: pluginStylistic
      },
      rules: {
        ...config.rules,

        'antfu/curly': 'error',
        'antfu/consistent-chaining': 'error',
        'antfu/consistent-list-newline': 'error',
        'style/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
        'style/comma-dangle': ['error', 'never'],
        'style/brace-style': ['error', '1tbs'],

        ...overrides
      }
    }
  ]
}
