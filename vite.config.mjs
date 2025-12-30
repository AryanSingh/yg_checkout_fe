import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/yg_checkout_fe/',
  plugins: [react()],
  server: {
    port: 5173
  }
})
