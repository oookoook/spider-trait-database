import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      injectRegister: false,
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'img/icons/*.png', 'img/icons/*.svg'],
      manifest: {
        name: 'World Spider Trait Database',
        short_name: 'WSTDB',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#00AF3F',
        icons: [
          {
            src: '/img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}']
      }
    })
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
