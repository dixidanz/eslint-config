import { pluginUnusedImports } from '../plugins'
import type { OptionsOverrides, TypedFlatConfigItem } from '../types'
import globals from 'globals'

export async function javascript(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {}
  } = options

  return [
    {
      name: 'dixidan/javascript/setup',
      languageOptions: {
        ecmaVersion: 2022,
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: 'readonly',
          navigator: 'readonly',
          window: 'readonly'
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 2022,
          sourceType: 'module'
        },
        sourceType: 'module'
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      }
    },
    {
      name: 'dixidan/javascript/rules',
      plugins: {
        'unused-imports': pluginUnusedImports
      },
      rules: {
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            vars: 'all',
            varsIgnorePattern: '^_'
          }
        ],
        'array-callback-return': 'error',
        'constructor-super': 'error',
        'for-direction': 'error',
        'getter-return': 'error',
        'no-async-promise-executor': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': ['error', 'always'],
        'no-const-assign': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-dupe-args': 'error',
        'no-dupe-class-members': 'error',
        'no-dupe-else-if': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-duplicate-imports': 'error',
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-ex-assign': 'error',
        'no-fallthrough': 'error',
        'no-func-assign': 'error',
        'no-import-assign': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-loss-of-precision': 'error',
        'no-misleading-character-class': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-obj-calls': 'error',
        'no-prototype-builtins': 'error',
        'no-self-assign': ['error', { props: true }],
        'no-self-compare': 'error',
        'no-setter-return': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'error',
        'no-this-before-super': 'error',
        'no-undef': 'error',
        'no-unexpected-multiline': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-unreachable': 'error',
        'no-unreachable-loop': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unused-vars': ['error', {
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
          vars: 'all'
        }],
        'no-use-before-define': ['error', { classes: false, functions: false, variables: true }],
        'no-useless-backreference': 'error',
        'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],
        'valid-typeof': ['error', { requireStringLiterals: true }],
        'accessor-pairs': ['error', { enforceForClassMembers: true, setWithoutGet: true }],
        'block-scoped-var': 'error',
        'default-case-last': 'error',
        'dot-notation': ['error', { allowKeywords: true }],
        'eqeqeq': ['error', 'smart'],
        'new-cap': ['error', { capIsNew: false, newIsCap: true, properties: true }],
        'no-array-constructor': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-delete-var': 'error',
        'no-empty': ['error', { allowEmptyCatch: true }],
        'no-empty-function': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-boolean-cast': 'error',
        'no-global-assign': 'error',
        'no-implied-eval': 'error',
        'no-iterator': 'error',
        'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
        'no-lone-blocks': 'error',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-redeclare': ['error', { builtinGlobals: false }],
        'no-regex-spaces': 'error',
        'no-restricted-properties': [
          'error',
          { message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.', property: '__proto__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineGetter__' },
          { message: 'Use `Object.defineProperty` instead.', property: '__defineSetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupGetter__' },
          { message: 'Use `Object.getOwnPropertyDescriptor` instead.', property: '__lookupSetter__' }
        ],
        'no-sequences': 'error',
        'no-shadow-restricted-names': 'error',
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-unneeded-ternary': ['error', { defaultAssignment: false }],
        'no-unused-expressions': ['error', {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true
        }],
        'no-useless-call': 'error',
        'no-useless-catch': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-constructor': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-with': 'error',
        'object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        'one-var': ['error', { initialized: 'never' }],
        'prefer-arrow-callback': [
          'error',
          {
            allowNamedFunctions: false,
            allowUnboundThis: true
          }
        ],
        'prefer-const': [
          'error',
          {
            destructuring: 'all',
            ignoreReadBeforeAssign: true
          }
        ],
        'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'symbol-description': 'error',
        'vars-on-top': 'error',
        'yoda': ['error', 'never'],
        'unicode-bom': ['error', 'never']
      },
      ...overrides
    }
  ]
}
