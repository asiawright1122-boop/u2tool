import path from 'node:path';

import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

const repoRoot = process.env.TYPING_FIXTURE_REPO_ROOT;
const srcDir = process.env.TYPING_FIXTURE_SRC_DIR;
const outDir = process.env.TYPING_FIXTURE_OUT_DIR;
const cacheDir = process.env.TYPING_FIXTURE_CACHE_DIR;

if (!repoRoot || !srcDir || !outDir || !cacheDir) {
  throw new Error('Typing fixture paths are required');
}

export default defineConfig({
  srcDir,
  publicDir: path.join(cacheDir, 'public'),
  output: 'static',
  outDir,
  cacheDir: path.join(cacheDir, 'astro'),
  integrations: [svelte()],
  vite: {
    cacheDir: path.join(cacheDir, 'vite'),
    resolve: { alias: { '@': path.join(repoRoot, 'src') } },
  },
});
