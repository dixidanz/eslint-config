import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'
import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types'
import type { RuleOptions } from './typegen'
import type { Linter } from 'eslint'
import { ignores, javascript, typescript, stylistic, vue, node, unocss, imports, jsonc, sortPackageJson, sortTsconfig, yaml, sortPnpmWorkspace, astro, toml, formatters, markdown, regexp, jsx, test } from './configs'

export const defaultPluginRenaming = {
  '@stylistic': 'style',
  '@typescript-eslint': 'ts',
  'import-x': 'import',
  'n': 'node',
  'vitest': 'test',
  'yml': 'yaml'
}

const VuePackages = [
  'vue',
  'nuxt',
  'vitepress',
  '@slidev/cli'
]

export function dixidan(
  options: OptionsConfig & Omit<TypedFlatConfigItem, 'files'> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
) {
  const {
    componentExts = [],
    astro: enableAstro = false,
    jsx: enableJsx = true,
    regexp: enableRegexp = true,
    typescript: enableTypeScript = isPackageExists('typescript'),
    unocss: enableUnoCSS = false,
    vue: enableVue = VuePackages.some(i => isPackageExists(i))
  } = options

  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === 'object'
      ? options.stylistic
      : {}

  if (stylisticOptions && !('jsx' in stylisticOptions)) {
    stylisticOptions.jsx = enableJsx
  }

  const configs: Awaitable<TypedFlatConfigItem[]>[] = []

  const typescriptOptions = resolveSubOptions(options, 'typescript')

  configs.push(
    ignores(options.ignores),
    javascript({ overrides: getOverrides(options, 'javascript') }),
    node(),
    imports()
  )

  if (enableVue) {
    componentExts.push('vue')
  }

  if (enableJsx) {
    configs.push(jsx())
  }

  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, 'typescript')
    }))
  }

  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic')
    }))
  }

  if (enableRegexp) {
    configs.push(regexp(typeof enableRegexp === 'boolean' ? {} : enableRegexp))
  }

  if (options.test ?? true) {
    configs.push(test({
      overrides: getOverrides(options, 'test')
    }))
  }

  if (enableVue) {
    configs.push(vue({
      overrides: getOverrides(options, 'vue'),
      typescript: !!enableTypeScript
    }))
  }

  if (enableUnoCSS) {
    configs.push(unocss({
      ...resolveSubOptions(options, 'unocss'),
      overrides: getOverrides(options, 'unocss')
    }))
  }

  if (enableAstro) {
    configs.push(astro({
      overrides: getOverrides(options, 'astro')
    }))
  }

  if (options.jsonc ?? true) {
    configs.push(
      jsonc({
        overrides: getOverrides(options, 'jsonc')
      }),
      sortPackageJson(),
      sortTsconfig()
    )
  }

  if (options.yaml ?? true) {
    configs.push(
      yaml({
        overrides: getOverrides(options, 'yaml')
      }),
      sortPnpmWorkspace()
    )
  }

  if (options.toml ?? true) {
    configs.push(toml({
      overrides: getOverrides(options, 'toml')
    }))
  }

  if (options.markdown ?? true) {
    configs.push(
      markdown(
        {
          componentExts,
          overrides: getOverrides(options, 'markdown')
        }
      )
    )
  }

  const formattersOptions = options.formatters === false
    ? false
    : {
        markdown: !!(options.markdown ?? true),
        astro: !!options.astro,
        html: true,
        ...(typeof options.formatters === 'object' ? options.formatters : {})
      }

  if (formattersOptions) {
    configs.push(formatters(
      formattersOptions
    ))
  }

  let composer = new FlatConfigComposer()

  composer = composer.append(
    ...configs,
    ...userConfigs as any
  ).renamePlugins(defaultPluginRenaming)

  return composer
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): ResolvedOptions<OptionsConfig[K]> {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any
}

export function getOverrides<K extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: K
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key)
  return {
    ...(options.overrides as any)?.[key],
    ...'overrides' in sub
      ? sub.overrides
      : {}
  }
}
