import globals from "globals";
import pluginJs from "@eslint/js";
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  // configuration included in plugin
  jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    rules: {
      'no-usused-vars': 'off',
      'jsdoc/require-description': 'warn',
      'jsdoc/tag-lines': 'off',
      'jsdoc/no-defaults': 'off',
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];
