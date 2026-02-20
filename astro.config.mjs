import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Static output (default in Astro 5): all pages are prerendered by default.
  // Individual API routes opt out with `export const prerender = false`.
  // The Cloudflare adapter is required to support server-side API routes.
  output: 'static',
  site: 'https://www.u2tool.com',

  adapter: cloudflare(),

  integrations: [
    svelte(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
