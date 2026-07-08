<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-go'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-go.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let json = $state('');

  let goCode = $state('');

  let structName = $state('Root');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function toGoType(val: unknown): string {
    if (val === null) return 'interface{}';
    if (typeof val === 'string') return 'string';
    if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64';
    if (typeof val === 'boolean') return 'bool';
    if (Array.isArray(val)) return val.length > 0 ? `[]${toGoType(val[0])}` : '[]interface{}';
    return 'interface{}';
  }
  function toPascalCase(s: string): string { return s.replace(/(^|[_-])(\w)/g, (_, __, c) => c.toUpperCase()); }
  function convert() {
    try {
      const obj = JSON.parse(json);
      if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        error = tg('errorInvalidFormat');
        return;
      }
      const lines: string[] = [`type ${structName} struct {`];
      for (const [key, val] of Object.entries(obj)) {
        const goKey = toPascalCase(key);
        const goType = toGoType(val);
        lines.push(`\t${goKey} ${goType} \`json:"${key}"\``);
      }
      lines.push('}');
      goCode = lines.join('\n');
      error = '';
    } catch {
      error = tg('json.invalidJson');
      goCode = '';
    }
  }
  async function copy() {
    await navigator.clipboard.writeText(goCode);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <label class="text-sm text-gray-600 dark:text-white" for="struct-name">{t('structName')}:</label>
        <input type="text" id="struct-name" name="structName" bind:value={structName} class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white" />
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="json-to-go-field-4" class="block text-sm font-medium mb-2 text-gray-600 dark:text-white">{t('input')}</label>
          <textarea bind:value={json} class="w-full h-64 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={'{"name": "John", "age": 30}'} id="json-to-go-field-4"></textarea>
        </div>
        <div>
          <label for="json-to-go-field-3" class="block text-sm font-medium mb-2 text-gray-600 dark:text-white">{t('output')}</label>
          <textarea value={goCode} readOnly class="w-full h-64 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" id="json-to-go-field-3"></textarea>
        </div>
      </div>
      {#if error}
<p class="text-red-600 dark:text-red-400">{error}</p>
{/if}
      <div class="flex gap-2">
        <button onclick={convert} class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">{tg('convert')}</button>
        <button onclick={copy} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? tg('copied') : tg('copy')}</button>
      </div>
    </div>
  
