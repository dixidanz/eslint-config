import type { OptionsFormatters, TypedFlatConfigItem } from '../types'
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '../vender/prettier-types'

import { GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_HTML } from '../globs'

import { ensurePackages, interopDefault, isPackageInScope, parserPlain } from '../utils'
import { StylisticConfigDefaults } from './stylistic'

function mergePrettierOptions(
  options: VendoredPrettierOptions,
  overrides: VendoredPrettierRuleOptions = {}
): VendoredPrettierRuleOptions {
  return {
    ...options,
    ...overrides,
    plugins: [
      ...(overrides.plugins || []),
      ...(options.plugins || [])
    ]
  }
}

export async function formatters(
  options: OptionsFormatters | true = {}
): Promise<TypedFlatConfigItem[]> {
  if (options === true) {
    options = {
      astro: isPackageInScope('prettier-plugin-astro'),
      markdown: true,
      html: true
    }
  }

  await ensurePackages([
    'eslint-plugin-format',
    options.astro ? 'prettier-plugin-astro' : undefined
  ])

  const {
    indent,
    quotes,
    semi
  } = StylisticConfigDefaults

  const prettierOptions: VendoredPrettierOptions = {
    endOfLine: 'auto',
    printWidth: 120,
    semi,
    singleQuote: quotes === 'single',
    tabWidth: typeof indent === 'number' ? indent : 2,
    trailingComma: 'all',
    useTabs: indent === 'tab'
  } satisfies VendoredPrettierOptions

  const pluginFormat = await interopDefault(import('eslint-plugin-format'))

  const configs: TypedFlatConfigItem[] = [
    {
      name: 'dixidan/formatter/setup',
      plugins: {
        format: pluginFormat
      }
    }
  ]

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: parserPlain
      },
      name: 'dixidan/formatter/html',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'html'
          })
        ]
      }
    })
  }

  if (options.markdown) {
    configs.push({
      files: [GLOB_MARKDOWN],
      languageOptions: {
        parser: parserPlain
      },
      name: 'dixidan/formatter/markdown',
      rules: {
        [`format/prettier`]: [
          'error',
          mergePrettierOptions(prettierOptions, {
            embeddedLanguageFormatting: 'off',
            parser: 'markdown'
          })
        ]
      }
    })
  }

  if (options.astro) {
    configs.push({
      files: [GLOB_ASTRO],
      languageOptions: {
        parser: parserPlain
      },
      name: 'dixidan/formatter/astro',
      rules: {
        'format/prettier': [
          'error',
          mergePrettierOptions(prettierOptions, {
            parser: 'astro',
            plugins: [
              'prettier-plugin-astro'
            ]
          })
        ]
      }
    })

    configs.push({
      files: [GLOB_ASTRO, GLOB_ASTRO_TS],
      name: 'dixidan/formatter/astro/disables',
      rules: {
        'style/arrow-parens': 'off',
        'style/block-spacing': 'off',
        'style/comma-dangle': 'off',
        'style/indent': 'off',
        'style/no-multi-spaces': 'off',
        'style/quotes': 'off',
        'style/semi': 'off'
      }
    })
  }

  return configs
}
