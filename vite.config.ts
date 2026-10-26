import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    // three.js lives in its own lazily loaded chunk (the stitch scene)
    chunkSizeWarningLimit: 700,
  },
})
