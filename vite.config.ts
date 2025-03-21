import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include react refresh for hot module reloading
      babel: {
        plugins: [
          // Tilpasninger til React 19 hvis nødvendigt
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true, // Lytter på alle netværksinterfaces
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});