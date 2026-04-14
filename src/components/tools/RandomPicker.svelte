<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['random-picker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.random-picker.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let winnerCount = $state('1');

  let winners = $state([]);

  let isAnimating = $state(false);

  let currentDisplay = $state('');

  let animationRef = $state(null);

  // Functions
  const items = input
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  function pickWinners() {
    if (items.length === 0) return;

    const count = Math.min(parseInt(winnerCount) || 1, items.length);
    isAnimating = true;
    winners = [];

    // Animation
    let iterations = 0;
    const maxIterations = 20;
    
    const animate = () => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      currentDisplay = randomItem;
      iterations++;

      if (iterations < maxIterations) {
        animationRef = setTimeout(animate, 50 + iterations * 10);
      } else {
        // Final selection
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);
        winners = selected;
        currentDisplay = '';
        isAnimating = false;
      }
    };

    animate();
  }
  function reset() {
    if (animationRef) {
      clearTimeout(animationRef);
    }
    winners = [];
    currentDisplay = '';
    isAnimating = false;
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <label for="picker-items" class="tool-label">
          {t('enterItems')}
        </label>
        <textarea
          id="picker-items"
          name="pickerItems"
          bind:value={input}
          placeholder={t('itemsPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
        <p class="text-sm text-gray-500 mt-1">
          {t('itemCount')}: {items.length}
        </p>
      </div>

      <!-- Winner Count -->
      <div>
        <label for="picker-winner-count" class="tool-label">
          {t('numberOfWinners')}
        </label>
        <input
          id="picker-winner-count"
          name="winnerCount"
          type="number"
          bind:value={winnerCount}
          min="1"
          max={items.length || 1}
          class="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        />
      </div>

      <!-- Pick Button -->
      <div class="flex gap-3">
        <button
          onclick={pickWinners}
          disabled={items.length === 0 || isAnimating}
          class="flex-1 py-4 bg-gradient-to-r from-slate-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-slate-700 hover:to-pink-700 disabled:opacity-50 transition-all"
        >
          {isAnimating ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg> ...' : `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg> ${t('pick')}`}
        </button>
        {#if winners.length > 0 || isAnimating}
<button
            onclick={reset}
            class="px-6 py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
          >
            {tc('clear')}
          </button>
{/if}
      </div>

      <!-- Animation Display -->
      {#if isAnimating}
{#if currentDisplay}
        <div class="text-center py-8">
          <div class="text-4xl font-bold text-slate-600 dark:text-slate-400 animate-pulse">
            {currentDisplay}
          </div>
        </div>
      {/if}
{/if}

      <!-- Winners Display -->
      {#if winners.length > 0}
{#if !isAnimating}
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> {t('winners')}
          </h3>
          <div class="space-y-3">
            {#each winners as winner, idx (idx)}
<div 
                class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <span class="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span class="text-lg font-medium text-gray-900 dark:text-white">
                  {winner}
                </span>
              </div>
{/each}
          </div>
        </div>
      {/if}
{/if}
    </div>
  
