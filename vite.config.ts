import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Forenklet Babel konfiguration der sikrer korrekt ESM-håndtering
      babel: {
        presets: [
          '@babel/preset-typescript',
          ['@babel/preset-react', {
            runtime: 'automatic' // React 19 JSX Transform
          }]
        ],
        // Ingen @babel/preset-env her, da Vite håndterer dette selv
        babelrc: false,
        configFile: false
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  // Forbedret build options
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      // Sikrer at alle React-relaterede imports håndteres korrekt
      external: [],
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom']
        }
      }
    }
  },
  // Simpel server-konfiguration
  server: {
    port: 3000,
    open: true,
    host: true
  },
  // Eksplicit specificer, at vi bruger ESM moduler
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
});