import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/gallery/chronos/',
  plugins: [svelte()],
  build: {
    outDir: '../../public/gallery/chronos',
    emptyOutDir: true,
  },
});
