import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/jj-photography/',

  server: {
    allowedHosts: [
      '311b-2401-4900-c0ab-1137-8196-3b2c-b290-625c.ngrok-free.app'
    ]
  }
})
