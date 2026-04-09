<script lang="ts">
  import { onDestroy } from 'svelte';
  import { dictionary } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['word-unscrambler'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.word-unscrambler.${key}`;
  }

  let input = $state('');

  let copied = $state(false);

  let timerRef = $state(null);

  let results = $derived.by(() => {
    if (!input.trim() || input.length < 2) return [];
    return findWords(input.replace(/[^a-zA-Z]/g, ''));
  });

  let groupedResults = $derived.by(() => {
    const groups: Record<number, string[]> = {};
    results.forEach(word => {
      const len = word.length;
      if (!groups[len]) groups[len] = [];
      groups[len].push(word);
    });
    return groups;
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function findWords(letters: string) {
    const results: string[] = [];
    const letterArr = letters.toLowerCase().split('');
    
    dictionary.forEach(word => {
      if (word.length > letters.length) return;
      const available = [...letterArr];
      let canForm = true;
      for (const char of word) {
        const idx = available.indexOf(char);
        if (idx === -1) {
          canForm = false;
          break;
        }
        available.splice(idx, 1);
      }
      if (canForm) results.push(word);
    });
    
    return results.sort((a, b) => b.length - a.length || a.localeCompare(b));
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
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg uppercase tracking-widest"
          maxLength={12}
        />
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {t('found')}: {results.length} {t('words')}
        </span>
        {#if results.length > 0}
<button
            onclick={copyResults}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {copied ? t('copied') : t('copyAll')}
          </button>
{/if}
      </div>

      {#if Object.keys(groupedResults).length > 0}
<div class="space-y-4">
          {#each Object.entries(groupedResults)
            .sort(([a], [b]) => Number(b) - Number(a)) as [length, words] (length)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                  {length} {t('letters')} ({words.length})
                </h3>
                <div class="flex flex-wrap gap-2">
                  {#each words as word, i (i)}
<span 
                      class="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm"
                    >
                      {word}
                    </span>
{/each}
                </div>
              </div>
{/each}
        </div>
{:else if input.length >= 2}
<p class="text-center text-gray-500 dark:text-gray-400 py-8">{t('noResults')}</p>
{:else}
{null}
{/if}
    </div>
  
