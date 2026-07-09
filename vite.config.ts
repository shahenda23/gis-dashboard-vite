import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), svgr()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}))
