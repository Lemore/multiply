/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Published as a GitHub Pages project site at https://lemore.github.io/multiply/
export default defineConfig({
  base: '/multiply/',
  plugins: [
    react(),
    VitePWA({
      // No skipWaiting/clientsClaim and no prompt UI: a new version waits in the
      // background and takes over only when the app is reopened (never mid-game).
      registerType: 'prompt',
      injectRegister: 'script',
      manifest: {
        name: 'רואים כפול',
        short_name: 'רואים כפול',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        start_url: '/multiply/',
        scope: '/multiply/',
        theme_color: '#0C422C',
        background_color: '#0C422C',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Default precache covers only js/css/html; fonts and images are needed offline too.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,jpg,webp}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
