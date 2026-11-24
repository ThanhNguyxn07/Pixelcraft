import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/gallery/solaris-9/',
  plugins: [vue()],
  build: {
    outDir: '../../public/gallery/solaris-9',
    emptyOutDir: true,
  },
});
