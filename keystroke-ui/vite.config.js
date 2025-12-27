import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Allow serving files from the project root's parent (so we can import files from ../src)
      allow: [path.resolve(__dirname, '..')]
    }
  }
})
