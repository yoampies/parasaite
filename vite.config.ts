/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'ParasAIte Detector',
        short_name: 'ParasAIte',
        description: 'Sistema de reconocimiento de parásitos offline-first.',
        theme_color: '#001033', // Coincide con bg-midnight
        background_color: '#fdfbf7', // Coincide con cream
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,wasm}'],
        globIgnores: ['**/3d_models/**/*', '**/*.map'],
        // Estrategia runtime caching para el modelo ONNX
        runtimeCaching: [
          {
            // Ajustado para capturar la ruta del modelo ONNX (/ml_model/ o /model/)
            urlPattern: /^.*\/(model|ml_model)\/.*\.onnx$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'onnx-model-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año de permanencia
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['onnxruntime-web'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    middlewareMode: false,
    fs: {
      strict: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-3d';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('topojson') || id.includes('d3')) return 'vendor-maps';
            if (id.includes('react-router')) return 'vendor-router';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});