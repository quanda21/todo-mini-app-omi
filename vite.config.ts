import { defineConfig } from 'vite'
import path from 'path'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'h.f',
    jsxInject: `import { h } from 'omi'`,
  },
  resolve: {
    alias: {
      'omi-elements': path.resolve('./src/lib/index.tsx'),
      '@': path.resolve('./src/'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: pkg.name.replace(/^@.*\//, '').replace(/-(\w)/g, ([, char]) => char.toUpperCase()),
      fileName: `${pkg.name}@${pkg.version}`,
    },
  },
})
