import type { Linter } from 'eslint'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ConfigNames, RuleOptions } from './typegen'

export type Awaitable<T> = T | Promise<T>

export interface Rules extends RuleOptions {}

export type { ConfigNames }

export type TypedFlatConfigItem = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'> & {
  plugins?: Record<string, any>
}

export interface OptionsFiles {
  /**
   * Override the `files` option to provide custom globs.
   */
  files?: string[]
}

export interface OptionsOverrides {
  overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsComponentExts {
  /**
   * Additional extensions for components.
   *
   * @example ['vue']
   * @default []
   */
  componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
  /**
  /**
   * Additional parser options for TypeScript.
   */
  parserOptions?: Partial<ParserOptions>

  /**
   * Glob patterns for files that should be type aware.
   * @default ['**\/*.{ts,tsx}']
   */
  filesTypeAware?: string[]

  /**
   * Glob patterns for files that should not be type aware.
   * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
   */
  ignoresTypeAware?: string[]
}

export interface OptionsTypeScriptWithTypes {
  /**
   * When this options is provided, type aware rules will be enabled.
   * @see https://typescript-eslint.io/linting/typed-linting/
   */
  tsconfigPath?: string

  /**
   * Override type aware rules.
   */
  overridesTypeAware?: TypedFlatConfigItem['rules']
}

export type OptionsTypescript =
  (OptionsTypeScriptWithTypes & OptionsOverrides)
  | (OptionsTypeScriptParserOptions & OptionsOverrides)

export interface OptionsHasTypeScript {
  typescript?: boolean
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}
export interface OptionsUnoCSS extends OptionsOverrides {
  /**
   * Enable attributify support.
   * @default false
   */
  attributify?: boolean
  /**
   * Enable strict mode by throwing errors about blocklisted classes.
   * @default false
   */
  strict?: boolean
}

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {}

export interface OptionsConfig extends OptionsComponentExts {

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable TypeScript support.
   *
   * Passing an object to enable TypeScript Language Server support.
   *
   * @default auto-detect based on the dependencies
   */
  typescript?: boolean | OptionsTypescript

  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean

  /**
   * Enable JSX related rules.
   *
   * Currently only stylistic rules are included.
   *
   * @default true
   */
  jsx?: boolean

  /**
   * Enable stylistic rules.
   *
   * @see https://eslint.style/
   * @default true
   */
  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
   * Enable unocss rules.
   *
   * Requires installing:
   * - `@unocss/eslint-plugin`
   *
   * @default false
   */
  unocss?: boolean | OptionsUnoCSS

  /**
   * Provide overrides for rules for each integration.
   *
   * @deprecated use `overrides` option in each integration key instead
   */
  overrides?: {
    stylistic?: TypedFlatConfigItem['rules']
    javascript?: TypedFlatConfigItem['rules']
    typescript?: TypedFlatConfigItem['rules']
    test?: TypedFlatConfigItem['rules']
    vue?: TypedFlatConfigItem['rules']
    jsonc?: TypedFlatConfigItem['rules']
    markdown?: TypedFlatConfigItem['rules']
    yaml?: TypedFlatConfigItem['rules']
    toml?: TypedFlatConfigItem['rules']
    react?: TypedFlatConfigItem['rules']
    svelte?: TypedFlatConfigItem['rules']
  }
}
