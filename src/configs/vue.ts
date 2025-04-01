import type { OptionsFiles, OptionsHasTypeScript, OptionsOverrides, TypedFlatConfigItem } from 'src/types'
import { GLOB_VUE } from '../globs'
import { interopDefault } from '../utils'

export async function vue(
  options: OptionsHasTypeScript & OptionsOverrides & OptionsFiles = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    files = [GLOB_VUE],
    overrides = {}
  } = options
  const [
    pluginVue,
    parserVue
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser'))
  ] as const)

  return [
    {
      // This allows Vue plugin to work with auto imports
      // https://github.com/vuejs/eslint-plugin-vue/pull/2422
      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly'
        }
      },
      name: 'dixidan/vue/setup',
      plugins: {
        vue: pluginVue
      }
    },
    {
      name: 'dixidan/vue/rules',
      files,
      processor: pluginVue.processors['.vue'],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null,
          sourceType: 'module'
        }
      },
      rules: {
        ...pluginVue.configs['flat/recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,

        'node/prefer-global/process': 'off',
        'ts/explicit-function-return-type': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/first-attribute-linebreak': ['error', {
          singleline: 'beside',
          multiline: 'below'
        }],
        'vue/html-closing-bracket-newline': [
          'error',
          {
            singleline: 'never',
            multiline: 'never',
            selfClosingTag: {
              singleline: 'never',
              multiline: 'never'
            }
          }
        ],
        'vue/require-default-prop': 'off',
        'vue/block-order': ['error', {
          order: ['script', 'template', 'style']
        }],
        'vue/no-v-html': 'off',
        'vue/block-tag-newline': ['error', {
          multiline: 'always',
          singleline: 'always'
        }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
          registeredComponentsOnly: true,
          ignores: []
        }],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots']
        }],
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-mustaches': ['error', {
          ignoreIncludesComment: false,
          ignoreStringEscape: true
        }],
        'vue/no-useless-v-bind': 'error',
        'vue/padding-line-between-blocks': ['error', 'always'],
        'vue/prefer-separate-static-class': 'error',
        'vue/v-for-delimiter-style': ['error', 'of'],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement'
        ],
        'vue/no-sparse-arrays': 'error',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        'vue/prefer-template': 'error',
        'vue/html-comment-content-spacing': ['error', 'always', {
          exceptions: ['-']
        }],
        'vue/array-bracket-spacing': ['error', 'never'],
        'vue/arrow-spacing': ['error', { after: true, before: true }],
        'vue/block-spacing': ['error', 'always'],
        'vue/brace-style': ['error', '1tbs'],
        'vue/comma-dangle': ['error', 'never'],
        'vue/comma-spacing': ['error', { after: true, before: false }],
        'vue/comma-style': ['error', 'last'],
        'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
        'vue/keyword-spacing': ['error', { after: true, before: true }],
        'vue/object-curly-newline': 'off',
        'vue/object-curly-spacing': ['error', 'always'],
        'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'vue/operator-linebreak': ['error', 'before'],
        'vue/quote-props': ['error', 'consistent-as-needed'],
        'vue/space-in-parens': ['error', 'never'],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],
        'vue/template-curly-spacing': 'error',

        ...overrides
      }
    }
  ]
}
