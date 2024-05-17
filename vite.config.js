import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@models': path.resolve(__dirname, 'src/assets/3d_models'),
      '@textures': path.resolve(__dirname, 'src/assets/textures'),
      '@audios': path.resolve(__dirname, 'src/assets/audios'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});