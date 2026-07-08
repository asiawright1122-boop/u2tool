<script lang="ts">
  import { onDestroy } from 'svelte';
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['dice-roller'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.dice-roller.${key}`;
  }
  // Types
  type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
  interface RollResult {
    dice: DiceType;
    results: number[];
    total: number;
    timestamp: number;
  }

  const diceConfig: Record<DiceType, { sides: number; icon: string; color: string }> = {
    d4: { sides: 4, icon: 'd4', color: 'from-sky-500 to-blue-600' },
    d6: { sides: 6, icon: 'd6', color: 'from-amber-500 to-orange-600' },
    d8: { sides: 8, icon: 'd8', color: 'from-emerald-500 to-green-600' },
    d10: { sides: 10, icon: 'd10', color: 'from-purple-500 to-violet-600' },
    d12: { sides: 12, icon: 'd12', color: 'from-pink-500 to-rose-600' },
    d20: { sides: 20, icon: 'd20', color: 'from-indigo-500 to-blue-700' },
    d100: { sides: 100, icon: 'd100', color: 'from-slate-500 to-gray-700' },
  };

  let selectedDice = $state<DiceType>('d6');

  let diceCount = $state('1');

  let modifier = $state('0');

  let isRolling = $state(false);

  let currentResult = $state<RollResult | null>(null);

  let history = $state<RollResult[]>([]);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function roll() {
    const count = Math.min(parseInt(diceCount) || 1, 20);
    const mod = parseInt(modifier) || 0;
    const config = diceConfig[selectedDice];

    isRolling = true;

    timerRef = setTimeout(() => {
      const results: number[] = [];
      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * config.sides) + 1);
      }

      const total = results.reduce((a, b) => a + b, 0) + mod;
      const result: RollResult = {
        dice: selectedDice,
        results,
        total,
        timestamp: Date.now(),
      };

      currentResult = result;
      history = [result, ...history].slice(0, 50);
      isRolling = false;
    }, 300);
  }
  function clearHistory() {
    history = [];
    currentResult = null;
  }

</script>

<div class="space-y-6">
  <!-- Dice Selection -->
  <div>
    <div class="tool-label">
      {t('selectDice')}
    </div>
    <div class="flex flex-wrap gap-2">
      {#each (Object.keys(diceConfig) as DiceType[]) as dice (dice)}
        <button
          onclick={() => selectedDice = dice}
          class={`px-4 py-3 rounded-lg font-bold transition-all ${
            selectedDice === dice
              ? `bg-gradient-to-r ${diceConfig[dice].color} text-white scale-105`
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {diceConfig[dice].icon} {dice.toUpperCase()}
        </button>
      {/each}
    </div>
  </div>

  <!-- Settings -->
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label for="dice-count" class="tool-label">
        {t('numberOfDice')}
      </label>
      <input
        id="dice-count"
        name="diceCount"
        type="number"
        bind:value={diceCount}
        min="1"
        max="20"
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
      />
    </div>
    <div>
      <label for="dice-modifier" class="tool-label">
        {t('modifier')}
      </label>
      <input
        id="dice-modifier"
        name="modifier"
        type="number"
        bind:value={modifier}
        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
      />
    </div>
  </div>

  <!-- Roll Button -->
  <div class="flex justify-center gap-3">
    <button
      onclick={roll}
      disabled={isRolling}
      class={`px-10 py-4 bg-gradient-to-r ${diceConfig[selectedDice].color} text-white rounded-xl font-bold text-xl hover:scale-105 disabled:opacity-50 transition-all`}
    >
      <span class="inline-flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>
        {isRolling ? t('rolling') : t('roll')}
      </span>
    </button>
    {#if history.length > 0}
      <button
        onclick={clearHistory}
        class="px-6 py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
      >
        {t('clearHistory')}
      </button>
    {/if}
  </div>

  <!-- Current Result -->
  {#if currentResult && !isRolling}
    <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
      <div class="text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {currentResult.total}
      </div>
      <div class="flex justify-center gap-2 flex-wrap">
        {#each currentResult.results as r, idx (idx)}
          <span
            class={`w-10 h-10 rounded-lg bg-gradient-to-r ${diceConfig[currentResult.dice].color} text-white flex items-center justify-center font-bold`}
          >
            {r}
          </span>
        {/each}
        {#if parseInt(modifier) !== 0}
          <span class="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold">
            {parseInt(modifier) > 0 ? '+' : ''}{modifier}
          </span>
        {/if}
      </div>
    </div>
  {/if}

  <!-- History -->
  {#if history.length > 0}
    <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('history')}</h4>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        {#each history.slice(0, 10) as roll (roll.timestamp)}
          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">{roll.dice.toUpperCase()}</span>
            <span class="text-gray-400">[{roll.results.join(', ')}]</span>
            <span class="font-bold text-gray-900 dark:text-white">= {roll.total}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
