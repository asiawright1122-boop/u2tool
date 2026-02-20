<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['anagram-solver'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.anagram-solver.${key}`;
  }

  let input = $state('');

  let copied = $state(false);

  let timerRef = $state(null);

  let results = $derived.by(() => {
    if (!input.trim() || input.length < 2) return [];
    const sortedInput = sortLetters(input.replace(/\s/g, ''));
    const found = commonWords.filter(word => {
      if (word.length !== sortedInput.length) return false;
      return sortLetters(word) === sortedInput;
    });
    return [...new Set(found)].sort((a, b) => b.length - a.length);
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function sortLetters(word: string): string {
    return word.toLowerCase().split('').sort().join('');
  }
  function copyResults() {
    navigator.clipboard.writeText(results.join(', '));
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <input
          type="text"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          maxLength={15}
        />
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-gray-900 dark:text-white">
            {t('results')} ({results.length})
          </h3>
          {#if results.length > 0}
<button
              onclick={copyResults}
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {copied ? t('copied') : t('copy')}
            </button>
{/if}
        </div>
        {#if results.length > 0}
<div class="flex flex-wrap gap-2">
            {#each results as word, i (i)}
<span 
                class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
              >
                {word}
              </span>
{/each}
          </div>
{:else}
<p class="text-gray-500 dark:text-gray-400">{t('noResults')}</p>
{/if}
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('tipTitle')}</h3>
        <p class="text-sm text-blue-700 dark:text-blue-400">{t('tipDescription')}</p>
      </div>
    </div>
  
