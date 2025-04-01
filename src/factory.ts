import { FlatConfigComposer } from 'eslint-flat-config-utils'
import { isPackageExists } from 'local-pkg'
import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from './types'
import type { RuleOptions } from './typegen'
import type { Linter } from 'eslint'
import { ignores, javascript, typescript, stylistic, vue, node, unocss } from './configs'

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
    jsx: enableJsx = true,
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
    node()
  )

  if (enableVue) {
    componentExts.push('vue')
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
