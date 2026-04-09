<script lang="ts">
  import { jsonToToml, parseToml } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['toml-json'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.toml-json.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let mode = $state('toml-to-json');

  let error = $state('');

  let indentSize = $state(2);

  // Functions
  function convert() {
    error = '';
    try {
      if (mode === 'toml-to-json') {
        const parsed = parseToml(input);
        output = JSON.stringify(parsed, null, indentSize);
      } else {
        const parsed = JSON.parse(input);
        output = jsonToToml(parsed);
      }
    } catch (_err) {
      error = _err instanceof Error ? _err.message : tg('errorProcessing');
      output = '';
    }
  }
  function swap() {
    mode = mode === 'toml-to-json' ? 'json-to-toml' : 'toml-to-json';
    input = output;
    output = '';
    error = '';
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }
  function clearAll() {
    input = '';
    output = '';
    error = '';
  }
  function loadSample() {
    if (mode === 'toml-to-json') {
      input = `# Sample TOML configuration
title = "TOML Example"
version = 1.0

[owner]
name = "John Doe"
email = "john@example.com"

[database]
server = "192.168.1.1"
ports = [8001, 8002, 8003]
enabled = true

[servers.alpha]
ip = "10.0.0.1"
dc = "eqdc10"

[servers.beta]
ip = "10.0.0.2"
dc = "eqdc20"`;
    } else {
      input = `{
  "title": "JSON Example",
  "version": 1.0,
  "owner": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "database": {
    "server": "192.168.1.1",
    "ports": [8001, 8002, 8003],
    "enabled": true
  }
}`;
    }
    output = '';
    error = '';
  }

</script>


    <div class="space-y-6">
      <!-- Controls -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onchange={(e) => {
              mode = e.target.value as 'toml-to-json' | 'json-to-toml';
              input = '';
              output = '';
              error = '';
            }}
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm text-gray-900 dark:text-white"
          >
            <option value="toml-to-json">{t('tomlToJson')}</option>
            <option value="json-to-toml">{t('jsonToToml')}</option>
          </select>
        </div>
        
        {#if mode === 'toml-to-json'}
<div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">{t('indent')}:</label>
            <select
              value={indentSize}
              onchange={(e) => indentSize = Number(e.target.value)}
              class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm text-gray-900 dark:text-white"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Minified</option>
            </select>
          </div>
{/if}
        
        <button
          onclick={loadSample}
          class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-white"
        >
          {t('loadSample')}
        </button>
        
        <button
          onclick={clearAll}
          class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-white"
        >
          {t('clear')}
        </button>
      </div>

      <!-- Input/Output -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">
              {mode === 'toml-to-json' ? 'TOML' : 'JSON'}
            </label>
          </div>
          <textarea
            bind:value={input}
            placeholder={mode === 'toml-to-json' ? t('tomlPlaceholder') : t('jsonPlaceholder')}
            class="w-full h-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">
              {mode === 'toml-to-json' ? 'JSON' : 'TOML'}
            </label>
            <div class="flex gap-2">
              <button
                onclick={swap}
                class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs text-gray-700 dark:text-white"
                title={t('swap')}
              >
                ⇄ {t('swap')}
              </button>
              <button
                onclick={copyOutput}
                disabled={!output}
                class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs disabled:opacity-50 text-gray-700 dark:text-white"
              >
                {t('copy')}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-80 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white resize-none"></textarea>
        </div>
      </div>

      <!-- Convert Button -->
      <div class="flex justify-center">
        <button
          onclick={convert}
          disabled={!input.trim()}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium text-white"
        >
          {t('convert')}
        </button>
      </div>

      <!-- Error -->
      {#if error}
<div class="p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
{/if}
    </div>
  
