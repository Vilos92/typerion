/** @type {import('eslint').Linter.Config} */
const path = require('path');

module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'prettier'],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json')
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/main'],
            message: 'Please import from individual modules as main.ts is intended for bundling purposes.'
          }
        ]
      }
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
        disallowTypeAnnotations: true
      }
    ],
    '@typescript-eslint/consistent-type-exports': [
      'error',
      {
        fixMixedExportsWithInlineTypeSpecifier: true
      }
    ]
  }
};
