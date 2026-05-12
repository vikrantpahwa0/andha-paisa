import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Andha Paisa',
        short_name: 'AndhaPaisa',
        description: 'Complete surveys, play games, and earn rewards',
        theme_color: '#22c55e',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: "/icons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"  // Changed: Added 'any' with maskable
          },
          {
            src: "/icons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"  // Changed: Added 'any' with maskable
          },
          // Added a 144x144 icon as fallback (minimum requirement)
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any"
          }
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.png',
            sizes: '1672x941',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Andha Paisa on Desktop'
          },
          {
            src: '/screenshots/mobile.png',
            sizes: '833x1280',
            type: 'image/png',
            label: 'Andha Paisa on Mobile'
          }
        ]
      }
    })
  ]
})