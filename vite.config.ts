import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1400,
    rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } }
  }
});
