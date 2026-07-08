<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-repeater'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-repeater.${key}`;
  }

  let text = $state('');

  let count = $state(5);

  let separator = $state('newline');

  let addNumbering = $state(false);

  let copied = $state(false);

  let timerRef = $state(null);

  let result = $derived.by(() => {
    if (!text) return '';
    const sep = separators[separator];
    const lines = Array.from({ length: count }, (_, i) => {
      if (addNumbering) {
        return `${i + 1}. ${text}`;
      }
      return text;
    });
    return lines.join(sep);
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const separators: Record<string, string> = {
    newline: '\n',
    space: ' ',
    comma: ', ',
    semicolon: '; ',
    tab: '\t',
    none: '',
  };
  function copyResult() {
    navigator.clipboard.writeText(result);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function downloadResult() {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repeated-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div>
        <label for="text-repeater-field-6" class="tool-label">
          {t('inputLabel')}
        </label>
        <textarea
          bind:value={text}
          placeholder={t('inputPlaceholder')}
          class="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="text-repeater-field-6"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="text-repeater-field-5" class="tool-label">
            {t('repeatCount')}
          </label>
          <input
            type="number"
            value={count}
            onchange={(e) => count = Math.max(1, Math.min(1000, parseInt(e.target.value) || 1))}
            min="1"
            max="1000"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="text-repeater-field-5" />
        </div>
        <div>
          <label for="text-repeater-field-4" class="tool-label">
            {t('separator')}
          </label>
          <select
            bind:value={separator}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="text-repeater-field-4">
            <option value="newline">{t('newline')}</option>
            <option value="space">{t('space')}</option>
            <option value="comma">{t('comma')}</option>
            <option value="semicolon">{t('semicolon')}</option>
            <option value="tab">{t('tab')}</option>
            <option value="none">{t('none')}</option>
          </select>
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              bind:checked={addNumbering}
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{t('addNumbering')}</span>
          </label>
        </div>
      </div>

      <div class="flex gap-2">
        {#each [5, 10, 25, 50, 100] as n (n)}
<button 
            onclick={() => count = n}
            class={`px-3 py-1 rounded text-sm ${
              count === n
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            ×{n}
          </button>
{/each}
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-gray-900 dark:text-white">{t('result')}</h3>
          <div class="flex gap-2">
            <button
              onclick={copyResult}
              disabled={!result}
              class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm"
            >
              {copied ? t('copied') : t('copy')}
            </button>
            <button
              onclick={downloadResult}
              disabled={!result}
              class="px-4 py-2 btn-success rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {t('download')}
            </button>
          </div>
        </div>
        <textarea
          value={result}
          readOnly
          class="w-full h-48 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('resultPlaceholder')}></textarea>
        <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {result.length} {t('characters')} | {result.split('\n').length} {t('lines')}
        </div>
      </div>
    </div>
  
