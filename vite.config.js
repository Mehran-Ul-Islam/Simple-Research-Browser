import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production-only CSP: dev server needs inline scripts for hot reload.
const csp = {
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace(
      '<!--CSP-->',
      `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'">`
    ),
};

export default defineConfig({
  base: './',
  plugins: [react(), csp],
  build: { outDir: 'dist', emptyOutDir: true },
  server: { port: 5173, strictPort: true },
});
