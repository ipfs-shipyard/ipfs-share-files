import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     external: /.*(cross-spawn|storybook|stories).*/,
  //   },
  // },
  define: {
    'process.env': process.env,
    global: 'window'
  },
  plugins: [react()],
  esbuild: {
    supported: {
      'top-level-await': true
    }
  }
})
