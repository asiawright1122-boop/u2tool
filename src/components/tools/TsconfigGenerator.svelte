<script lang="ts">
  import { PRESETS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['tsconfig-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.tsconfig-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface TsconfigOptions {
  target: string;
  module: string;
  lib: string[];
  strict: boolean;
  jsx: string;
  declaration: boolean;
  declarationMap: boolean;
  sourceMap: boolean;
  outDir: string;
  rootDir: string;
  esModuleInterop: boolean;
  skipLibCheck: boolean;
  forceConsistentCasingInFileNames: boolean;
  resolveJsonModule: boolean;
  isolatedModules: boolean;
  noEmit: boolean;
  moduleResolution: string;
  baseUrl: string;
  paths: boolean;
}

  let config = $state({
    target: 'ES2020',
    module: 'ESNext',
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    strict: true,
    jsx: 'none',
    declaration: false,
    declarationMap: false,
    sourceMap: true,
    outDir: './dist',
    rootDir: './src',
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: false,
    moduleResolution: 'bundler',
    baseUrl: '.',
    paths: false,
  });

  let output = $state('');

  let copied = $state(false);

  // Functions
  function applyPreset(presetName: string) {
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      config = ({
        ...config,
        target: preset.target,
        module: preset.module,
        moduleResolution: preset.moduleResolution,
        lib: preset.libs,
        jsx: preset.jsx || 'none',
        declaration: preset.declaration || false,
      });
    }
  }
  function toggleLib(lib: string) {
    config = ({
      ...config,
      lib: config.lib.includes(lib) 
        ? config.lib.filter(l => l !== lib)
        : [...config.lib, lib],
    });
  }
  function generateConfig() {
    const compilerOptions: Record<string, unknown> = {
      target: config.target,
      module: config.module,
      lib: config.lib,
      strict: config.strict,
      esModuleInterop: config.esModuleInterop,
      skipLibCheck: config.skipLibCheck,
      forceConsistentCasingInFileNames: config.forceConsistentCasingInFileNames,
      moduleResolution: config.moduleResolution,
    };

    if (config.jsx !== 'none') {
      compilerOptions.jsx = config.jsx;
    }

    if (config.declaration) {
      compilerOptions.declaration = true;
      if (config.declarationMap) {
        compilerOptions.declarationMap = true;
      }
    }

    if (config.sourceMap) {
      compilerOptions.sourceMap = true;
    }

    if (config.outDir && !config.noEmit) {
      compilerOptions.outDir = config.outDir;
    }

    if (config.rootDir) {
      compilerOptions.rootDir = config.rootDir;
    }

    if (config.resolveJsonModule) {
      compilerOptions.resolveJsonModule = true;
    }

    if (config.isolatedModules) {
      compilerOptions.isolatedModules = true;
    }

    if (config.noEmit) {
      compilerOptions.noEmit = true;
    }

    if (config.baseUrl) {
      compilerOptions.baseUrl = config.baseUrl;
    }

    if (config.paths) {
      compilerOptions.paths = {
        '@/*': ['./src/*'],
      };
    }

    const tsconfig = {
      compilerOptions,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };

    output = JSON.stringify(tsconfig, null, 2);
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tsconfig.json';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    config = {
      target: 'ES2020',
      module: 'ESNext',
      lib: ['ES2020'],
      strict: true,
      jsx: 'none',
      declaration: false,
      declarationMap: false,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: false,
      moduleResolution: 'bundler',
      baseUrl: '.',
      paths: false,
    };
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- Presets -->
      <div>
        <label class="tool-label">
          {t('presets')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each PRESETS as preset (preset.name)}
<button 
              onclick={() => applyPreset(preset.name)}
              class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              {preset.name}
            </button>
{/each}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Target -->
        <div>
          <label class="tool-label">
            {t('target')}
          </label>
          <select
            value={config.target}
            onchange={(e) => config = ({ ...config, target: e.target.value })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {#each TARGETS as t (t)}
<option  value={t}>{t}</option>
{/each}
          </select>
        </div>

        <!-- Module -->
        <div>
          <label class="tool-label">
            {t('module')}
          </label>
          <select
            value={config.module}
            onchange={(e) => config = ({ ...config, module: e.target.value })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {#each MODULES as m (m)}
<option  value={m}>{m}</option>
{/each}
          </select>
        </div>

        <!-- Module Resolution -->
        <div>
          <label class="tool-label">
            {t('moduleResolution')}
          </label>
          <select
            value={config.moduleResolution}
            onchange={(e) => config = ({ ...config, moduleResolution: e.target.value })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {#each MODULE_RESOLUTIONS as mr (mr)}
<option  value={mr}>{mr}</option>
{/each}
          </select>
        </div>

        <!-- JSX -->
        <div>
          <label class="tool-label">
            JSX
          </label>
          <select
            value={config.jsx}
            onchange={(e) => config = ({ ...config, jsx: e.target.value })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            {#each JSX_OPTIONS as j (j)}
<option  value={j}>{j}</option>
{/each}
          </select>
        </div>

        <!-- Out Dir -->
        <div>
          <label class="tool-label">
            {t('outDir')}
          </label>
          <input
            type="text"
            value={config.outDir}
            onchange={(e) => config = ({ ...config, outDir: e.target.value })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <!-- Root Dir -->
        <div>
          <label class="tool-label">
            {t('rootDir')}
          </label>
          <input
            type="text"
            value={config.rootDir}
            onchange={(e) => config = ({ ...config, rootDir: e.target.value })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Lib -->
      <div>
        <label class="tool-label">
          {t('lib')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each LIBS as lib (lib)}
<button 
              onclick={() => toggleLib(lib)}
              class={`px-3 py-1.5 rounded text-sm ${
                config.lib.includes(lib)
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {lib}
            </button>
{/each}
        </div>
      </div>

      <!-- Boolean Options -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {#each [
          { key: 'strict', label: 'Strict' },
          { key: 'declaration', label: 'Declaration' },
          { key: 'declarationMap', label: 'Declaration Map' },
          { key: 'sourceMap', label: 'Source Map' },
          { key: 'esModuleInterop', label: 'esModuleInterop' },
          { key: 'skipLibCheck', label: 'skipLibCheck' },
          { key: 'forceConsistentCasingInFileNames', label: 'forceConsistentCasingInFileNames' },
          { key: 'resolveJsonModule', label: 'resolveJsonModule' },
          { key: 'isolatedModules', label: 'isolatedModules' },
          { key: 'noEmit', label: 'noEmit' },
          { key: 'paths', label: 'Paths' },
        ] as { key, label } (key)}
<label  class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              checked={config[key as keyof TsconfigOptions] as boolean}
              onchange={(e) => config = ({ ...config, [key]: e.target.checked })}
              class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
            />
            <span class="text-xs text-gray-700 dark:text-gray-300">{label}</span>
          </label>
{/each}
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateConfig}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">tsconfig.json</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-emerald-500 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
