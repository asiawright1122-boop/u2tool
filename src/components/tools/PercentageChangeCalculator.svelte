<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['percentage-change-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.percentage-change-calculator.${key}`;
  }

  let oldValue = $state('');

  let newValue = $state('');

  let result = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function calculate() {
    const old = parseFloat(oldValue);
    const current = parseFloat(newValue);
    if (isNaN(old) || isNaN(current) || old === 0) {
      result = null;
      return;
    }
    const change = ((current - old) / Math.abs(old)) * 100;
    result = { change, isIncrease: change >= 0 };
  }
  function copyResult() {
    if (result) {
      navigator.clipboard.writeText(`${result.change >= 0 ? '+' : ''}${result.change.toFixed(2)}%`);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }
  function swap() {
    oldValue = newValue;
    newValue = oldValue;
    result = null;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="tool-label">
            {t('oldValue')}
          </label>
          <input
            type="number"
            bind:value={oldValue}
            placeholder={t('oldValuePlaceholder')}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl"
          />
        </div>
        <div>
          <label class="tool-label">
            {t('newValue')}
          </label>
          <input
            type="number"
            bind:value={newValue}
            placeholder={t('newValuePlaceholder')}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl"
          />
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          onclick={calculate}
          class="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          {t('calculate')}
        </button>
        <button
          onclick={swap}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> {t('swap')}
        </button>
      </div>

      {#if result}
<div class={`p-6 rounded-lg ${result.isIncrease ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <div class="text-center">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('percentageChange')}</div>
            <div class={`text-5xl font-bold ${result.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.isIncrease ? '↑' : '↓'} {Math.abs(result.change).toFixed(2)}%
            </div>
            <div class="mt-2 text-gray-600 dark:text-gray-400">
              {result.isIncrease ? t('increase') : t('decrease')}
            </div>
            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('difference')}: {(parseFloat(newValue) - parseFloat(oldValue)).toFixed(2)}
            </div>
            <button
              onclick={copyResult}
              class="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>
{/if}

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('formula')}</h3>
        <div class="text-center font-mono text-lg text-gray-700 dark:text-gray-300">
          {t('formulaText')}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
          <div class="text-2xl mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
          <div class="font-medium text-gray-900 dark:text-white">{t('example1Title')}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('example1')}</div>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div class="text-2xl mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
          <div class="font-medium text-gray-900 dark:text-white">{t('example2Title')}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('example2')}</div>
        </div>
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div class="text-2xl mb-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg></div>
          <div class="font-medium text-gray-900 dark:text-white">{t('example3Title')}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('example3')}</div>
        </div>
      </div>
    </div>
  
