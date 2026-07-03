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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 's_models/*.glb'],
      manifest: {
        name: 'ParasAIte',
        short_name: 'ParasAIte',
        description: 'Detección de parásitos con IA',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        globIgnores: ['**/3d_models/**/*', '**/*.map']
      }
    })
  ],
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
        }
      }
    },
    chunkSizeWarningLimit: 1000, 
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
});