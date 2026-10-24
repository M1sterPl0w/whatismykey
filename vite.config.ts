import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const BASE = '/whatismykey/';

export default defineConfig({
  base: BASE,
  plugins: [
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'WhatIsMyKey',
        short_name: 'WhatIsMyKey',
        description: 'Enter the chords of a song and see its key and scales.',
        start_url: BASE,
        scope: BASE,
        display: 'standalone',
        background_color: '#f6efe0',
        theme_color: '#f6efe0',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
