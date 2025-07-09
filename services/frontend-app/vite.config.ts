import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@ui-components': path.resolve(__dirname, '../../packages/ui-components/src'),
    },
  },
  server: {
    port: 3001, // Default port for frontend dev server
    proxy: {
      // Example proxy to backend API during development
      '/api': {
        target: 'http://localhost:3000', // Assuming backend runs on 3000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
