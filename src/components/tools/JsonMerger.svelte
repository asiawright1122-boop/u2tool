<script lang="ts">
  import { mergeJsonObjects } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-merger'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-merger.${key}`;
  }

  // Types
  type MergeStrategy = 'shallow' | 'deep' | 'concat';

  let json1 = $state('{\n  "name": "John",\n  "age": 30\n}');

  let json2 = $state('{\n  "age": 31,\n  "city": "NYC"\n}');

  let strategy = $state('deep');

  let output = $state('');

  let error = $state('');

  // Functions
  function handleMerge() {
    try {
      error = '';
      const result = mergeJsonObjects(json1, json2, strategy);
      output = result;
    } catch (_e) {
      error = _e instanceof Error ? _e.message : 'Invalid JSON';
      output = '';
    }
  }
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <label class="text-sm text-gray-600 dark:text-gray-300">{t('strategy')}:</label>
        <select
          value={strategy}
          onchange={(e) => strategy = e.target.value as MergeStrategy}
          class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-gray-900 dark:text-white"
        >
          <option value="shallow">{t('shallow')}</option>
          <option value="deep">{t('deep')}</option>
          <option value="concat">{t('concat')}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            JSON 1
          </label>
          <textarea
            bind:value={json1}
            class="w-full h-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            JSON 2
          </label>
          <textarea
            bind:value={json2}
            class="w-full h-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
      </div>

      <button
        onclick={handleMerge}
        class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('merge')}
      </button>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('result')}</label>
            <button
              onclick={handleCopy}
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('copy')}
            </button>
          </div>
          <pre class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-green-600 dark:text-green-400 font-mono text-sm overflow-auto max-h-64">
            {output}
          </pre>
        </div>
{/if}

      <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p><strong>{t('shallow')}:</strong> {t('shallowDesc')}</p>
        <p><strong>{t('deep')}:</strong> {t('deepDesc')}</p>
        <p><strong>{t('concat')}:</strong> {t('concatDesc')}</p>
      </div>
    </div>
  
