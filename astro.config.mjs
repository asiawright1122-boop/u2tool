import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
// https://astro.build/config
export default defineConfig({
  output: 'server',
  trailingSlash: 'always',
  site: 'https://www.u2tool.com',
  adapter: cloudflare({
    imageService: 'compile',
  }),

  integrations: [
    svelte(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
