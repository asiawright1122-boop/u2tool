<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['random'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.random.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let min = $state(1);

  let max = $state(100);

  let count = $state(1);

  let unique = $state(false);

  let results = $state([]);

  // Functions
  function generate() {
    const nums: number[] = [];
    const range = max - min + 1;
    
    if (unique && count > range) {
      // Can't generate more unique numbers than the range
      results = [];
      return;
    }

    if (unique) {
      const available = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * available.length);
        nums.push(available[idx]);
        available.splice(idx, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + min);
      }
    }
    
    results = nums;
  }
  function copyResults() {
    navigator.clipboard.writeText(results.join('\n'));
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label for="random-generator-field-6" class="block text-sm text-gray-700 dark:text-gray-300 mb-1">{t('min')}</label>
          <input
            type="number"
            value={min}
            onchange={(e) => min = Number(e.target.value)}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none" id="random-generator-field-6" />
        </div>
        <div>
          <label for="random-generator-field-5" class="block text-sm text-gray-700 dark:text-gray-300 mb-1">{t('max')}</label>
          <input
            type="number"
            value={max}
            onchange={(e) => max = Number(e.target.value)}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none" id="random-generator-field-5" />
        </div>
        <div>
          <label for="random-generator-field-4" class="block text-sm text-gray-700 dark:text-gray-300 mb-1">{tg('count')}</label>
          <input
            type="number"
            value={count}
            min={1}
            max={1000}
            onchange={(e) => count = Math.min(1000, Math.max(1, Number(e.target.value)))}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none" id="random-generator-field-4" />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              bind:checked={unique}
              class="w-4 h-4 rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <span class="text-sm">{t('unique')}</span>
          </label>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          onclick={generate}
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white"
        >
          {tg('generate')}
        </button>
        <button
          onclick={copyResults}
          disabled={results.length === 0}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
        >
          {tg('copy')}
        </button>
      </div>

      {#if results.length > 0}
<div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('result')} ({results.length})</div>
          <div class="flex flex-wrap gap-2">
            {#each results as num, i (i)}
<span  class="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-900 dark:text-white font-mono">
                {num}
              </span>
{/each}
          </div>
        </div>
{/if}
    </div>
  
