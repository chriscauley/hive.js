module.exports = {
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['node_modules', '**/assets/*', 'public/*'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'vue/attribute-hyphenation': 0,
    'vue/attributes-order': 0,
    'vue/html-indent': 0,
    'vue/html-self-closing': 0,
    'vue/max-attributes-per-line': 0,
    'vue/prop-name-casing': 0,
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
  },
  globals: {
    module: 'readonly',
    __dirname: 'readonly',
  },
}
