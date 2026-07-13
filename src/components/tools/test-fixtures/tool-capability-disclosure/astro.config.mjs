import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'astro/config';

const fixtureRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = path.resolve(fixtureRoot, '../../../../..');
const outDir = process.env.CAPABILITY_FIXTURE_OUT_DIR;
const cacheDir = process.env.CAPABILITY_FIXTURE_CACHE_DIR;

if (!outDir || !cacheDir) {
  throw new Error('Capability disclosure fixture output paths are required');
}

export default defineConfig({
  root: path.join(cacheDir, 'project'),
  srcDir: path.join(fixtureRoot, 'src'),
  publicDir: path.join(cacheDir, 'public'),
  output: 'static',
  outDir,
  cacheDir: path.join(cacheDir, 'astro'),
  vite: {
    cacheDir: path.join(cacheDir, 'vite'),
    resolve: {
      alias: {
        '@': path.join(repoRoot, 'src'),
      },
    },
  },
});
