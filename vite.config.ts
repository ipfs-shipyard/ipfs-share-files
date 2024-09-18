import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     external: /.*(cross-spawn|storybook|stories).*/,
  //   },
  // },
  define: {
    'process.env': process.env,
    'global': 'window',
  },
  plugins: [react()],
})
