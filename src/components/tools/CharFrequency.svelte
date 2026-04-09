<script lang="ts">
  import { analyzeFrequency } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['char-frequency'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.char-frequency.${key}`;
  }

  // Types
  interface FrequencyData {
  char: string;
  count: number;
  percentage: number;
}

  let input = $state('Hello World! This is a sample text for character frequency analysis.');

  let ignoreSpaces = $state(false);

  let caseSensitive = $state(false);

  let results = $state([]);

  // Functions
  function handleAnalyze() {
    results = analyzeFrequency(input, ignoreSpaces, caseSensitive);
  }
  const maxCount = results.length > 0 ? results[0].count : 1;

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('inputLabel')}</label>
        <textarea bind:value={input}
          class="w-full h-32 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          placeholder={t('placeholder')}></textarea>
      </div>

      <div class="flex gap-4">
        <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" bind:checked={ignoreSpaces}
            class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          {t('ignoreSpaces')}
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" bind:checked={caseSensitive}
            class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          {t('caseSensitive')}
        </label>
      </div>

      <button onclick={handleAnalyze}
        class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        {t('analyze')}
      </button>

      {#if results.length > 0}
<div class="space-y-2">
          <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{t('uniqueChars')}: {results.length}</span>
            <span>{t('totalChars')}: {results.reduce((sum, r) => sum + r.count, 0)}</span>
          </div>
          <div class="max-h-80 overflow-y-auto space-y-1">
            {#each results as r, i (i)}
<div  class="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span class="w-8 text-center font-mono text-blue-600 dark:text-blue-400">{r.char}</span>
                <div class="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                  <div class="h-full bg-blue-500" style="width: {(r.count / maxCount) * 100}%"></div>
                </div>
                <span class="w-12 text-right text-sm text-gray-700 dark:text-gray-300">{r.count}</span>
                <span class="w-16 text-right text-sm text-gray-500 dark:text-gray-400">{r.percentage.toFixed(1)}%</span>
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
