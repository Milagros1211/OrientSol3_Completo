import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api-pvgis': {
        target: 'https://re.jrc.ec.europa.eu',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/api-pvgis/, ''),
      },
    },
    watch: {
      ignored: ['**/release/**', '**/android/**', '**/.venv/**', '**/scratch/**'],
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    port: 4173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    target: 'esnext',
  },
});
