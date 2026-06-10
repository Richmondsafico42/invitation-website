import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Base path for GitHub Pages project site (https://<user>.github.io/invitation-website/).
// Override with BASE_PATH env var (e.g. "/" for root-domain hosts).
export default defineConfig({
  base: process.env.BASE_PATH ?? '/invitation-website/',
  plugins: [react()],
})
