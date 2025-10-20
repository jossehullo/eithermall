import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'es5',
          tabWidth: 2,
          printWidth: 100,
        },
      ],
    },
  },
  prettier,
];
