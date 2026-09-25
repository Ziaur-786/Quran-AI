import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      // Forward /ollama/... → http://localhost:11434/...
      // This bypasses the browser CORS restriction
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.removeHeader('Origin');
            proxyReq.removeHeader('Referer');
          });
        }
      },
      // Forward /qurancdn/... → https://api.qurancdn.com/...
      // Used for word-by-word transliteration
      '/qurancdn': {
        target: 'https://api.qurancdn.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/qurancdn/, ''),
      },
    },
  },
})
