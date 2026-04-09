<script lang="ts">
  import { onDestroy } from 'svelte';
  import { characterCategories } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['character-map'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.character-map.${key}`;
  }

  let selectedCategory = $state('arrows');

  let copied = $state(null);

  let search = $state('');

  let recentlyUsed = $state([]);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function copyChar(char: string) {
    navigator.clipboard.writeText(char);
    copied = char;
    setTimeout(() => copied = null, 1000);
    
    {
    const filtered = recentlyUsed.filter(c => c !== char);
    recentlyUsed = [char, ...filtered].slice(0, 20);
  };
  }
  const allChars = Object.values(characterCategories).flat();
  const filteredChars = search
    ? allChars.filter(char => char.includes(search))
    : characterCategories[selectedCategory];
  const categoryNames: Record<keyof typeof characterCategories, string> = {
    arrows: t('arrows'),
    math: t('math'),
    currency: t('currency'),
    punctuation: t('punctuation'),
    shapes: t('shapes'),
    emoji: t('emoji'),
    hands: t('hands'),
    hearts: t('hearts'),
    weather: t('weather'),
    music: t('music'),
    tech: t('tech'),
  };

</script>


    <div class="space-y-6">
      <div>
        <input
          type="text"
          bind:value={search}
          placeholder={t('searchPlaceholder')}
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {#if !search}
<div class="flex flex-wrap gap-2">
          {#each (Object.keys(characterCategories) as Array<keyof typeof characterCategories>) as category (category)}
<button 
              onclick={() => selectedCategory = category}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {categoryNames[category]}
            </button>
{/each}
        </div>
{/if}

      {#if recentlyUsed.length > 0}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('recentlyUsed')}</h3>
          <div class="flex flex-wrap gap-2">
            {#each recentlyUsed as char, i (i)}
<button 
                onclick={() => copyChar(char)}
                class="w-10 h-10 flex items-center justify-center text-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                {char}
              </button>
{/each}
          </div>
        </div>
{/if}

      <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          {search ? t('searchResults') : categoryNames[selectedCategory]} ({filteredChars.length})
        </h3>
        <div class="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1">
          {#each filteredChars as char, i (i)}
<button 
              onclick={() => copyChar(char)}
              class={`aspect-square flex items-center justify-center text-xl rounded transition-all ${
                copied === char
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-110'
              }`}
              title={`Click to copy: ${char}`}
            >
              {char}
            </button>
{/each}
        </div>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p class="text-sm text-blue-700 dark:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tip')}
        </p>
      </div>
    </div>
  
