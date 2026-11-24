import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/gallery/kinetic-04/',
  plugins: [svelte()],
  build: {
    outDir: '../../public/gallery/kinetic-04',
    emptyOutDir: true,
  },
});
