import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  // Production hardening
  build: {
    sourcemap: false,
    minify: 'esbuild'
  },
  esbuild: {
    // Remove all console statements and debugger in production build output
    drop: ['console', 'debugger']
  }
})
