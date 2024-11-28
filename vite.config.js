import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['chunk-HUIBHRFZ', 'chunk-7EX72PV5'], // Add the problematic chunks here
  },
})
