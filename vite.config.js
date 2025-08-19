import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom'] },

  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Duco T-shirt Store',
        short_name: 'Duco',
        description: 'Premium custom T-shirt design and ordering platform.',
        theme_color: '#E5C870',
        background_color: '#0A0A0A',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{html,css,svg,png,ico,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'script',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'js-runtime',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 14 }
            }
          }
        ]
      }
    })
  ],

  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/react-router(\/|\\)/.test(id)) return 'vendor-router';
          if (/node_modules\/(react|react-dom|scheduler)(\/|\\)/.test(id)) return 'vendor-react';
          if (/node_modules\/@dnd-kit(\/|\\)/.test(id)) return 'vendor-dnd';
          if (/node_modules\/recharts(\/|\\)/.test(id)) return 'vendor-charts';
          if (/node_modules\/lucide-react(\/|\\)/.test(id)) return 'vendor-icons';
          return 'vendor';
        }
      }
    },
    commonjsOptions: { transformMixedEsModules: true }
  }
});
