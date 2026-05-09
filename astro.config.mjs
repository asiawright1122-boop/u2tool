import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// Svelte's Vite plugin attaches watchers for several config/module files during
// check/build. Keep Node's leak detector useful without warning on that expected fan-out.
EventEmitter.defaultMaxListeners = Math.max(EventEmitter.defaultMaxListeners, 30);

const messageSourceDir = new URL('./src/messages/', import.meta.url);
const projectRoot = fileURLToPath(new URL('.', import.meta.url));

function readGitValue(args) {
  try {
    return execFileSync('git', args, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function getHtmlCacheVersion() {
  const commit = readGitValue(['rev-parse', '--short=12', 'HEAD']);
  const status = readGitValue(['status', '--porcelain']);

  return `${commit || 'unknown'}${status ? '-dirty' : ''}`;
}

function copyMessageAssetsIntegration() {
  return {
    name: 'copy-message-assets',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const targetDir = new URL('./messages/', dir);

        await rm(targetDir, { recursive: true, force: true });
        await mkdir(targetDir, { recursive: true });
        await cp(messageSourceDir, targetDir, { recursive: true });

        logger.info(
          `Copied message assets to ${fileURLToPath(targetDir)}`
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  trailingSlash: 'always',
  site: 'https://www.u2tool.com',
  adapter: cloudflare({
    imageService: 'compile',
  }),

  integrations: [
    copyMessageAssetsIntegration(),
    svelte(),
  ],

  vite: {
    plugins: [tailwindcss()],
    define: {
      __U2TOOL_HTML_CACHE_VERSION__: JSON.stringify(getHtmlCacheVersion()),
    },
  },
});
