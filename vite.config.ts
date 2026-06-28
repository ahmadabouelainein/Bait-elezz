import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    __GROQ_DEFAULT_KEY__: JSON.stringify(process.env.VITE_GROQ_API_KEY ?? ''),
    __HAS_DEFAULT_KEY__: JSON.stringify(!!process.env.VITE_GROQ_API_KEY),
  },
})
