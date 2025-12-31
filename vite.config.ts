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
        name: 'ParasAIte - Diagnóstico de Parásitos',
        short_name: 'ParasAIte',
        description: 'Aplicación de detección de parásitos con IA para entornos médicos.',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Aumentado a 10MB para soportar tus modelos 3D y GeoJSON pesados
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, 
        globPatterns: ['**/*.{js,css,html,ico,png,svg,glb,json}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // División de chunks para optimizar la carga inicial
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-d3': ['d3'],
          'vendor-gsap': ['gsap']
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