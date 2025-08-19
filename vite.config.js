// vite.config.ts (or .js)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
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
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      // ---- Fix the 2 MiB limit without bloating precache ----
      workbox: {
        // Do NOT precache JS; keep precache for light shell assets
        globPatterns: ['**/*.{html,css,svg,png,ico,webp}'],
        runtimeCaching: [
          // JS runtime cache (covers your big app chunks)
          {
            urlPattern: ({ request }) => request.destination === 'script',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'js-runtime',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
          // Optional: cache API or images if needed
          // {
          //   urlPattern: /\/api\//,
          //   handler: 'NetworkFirst',
          //   options: { cacheName: 'api', networkTimeoutSeconds: 3 },
          // },
          // {
          //   urlPattern: ({ request }) => request.destination === 'image',
          //   handler: 'StaleWhileRevalidate',
          //   options: { cacheName: 'images', expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          // },
        ],
        // If you’d rather keep JS in precache, comment the globPatterns above
        // and set the size higher:
        // maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],

  // ---- Smaller bundles + clearer chunks ----
  build: {
    // Only raises the CLI warning threshold; does not affect PWA limits
    chunkSizeWarningLimit: 1200, // KiB (~1.17 MiB)

    rollupOptions: {
      output: {
        // Vendor splitting tailored to your stack
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react')) return 'vendor-react';
          if (id.includes('@dnd-kit')) return 'vendor-dnd';
          if (id.includes('recharts')) return 'vendor-charts';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('react-router')) return 'vendor-router';

          // common catch-all for the rest
          return 'vendor';
        },
      },
    },

    // Optional: shave bytes by removing debug code in prod
    // (only do this if you don’t need console logs in production)
    // minify: 'esbuild',
    // terserOptions: {},
  },

  // Optional: drop console/debugger to reduce size
  
});
