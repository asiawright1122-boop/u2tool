<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['love-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.love-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Heart, Share2, RefreshCw } from 'lucide-svelte';

  // Types
  interface LoveResult {
  percentage: number;
  message: string;
  emoji: string;
}

  let name1 = $state('');

  let name2 = $state('');

  let result = $state(null);

  let isCalculating = $state(false);

  let timerRef = $state(null);

  function calculateLove() {
    if (!name1.trim() || !name2.trim()) return;

    isCalculating = true;
    result = null;

    // Simulate calculation animation
    setTimeout(() => {
      // Generate consistent percentage based on names
      const combinedNames = (name1.toLowerCase() + name2.toLowerCase()).split('').sort().join('');
      let hash = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        const char = combinedNames.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      // Generate percentage between 50-100 for fun results
      const percentage = 50 + Math.abs(hash % 51);

      let message: string;
      let emoji: string;

      if (percentage >= 90) {
        message = t('result90');
        emoji = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      } else if (percentage >= 80) {
        message = t('result80');
        emoji = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      } else if (percentage >= 70) {
        message = t('result70');
        emoji = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      } else if (percentage >= 60) {
        message = t('result60');
        emoji = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      } else {
        message = t('result50');
        emoji = '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
      }

      result = { percentage, message, emoji };
      isCalculating = false;
    }, 1500);
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function reset() {
    name1 = '';
    name2 = '';
    result = null;
  }
  function share() {
    if (!result) return;
    const text = `${name1} <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> ${name2}: ${result.percentage}% ${t('compatibility')}! ${result.emoji}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }

</script>


    <div class="space-y-6">
      <!-- Names Input -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('yourName')}
          </label>
          <input
            type="text"
            bind:value={name1}
            placeholder={t('enterName')}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('partnerName')}
          </label>
          <input
            type="text"
            bind:value={name2}
            placeholder={t('enterName')}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg"
          />
        </div>
      </div>

      <!-- Heart Animation -->
      <div class="flex justify-center">
        <div class={`relative ${isCalculating ? 'animate-pulse' : ''}`}>
          <Heart
            class={`w-32 h-32 ${
              result
                ? 'text-red-500 fill-red-500'
                : 'text-pink-300 dark:text-pink-700'
            } transition-all duration-500`}
          />
          {#if result}
<div class="absolute inset-0 flex items-center justify-center">
              <span class="text-white font-bold text-2xl">{result.percentage}%</span>
            </div>
{/if}
        </div>
      </div>

      <!-- Calculate Button -->
      <div class="flex justify-center gap-3">
        <button
          onclick={calculateLove}
          disabled={!name1.trim() || !name2.trim() || isCalculating}
          class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          <Heart class={`w-5 h-5 ${isCalculating ? 'animate-bounce' : ''}`} />
          {isCalculating ? t('calculating') : t('calculate')}
        </button>

        {#if result}
<div>

            <button
              onclick={share}
              class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Share2 class="w-5 h-5" />
              {t('share')}
            </button>
            <button
              onclick={reset}
              class="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <RefreshCw class="w-5 h-5" />
              {tCommon('clear')}
            </button>
          
</div>
{/if}
      </div>

      <!-- Result -->
      {#if result}
<div class="p-6 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl border border-pink-200 dark:border-pink-800 text-center">
          <div class="text-6xl mb-4">{result.emoji}</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {name1} & {name2}
          </div>
          <div class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-4">
            {result.percentage}%
          </div>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            {result.message}
          </p>
        </div>
{/if}

      <!-- Disclaimer -->
      <p class="text-center text-sm text-gray-500">
        {t('disclaimer')}
      </p>
    </div>
  
