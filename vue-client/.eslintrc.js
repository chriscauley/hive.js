module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['node_modules', '**/assets/*', 'public/*'],
  rules: {
    'vue/attributes-order': 0,
    'vue/max-attributes-per-line': 0,
    'vue/html-indent': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/require-default-prop': 0,
    'vue/html-self-closing': 0,
    'vue/attribute-hyphenation': 0,
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  globals: {
    module: 'readonly',
    __dirname: 'readonly',
  },
}
