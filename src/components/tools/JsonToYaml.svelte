<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let json = $state('');

  let yaml = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function jsonToYaml(obj: unknown, indent = 0): string {
    const spaces = '  '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) {
      return obj.map(item => `${spaces}- ${typeof item === 'object' ? '\n' + jsonToYaml(item, indent + 1) : jsonToYaml(item, 0)}`).join('\n');
    }
    return Object.entries(obj as Record<string, unknown>).map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        return `${spaces}${k}:\n${jsonToYaml(v, indent + 1)}`;
      }
      return `${spaces}${k}: ${jsonToYaml(v, 0)}`;
    }).join('\n');
  }
  function convert() {
    try {
      const obj = JSON.parse(json);
      yaml = jsonToYaml(obj);
      error = '';
    } catch {
      error = t('json.invalidJson');
      yaml = '';
    }
  }
  async function copy() {
    await navigator.clipboard.writeText(yaml);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">JSON</label>
          <textarea bind:value={json} class="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" placeholder={'{"name": "John", "age": 30}'}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">YAML</label>
          <textarea value={yaml} readOnly class="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100"></textarea>
        </div>
      </div>
      {#if error}
<p class="text-red-400">{error}</p>
{/if}
      <div class="flex gap-2">
        <button onclick={convert} class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">{t('convert')}</button>
        <button onclick={copy} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  
