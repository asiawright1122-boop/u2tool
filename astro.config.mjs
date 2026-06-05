import { cp, mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// Automatically heal wrangler configuration files during Astro config loading and Vite build phases
function healWranglerFiles() {
  try {
    const projectRoot = fileURLToPath(new URL('.', import.meta.url));
    const wranglerDir = path.join(projectRoot, '.wrangler', 'deploy');
    if (!fs.existsSync(wranglerDir)) {
      fs.mkdirSync(wranglerDir, { recursive: true });
    }
    const deployConfigPath = path.join(wranglerDir, 'config.json');
    const deployConfigContent = JSON.stringify({
      configPath: "../../dist/server/wrangler.json",
      auxiliaryWorkers: [],
      prerenderWorkerConfigPath: "../../dist/server/.prerender/wrangler.json"
    });
    fs.writeFileSync(deployConfigPath, deployConfigContent, 'utf8');

    // Also heal the expected wrangler.json in build output targets
    const wranglerJsoncPath = path.join(projectRoot, 'wrangler.jsonc');
    let wranglerJsonContent = '{}';
    if (fs.existsSync(wranglerJsoncPath)) {
      try {
        // Stripping potential comments from JSONC for a basic parse
        const rawText = fs.readFileSync(wranglerJsoncPath, 'utf8');
        const cleanJson = rawText.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        wranglerJsonContent = JSON.stringify(JSON.parse(cleanJson));
      } catch (e) {
        // Fallback to basic structure
        wranglerJsonContent = JSON.stringify({
          name: "u2tool",
          compatibility_date: "2026-04-09",
          compatibility_flags: ["nodejs_compat"]
        });
      }
    }

    const distServerDir = path.join(projectRoot, 'dist', 'server');
    if (!fs.existsSync(distServerDir)) {
      fs.mkdirSync(distServerDir, { recursive: true });
    }
    fs.writeFileSync(path.join(distServerDir, 'wrangler.json'), wranglerJsonContent, 'utf8');

    const prerenderDir = path.join(distServerDir, '.prerender');
    if (!fs.existsSync(prerenderDir)) {
      fs.mkdirSync(prerenderDir, { recursive: true });
    }
    fs.writeFileSync(path.join(prerenderDir, 'wrangler.json'), wranglerJsonContent, 'utf8');
  } catch (e) {
    // Silence filesystem errors during setup
  }
}

// Perform initial heal on load
healWranglerFiles();

function healWranglerVitePlugin() {
  return {
    name: 'heal-wrangler-vite-plugin',
    enforce: 'pre',
    config() {
      healWranglerFiles();
    }
  };
}

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
    plugins: [healWranglerVitePlugin(), tailwindcss()],
    define: {
      __U2TOOL_HTML_CACHE_VERSION__: JSON.stringify(getHtmlCacheVersion()),
    },
  },
});
