<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['packageJson'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.packageJson.${key}`;
  }

  // Types
  interface PackageInfo {
  name: string;
  version: string;
  description: string;
  main: string;
  author: string;
  license: string;
  private: boolean;
  type: 'commonjs' | 'module';
}
  interface Script {
  name: string;
  command: string;
}

  const LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'UNLICENSED'];
  const COMMON_SCRIPTS: Script[] = [
    { name: 'dev', command: 'vite --host 0.0.0.0' },
    { name: 'build', command: 'vite build' },
    { name: 'start', command: 'node index.js' },
    { name: 'lint', command: 'eslint .' },
    { name: 'test', command: 'vitest run' },
  ];

  let packageInfo = $state({
    name: 'my-project',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    author: '',
    license: 'MIT',
    private: false,
    type: 'commonjs',
  });

  let scripts = $state([
    { name: 'start', command: 'node index.js' },
    { name: 'test', command: 'echo "Error: no test specified" && exit 1' },
  ]);

  let keywords = $state('');

  let output = $state('');

  // Functions
  function addScript(script: Script) {
    if (!scripts.find((s) => s.name === script.name)) {
      scripts = [...scripts, script];
    }
  }
  function removeScript(name: string) {
    scripts = scripts.filter((s) => s.name !== name);
  }
  function updateScript(index: number, field: 'name' | 'command', value: string) {
    const newScripts = [...scripts];
    newScripts[index] = { ...newScripts[index], [field]: value };
    scripts = newScripts;
  }
  function generate() {
    const pkg: Record<string, unknown> = {
      name: packageInfo.name,
      version: packageInfo.version,
    };

    if (packageInfo.description) {
      pkg.description = packageInfo.description;
    }

    pkg.main = packageInfo.main;

    if (packageInfo.type === 'module') {
      pkg.type = 'module';
    }

    const scriptsObj: Record<string, string> = {};
    for (const script of scripts) {
      if (script.name && script.command) {
        scriptsObj[script.name] = script.command;
      }
    }
    if (Object.keys(scriptsObj).length > 0) {
      pkg.scripts = scriptsObj;
    }

    if (keywords.trim()) {
      pkg.keywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }

    if (packageInfo.author) {
      pkg.author = packageInfo.author;
    }

    pkg.license = packageInfo.license;

    if (packageInfo.private) {
      pkg.private = true;
    }

    output = JSON.stringify(pkg, null, 2);
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }
  function downloadOutput() {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'package.json';
    link.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <!-- Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('name')}</label>
          <input
            type="text"
            value={packageInfo.name}
            onchange={(e) => packageInfo = { ...packageInfo, name: e.target.value }}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('version')}</label>
          <input
            type="text"
            value={packageInfo.version}
            onchange={(e) => packageInfo = { ...packageInfo, version: e.target.value }}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('main')}</label>
          <input
            type="text"
            value={packageInfo.main}
            onchange={(e) => packageInfo = { ...packageInfo, main: e.target.value }}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('author')}</label>
          <input
            type="text"
            value={packageInfo.author}
            onchange={(e) => packageInfo = { ...packageInfo, author: e.target.value }}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('license')}</label>
          <select
            value={packageInfo.license}
            onchange={(e) => packageInfo = { ...packageInfo, license: e.target.value }}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            {#each LICENSES as license (license)}
<option  value={license}>
                {license}
              </option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('type')}</label>
          <select
            value={packageInfo.type}
            onchange={(e) =>
              packageInfo = { ...packageInfo, type: e.target.value as 'commonjs' | 'module' }
            }
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            <option value="commonjs">CommonJS</option>
            <option value="module">ES Module</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('description')}</label>
        <input
          type="text"
          value={packageInfo.description}
          onchange={(e) => packageInfo = { ...packageInfo, description: e.target.value }}
          class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('keywords')}</label>
        <input
          type="text"
          bind:value={keywords}
          placeholder={t('keywordsPlaceholder')}
          class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="private"
          checked={packageInfo.private}
          onchange={(e) => packageInfo = { ...packageInfo, private: e.target.checked }}
          class="rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
        <label for="private" class="text-sm text-gray-600 dark:text-gray-300">
          {t('private')}
        </label>
      </div>

      <!-- Scripts -->
      <div>
        <label class="tool-label">{t('scripts')}</label>
        <div class="space-y-2 mb-4">
          {#each scripts as script, index (index)}
<div  class="flex gap-2">
              <input
                type="text"
                value={script.name}
                onchange={(e) => updateScript(index, 'name', e.target.value)}
                placeholder={t('scriptName')}
                class="w-32 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={script.command}
                onchange={(e) => updateScript(index, 'command', e.target.value)}
                placeholder={t('scriptCommand')}
                class="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <button
                onclick={() => removeScript(script.name)}
                class="px-3 py-2 bg-rose-500 hover:bg-red-700 rounded text-sm text-white"
              >
                ✕
              </button>
            </div>
{/each}
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('commonScripts')}:</span>
          {#each COMMON_SCRIPTS as script (script.name)}
<button 
              onclick={() => addScript(script)}
              disabled={scripts.some((s) => s.name === script.name)}
              class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs"
            >
              + {script.name}
            </button>
{/each}
        </div>
      </div>

      <!-- Generate Button -->
      <div class="flex justify-center">
        <button
          onclick={generate}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium"
        >
          {t('generate')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">package.json</label>
            <div class="flex gap-2">
              <button
                onclick={copyOutput}
                class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs"
              >
                {t('copy')}
              </button>
              <button
                onclick={downloadOutput}
                class="px-2 py-1 bg-emerald-500 hover:bg-green-700 rounded text-xs text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-gray-100 resize-none"></textarea>
        </div>
{/if}
    </div>
  
