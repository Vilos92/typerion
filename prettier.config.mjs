import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

export default {
  arrowParens: 'avoid',
  bracketSpacing: false,
  printWidth: 110,
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    'prettier-plugin-tailwindcss',
    require.resolve('prettier-plugin-twin.macro')
  ]
};
