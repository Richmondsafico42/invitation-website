import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.exe'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost/invitstion website',
        changeOrigin: true,
      },
    },
  },
})
