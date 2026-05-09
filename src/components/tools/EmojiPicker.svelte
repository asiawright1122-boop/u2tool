<script lang="ts">
  import { onDestroy } from 'svelte';
  import { emojiData as stubEmojiData } from '@/lib/tool-stubs';

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

  // Types
  export type EmojiCategory = 'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags';
  export interface Emoji {
  emoji: string;
  name: string;
  category: EmojiCategory;
}

  const fallbackEmojiData: Emoji[] = [
    { emoji: '😀', name: 'grinning face', category: 'smileys' },
    { emoji: '😂', name: 'face with tears of joy', category: 'smileys' },
    { emoji: '👍', name: 'thumbs up', category: 'people' },
    { emoji: '👏', name: 'clapping hands', category: 'people' },
    { emoji: '🐶', name: 'dog face', category: 'animals' },
    { emoji: '🍕', name: 'pizza', category: 'food' },
    { emoji: '✈️', name: 'airplane', category: 'travel' },
    { emoji: '⚽', name: 'soccer ball', category: 'activities' },
    { emoji: '💡', name: 'light bulb', category: 'objects' },
    { emoji: '✅', name: 'check mark', category: 'symbols' },
    { emoji: '🇺🇸', name: 'flag us', category: 'flags' },
  ];
  const emojiData: Emoji[] = Array.isArray(stubEmojiData) && stubEmojiData.length > 0 ? stubEmojiData : fallbackEmojiData;
  const categoryIcons: Record<EmojiCategory, string> = {
    smileys: '😀',
    people: '👍',
    animals: '🐶',
    food: '🍕',
    travel: '✈️',
    activities: '⚽',
    objects: '💡',
    symbols: '✅',
    flags: '🏳️',
  };

  let search = $state('');

  let selectedCategory = $state('all');

  let copied = $state(null);

  let recentEmojis = $state([]);

  let timerRef = $state(null);

  let filteredEmojis = $derived.by(() => {
    let emojis = search ? searchEmojis(search) : emojiData;
    if (selectedCategory !== 'all') {
      emojis = emojis.filter(e => e.category === selectedCategory);
    }
    return emojis;
  });

  async function handleCopy(emoji: string) {
    await navigator.clipboard.writeText(emoji);
    copied = emoji;
    setTimeout(() => copied = null, 1500);
    
    // 添加到最近使用
    {
    const filtered = recentEmojis.filter(e => e !== emoji);
    recentEmojis = [emoji, ...filtered].slice(0, 16);
  };
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  export function searchEmojis(query: string): Emoji[] {
  if (!query.trim()) return emojiData;
  const lowerQuery = query.toLowerCase();
  return emojiData.filter(e => 
    e.name.toLowerCase().includes(lowerQuery) || 
    e.emoji.includes(query)
  );
}
  export function getEmojisByCategory(category: EmojiCategory): Emoji[] {
  return emojiData.filter(e => e.category === category);
}
  const categories: EmojiCategory[] = ['smileys', 'people', 'animals', 'food', 'travel', 'activities', 'objects', 'symbols', 'flags'];

</script>


    <div class="space-y-4">
      <!-- 搜索框 -->
      <div class="relative">
        <input
          type="text"
          bind:value={search}
          placeholder={t('emoji.searchPlaceholder')}
          class="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
      </div>

      <!-- 分类标签 -->
      <div class="flex gap-1 overflow-x-auto pb-2">
        <button
          onclick={() => selectedCategory = 'all'}
          class={`px-3 py-2 rounded-lg text-sm whitespace-nowrap text-white ${
            selectedCategory === 'all' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {t('all')}
        </button>
        {#each categories as cat (cat)}
<button 
            onclick={() => selectedCategory = cat}
            class={`px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 text-white ${
              selectedCategory === cat ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span>{categoryIcons[cat]}</span>
            <span class="hidden sm:inline">{t(`emoji.${cat}`)}</span>
          </button>
{/each}
      </div>

      <!-- 最近使用 -->
      {#if recentEmojis.length > 0}
{#if !search}
        <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="text-xs text-gray-600 dark:text-gray-300 mb-2">{t('emoji.recent')}</div>
          <div class="flex flex-wrap gap-1">
            {#each recentEmojis as emoji, index (index)}
<button 
                onclick={() => handleCopy(emoji)}
                class={`w-10 h-10 text-2xl rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  copied === emoji ? 'bg-green-100 dark:bg-emerald-500/30' : ''
                }`}
                title={copied === emoji ? t('copied') : t('emoji.clickToCopy')}
              >
                {emoji}
              </button>
{/each}
          </div>
        </div>
      {/if}
{/if}


      <!-- Emoji 网格 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {filteredEmojis.length} {t('emoji.emojis')}
          </span>
          {#if copied}
<span class="text-xs text-green-600 dark:text-green-400">{copied} {t('copied')}</span>
{/if}
        </div>
        
        {#if filteredEmojis.length > 0}
<div class="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 max-h-80 overflow-y-auto">
            {#each filteredEmojis as item, index (index)}
<button 
                onclick={() => handleCopy(item.emoji)}
                class={`w-10 h-10 text-2xl rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  copied === item.emoji ? 'bg-green-100 dark:bg-emerald-500/30' : ''
                }`}
                title={item.name}
              >
                {item.emoji}
              </button>
{/each}
          </div>
{:else}
<div class="text-center text-gray-600 dark:text-gray-300 py-8">
            {t('emoji.noResults')}
          </div>
{/if}
      </div>

      <!-- 使用说明 -->
      <div class="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-xs text-gray-600 dark:text-gray-300">
        <div class="font-medium text-gray-900 dark:text-white mb-1">{t('emoji.howToUse')}</div>
        <ul class="list-disc list-inside space-y-1">
          <li>{t('emoji.tip1')}</li>
          <li>{t('emoji.tip2')}</li>
          <li>{t('emoji.tip3')}</li>
        </ul>
      </div>
    </div>
  
