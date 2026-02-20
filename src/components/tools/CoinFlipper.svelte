<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['coin-flipper'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.coin-flipper.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface FlipResult {
  result: 'heads' | 'tails';
  timestamp: number;
}

  let isFlipping = $state(false);

  let currentResult = $state(null);

  let history = $state([]);

  let flipCount = $state('1');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function flip() {
    const count = Math.min(parseInt(flipCount) || 1, 100);
    isFlipping = true;

    setTimeout(() => {
      const results: FlipResult[] = [];
      for (let i = 0; i < count; i++) {
        results.push({
          result: Math.random() < 0.5 ? 'heads' : 'tails',
          timestamp: Date.now() + i,
        });
      }

      currentResult = results[results.length - 1].result;
      history = [...results, ...history].slice(0, 100);
      isFlipping = false;
    }, 500);
  }
  function clearHistory() {
    history = [];
    currentResult = null;
  }
  const headsCount = history.filter(h => h.result === 'heads').length;
  const tailsCount = history.filter(h => h.result === 'tails').length;
  const headsPercent = history.length > 0 ? (headsCount / history.length * 100).toFixed(1) : '0';
  const tailsPercent = history.length > 0 ? (tailsCount / history.length * 100).toFixed(1) : '0';

</script>


    <div class="space-y-6">
      <!-- Coin Display -->
      <div class="flex justify-center">
        <div
          class={`w-40 h-40 rounded-full flex items-center justify-center text-6xl shadow-lg transition-transform duration-500 ${
            isFlipping ? 'animate-spin' : ''
          } ${
            currentResult === 'heads'
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
              : currentResult === 'tails'
              ? 'bg-gradient-to-br from-gray-400 to-gray-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-400'
          }`}
        >
          {currentResult === 'heads' ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5.81 17 4 22h16l-1.81-5"/></svg>' : currentResult === 'tails' ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m14 4 6 6"/><path d="M4 20 20 4"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'}
        </div>
      </div>

      <!-- Result Text -->
      {#if currentResult}
!isFlipping && (
        <div class="text-center">
          <span class="text-3xl font-bold text-gray-900 dark:text-white">
            {currentResult === 'heads' ? t('heads') : t('tails')}
          </span>
        </div>
      )
{/if}

      <!-- Flip Count -->
      <div class="flex justify-center items-center gap-4">
        <label class="text-sm text-gray-600 dark:text-gray-400">{t('flipCount')}:</label>
        <input
          type="number"
          bind:value={flipCount}
          min="1"
          max="100"
          class="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center"
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-center gap-3">
        <button
          onclick={flip}
          disabled={isFlipping}
          class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
        >
          {isFlipping ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> ...' : `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> ${t('flip')}`}
        </button>
        {#if history.length > 0}
<button
            onclick={clearHistory}
            class="px-6 py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
          >
            {tc('clear')}
          </button>
{/if}
      </div>

      <!-- Statistics -->
      {#if history.length > 0}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">{t('statistics')}</h3>
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-yellow-600">{headsCount}</div>
              <div class="text-sm text-gray-500">{t('heads')} ({headsPercent}%)</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-600">{tailsCount}</div>
              <div class="text-sm text-gray-500">{t('tails')} ({tailsPercent}%)</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">{history.length}</div>
              <div class="text-sm text-gray-500">{t('total')}</div>
            </div>
          </div>

          <!-- Visual Bar -->
          <div class="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
            <div
              class="bg-yellow-500 transition-all"
              style="width: {headsPercent}%"></div>
            <div
              class="bg-gray-500 transition-all"
              style="width: {tailsPercent}%"></div>
          </div>
        </div>
{/if}

      <!-- Recent History -->
      {#if history.length > 0}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('recentFlips')}</h4>
          <div class="flex flex-wrap gap-1">
            {#each history.slice(0, 50) as flip, idx (flip.timestamp)}
<span 
                class={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  flip.result === 'heads'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {flip.result === 'heads' ? 'H' : 'T'}
              </span>
{/each}
          </div>
        </div>
{/if}
    </div>
  
