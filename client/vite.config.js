import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), vueJsx(), tailwindcss()],
  server: {
    port: 8283,
    proxy: {
      '/api': 'http://127.0.0.1:8005',
      '/ws': { target: 'http://127.0.0.1:8005', ws: true },
    },
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@unrest/ui/style.css': fileURLToPath(new URL('../../unrest-ui/dist/unrest-ui.css', import.meta.url)),
      '@unrest/ui': fileURLToPath(new URL('../../unrest-ui/dist/unrest-ui.js', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'hive.js': fileURLToPath(new URL('../game', import.meta.url)),
      // game engine deps — resolved here since game/ is outside client/
      lodash: fileURLToPath(new URL('./node_modules/lodash', import.meta.url)),
      'object-hash': fileURLToPath(new URL('./node_modules/object-hash', import.meta.url)),
    },
    dedupe: ['vue', 'vue-router', '@headlessui/vue', '@tanstack/vue-query'],
  },
})
