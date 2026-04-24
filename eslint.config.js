const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      'react-native': reactNativePlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'react-native/no-inline-styles': 'warn',
    },
  },
  prettierConfig, // This disables rules that conflict with Prettier
  {
    ignores: ['dist/*', '.expo/*'],
  },
]);
