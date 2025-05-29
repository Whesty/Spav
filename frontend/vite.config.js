import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'



export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: './', // важно для корректных путей при Netlify
  build: {
    outDir: 'dist'
  }
})
