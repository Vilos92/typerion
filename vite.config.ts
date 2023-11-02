import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import tailwindcss from 'tailwindcss';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      // target: "es2020",
      jsx: 'automatic'
    }
  },
  esbuild: {
    // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
    logOverride: {'this-is-undefined-in-esm': 'silent'},
    jsxInject: `import React from 'react'`
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-macros',
          [
            '@emotion/babel-plugin-jsx-pragmatic',
            {
              export: 'jsx',
              import: '__cssprop',
              module: '@emotion/react'
            }
          ],
          ['@babel/plugin-transform-react-jsx', {pragma: '__cssprop'}, 'twin.macro']
        ]
      }
    }),
    dts({include: ['lib'], insertTypesEntry: true})
  ],
  css: {
    postcss: {
      plugins: [tailwindcss]
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'tailwindcss'],
      output: {
        entryFileNames: '[name].js'
      }
    }
  }
});
