<script lang="ts">
  import { sortObject } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['jsonSort'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.jsonSort.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type SortOrder = 'asc' | 'desc';

  let input = $state(`{
  "zebra": 1,
  "apple": 2,
  "mango": {
    "z": 1,
    "a": 2
  },
  "banana": [3, 1, 2]
}`);

  let output = $state('');

  let order = $state('asc');

  let error = $state('');

  // Functions
  function sortJson() {
    error = '';
    try {
      const parsed = JSON.parse(input);
      const sorted = sortObject(parsed, order);
      output = JSON.stringify(sorted, null, 2);
    } catch {
      error = t('invalidJson');
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-center">
        <select
          value={order}
          onchange={(e) => order = e.target.value as SortOrder}
          class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="asc">{t('ascending')}</option>
          <option value="desc">{t('descending')}</option>
        </select>
        <button
          onclick={sortJson}
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white"
        >
          {t('sort')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
        >
          {tg('copy')}
        </button>
      </div>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="json-sorter-field-4" class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
            spellCheck={false} id="json-sorter-field-4"></textarea>
        </div>
        <div>
          <label for="json-sorter-field-3" class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none" id="json-sorter-field-3"></textarea>
        </div>
      </div>
    </div>
  
