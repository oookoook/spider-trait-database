import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    allowedHosts: ['host.docker.internal']
  },
  preview: {
    allowedHosts: ['host.docker.internal']
  },
  build: {
    outDir: 'dist'
  }
})
