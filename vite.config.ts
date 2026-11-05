import { defineConfig } from 'vite';
import { criblDocsPlugin } from './services/cribl-docs.mjs';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), criblDocsPlugin()],
  server: {
    port: 8080,
    host: '127.0.0.1',
    strictPort: true
  }
});
