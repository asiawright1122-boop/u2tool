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
import { getHtmlCacheVersion } from './scripts/build/html-cache-version.mjs';

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

    // Create wrangler state directories to prevent "Directory named 'cache:storage' not found" and other state store ENOENTs
    const stateDirs = [
      path.join(projectRoot, '.wrangler', 'state', 'v3', 'cache'),
      path.join(projectRoot, '.wrangler', 'state', 'v3', 'kv'),
      path.join(projectRoot, '.wrangler', 'state', 'v3', 'd1'),
      path.join(projectRoot, '.wrangler', 'state', 'v3', 'r2'),
      path.join(projectRoot, '.wrangler', 'state', 'v3', 'do')
    ];
    for (const dir of stateDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Also heal the expected wrangler.json in build output targets
    const wranglerJsoncPath = path.join(projectRoot, 'wrangler.jsonc');
    let parsedWrangler = {
      name: "u2tool",
      compatibility_date: "2026-04-09",
      compatibility_flags: ["nodejs_compat"]
    };
    if (fs.existsSync(wranglerJsoncPath)) {
      try {
        // Stripping potential comments from JSONC for a basic parse
        const rawText = fs.readFileSync(wranglerJsoncPath, 'utf8');
        const cleanJson = rawText.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
        parsedWrangler = JSON.parse(cleanJson);
      } catch (e) {
        // Keep default structure
      }
    }

    // Rewrite main to point to local entry.mjs within the build target, avoiding source path leakage
    parsedWrangler.main = "entry.mjs";

    const distServerDir = path.join(projectRoot, 'dist', 'server');
    if (!fs.existsSync(distServerDir)) {
      fs.mkdirSync(distServerDir, { recursive: true });
    }

    // Ensure placeholder entry.mjs exists so Miniflare doesn't complain during initialization
    const mainEntryPath = path.join(distServerDir, 'entry.mjs');
    if (!fs.existsSync(mainEntryPath)) {
      fs.writeFileSync(mainEntryPath, 'export default {};', 'utf8');
    }

    // Only write target wrangler.json if it is missing
    const mainWranglerPath = path.join(distServerDir, 'wrangler.json');
    if (!fs.existsSync(mainWranglerPath)) {
      fs.writeFileSync(mainWranglerPath, JSON.stringify(parsedWrangler), 'utf8');
    }

    const prerenderDir = path.join(distServerDir, '.prerender');
    if (!fs.existsSync(prerenderDir)) {
      fs.mkdirSync(prerenderDir, { recursive: true });
    }

    const prerenderChunksDir = path.join(prerenderDir, 'chunks');
    if (!fs.existsSync(prerenderChunksDir)) {
      fs.mkdirSync(prerenderChunksDir, { recursive: true });
    }

    // Ensure placeholder entry.mjs exists for prerender as well
    const prerenderEntryPath = path.join(prerenderDir, 'entry.mjs');
    if (!fs.existsSync(prerenderEntryPath)) {
      fs.writeFileSync(prerenderEntryPath, 'export default {};', 'utf8');
    }

    const prerenderWranglerPath = path.join(prerenderDir, 'wrangler.json');
    if (!fs.existsSync(prerenderWranglerPath)) {
      const prerenderWrangler = {
        ...parsedWrangler,
        name: (parsedWrangler.name || "u2tool") + "-prerender"
      };
      fs.writeFileSync(prerenderWranglerPath, JSON.stringify(prerenderWrangler), 'utf8');
    } else {
      // If it already exists, only patch the name to prevent collision, keeping the genuine main entry point
      try {
        const content = fs.readFileSync(prerenderWranglerPath, 'utf8');
        const json = JSON.parse(content);
        const suffix = "-prerender";
        if (json.name && !json.name.endsWith(suffix)) {
          json.name = json.name + suffix;
          fs.writeFileSync(prerenderWranglerPath, JSON.stringify(json), 'utf8');
        }
      } catch (e) {
        // Silence parse errors
      }
    }
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
    },
    buildStart() {
      healWranglerFiles();
    },
    generateBundle() {
      healWranglerFiles();
    },
    writeBundle() {
      healWranglerFiles();
    }
  };
}

function fixPrerenderUrlVitePlugin() {
  return {
    name: 'fix-prerender-url-vite-plugin',
    enforce: 'pre',
    transform(code, id) {
      if (code.includes('deserializeManifest') || code.includes('serializedManifest.rootDir')) {
        const fixedCode = code.replace(
          /new\s+URL\(\s*serializedManifest\.rootDir\s*\)/g,
          "new URL(serializedManifest.rootDir.startsWith('file:') ? 'http://localhost' : serializedManifest.rootDir)"
        );
        return {
          code: fixedCode,
          map: null
        };
      }
      return null;
    }
  };
}

function compileSvelteClientModulesVitePlugin() {
  let svelteCompilerPromise;

  function loadCompiler() {
    svelteCompilerPromise ??= import('svelte/compiler');
    return svelteCompilerPromise;
  }

  return {
    name: 'compile-svelte-client-modules-vite-plugin',
    configEnvironment(environmentName) {
      if (environmentName !== 'client') {
        return;
      }

      return {
        optimizeDeps: {
          esbuildOptions: {
            plugins: [
              {
                name: 'compile-svelte-client-modules',
                setup(build) {
                  if (build.initialOptions.plugins?.some((plugin) => plugin.name === 'vite:dep-scan')) {
                    return;
                  }

                  build.onLoad({ filter: /\.svelte\.[jt]s(?:\?.*)?$/ }, async ({ path: filename }) => {
                    const code = fs.readFileSync(filename, 'utf8');

                    try {
                      const compiler = await loadCompiler();
                      const compiled = compiler.compileModule(code, {
                        dev: true,
                        filename,
                        generate: 'client',
                      });
                      const result = compiled.js;
                      const contents = result.map
                        ? `${result.code}//# sourceMappingURL=${result.map.toUrl()}`
                        : result.code;

                      return { contents, loader: 'js' };
                    } catch (error) {
                      const text = error instanceof Error ? error.message : String(error);
                      const position =
                        typeof error === 'object' && error !== null && 'position' in error
                          ? error.position
                          : undefined;

                      return {
                        errors: [
                          {
                            text,
                            location: position
                              ? { file: filename, line: position.line, column: position.column }
                              : undefined,
                          },
                        ],
                      };
                    }
                  });
                },
              },
            ],
          },
        },
      };
    },
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

function copyMessageAssetsIntegration() {
  return {
    name: 'copy-message-assets',
    hooks: {
      'astro:build:setup': () => {
        healWranglerFiles();
      },
      'astro:build:start': () => {
        healWranglerFiles();
      },
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
  trailingSlash: 'ignore',
  site: 'https://www.u2tool.com',
  adapter: cloudflare({
    imageService: 'compile',
  }),

  integrations: [
    copyMessageAssetsIntegration(),
    svelte(),
  ],

  vite: {
    plugins: [
      healWranglerVitePlugin(),
      fixPrerenderUrlVitePlugin(),
      compileSvelteClientModulesVitePlugin(),
      tailwindcss(),
    ],
    define: {
      __U2TOOL_HTML_CACHE_VERSION__: JSON.stringify(getHtmlCacheVersion({ readGitValue })),
    },
  },
});
