import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/brain-development-games/',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
