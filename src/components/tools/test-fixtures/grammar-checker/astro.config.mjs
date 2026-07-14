import { fileURLToPath } from 'node:url';
import path from 'node:path';

import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

const fixtureRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = process.env.GRAMMAR_FIXTURE_REPO_ROOT;
const outDir = process.env.GRAMMAR_FIXTURE_OUT_DIR;
const cacheDir = process.env.GRAMMAR_FIXTURE_CACHE_DIR;

if (!repoRoot || !outDir || !cacheDir) {
  throw new Error('Grammar fixture paths are required');
}

export default defineConfig({
  root: fixtureRoot,
  srcDir: path.join(fixtureRoot, 'src'),
  publicDir: path.join(cacheDir, 'public'),
  output: 'static',
  outDir,
  cacheDir: path.join(cacheDir, 'astro'),
  integrations: [svelte()],
  vite: {
    cacheDir: path.join(cacheDir, 'vite'),
    resolve: {
      alias: {
        '@': path.join(repoRoot, 'src'),
      },
    },
  },
});
