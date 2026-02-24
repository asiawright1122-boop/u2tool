import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://www.u2tool.com',

  integrations: [
    svelte(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
