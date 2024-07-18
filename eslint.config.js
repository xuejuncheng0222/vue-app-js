import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import vueEslintParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 未使用变量报错，但是忽略以 _ 开头的参数
      'no-undef': 'warn',
      // semi: 'error',
      'prefer-const': 'error',
    },
    languageOptions: {
      parser: vueEslintParser,
    },
  },
]
