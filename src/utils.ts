import type { Awaitable, TypedFlatConfigItem } from './types'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { isPackageExists } from 'local-pkg'

const scopeUrl = fileURLToPath(new URL('.', import.meta.url))
const isCwdInScope = isPackageExists('@dixidan/eslint-config')

export async function interopDefault<T>(m: Awaitable<T>): Promise<T extends { default: infer U } ? U : T> {
  const resolved = await m
  return (resolved as any).default || resolved
}

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] })
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false || isCwdInScope === false)
    return

  const nonExistingPackages = packages.filter(i => i && !isPackageInScope(i)) as string[]
  if (nonExistingPackages.length === 0)
    return

  const p = await import('@clack/prompts')
  const result = await p.confirm({
    message: `${nonExistingPackages.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${nonExistingPackages.join(', ')}. Do you want to install them?`
  })
  if (result)
    await import('@antfu/install-pkg').then(i => i.installPackage(nonExistingPackages, { dev: true }))
}

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat()
}

/**
 * Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@dixidan/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
export function renameRules(
  rules: Record<string, any>,
  map: Record<string, string>
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(rules)
      .map(([key, value]) => {
        for (const [from, to] of Object.entries(map)) {
          if (key.startsWith(`${from}/`))
            return [to + key.slice(from.length), value]
        }
        return [key, value]
      })
  )
}
