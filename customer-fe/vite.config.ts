import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: ['es2020', 'chrome80', 'safari14', 'firefox78', 'edge88'],
  },
  server: {
    port: 3000,
  },
})
