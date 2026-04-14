<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['roman-numeral-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.roman-numeral-converter.${key}`;
  }

  let arabic = $state('');

  let roman = $state('');

  let mode = $state('toRoman');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  function arabicToRoman(num: number): string {
    if (num < 1 || num > 3999) throw new Error('Range 1-3999');
    let result = '';
    for (const [value, symbol] of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  }
  function romanToArabic(str: string): number {
    const romanMap: Record<string, number> = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    const upper = str.toUpperCase().replace(/[^IVXLCDM]/g, '');
    if (!upper) throw new Error('Invalid');
    let result = 0;
    for (let i = 0; i < upper.length; i++) {
      const current = romanMap[upper[i]];
      const next = romanMap[upper[i + 1]];
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  }
  function handleConvert() {
    error = '';
    try {
      if (mode === 'toRoman') {
        const num = parseInt(arabic);
        if (isNaN(num)) throw new Error('Invalid number');
        roman = arabicToRoman(num);
      } else {
        arabic = romanToArabic(roman).toString();
      }
    } catch {
      error = t('invalidInput');
    }
  }
  function copyResult() {
    const result = mode === 'toRoman' ? roman : arabic;
    navigator.clipboard.writeText(result);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="flex justify-center">
        <div class="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            onclick={() => mode = 'toRoman'}
            class={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toRoman' ? 'bg-amber-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('arabicToRoman')}
          </button>
          <button
            onclick={() => mode = 'toArabic'}
            class={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toArabic' ? 'bg-amber-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('romanToArabic')}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="tool-label">
            {mode === 'toRoman' ? t('arabicNumber') : t('romanNumeral')}
          </label>
          <input
            type="text"
            value={mode === 'toRoman' ? arabic : roman}
            onchange={(e) => mode === 'toRoman' ? arabic = e.target.value : roman = e.target.value}
            placeholder={mode === 'toRoman' ? t('arabicPlaceholder') : t('romanPlaceholder')}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-2xl text-center font-mono"
          />
        </div>
        <div>
          <label class="tool-label">
            {mode === 'toRoman' ? t('romanNumeral') : t('arabicNumber')}
          </label>
          <input
            type="text"
            value={mode === 'toRoman' ? roman : arabic}
            readOnly
            placeholder={t('result')}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-2xl text-center font-mono"
          />
        </div>
      </div>

      {#if error}
<div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
          {error}
        </div>
{/if}

      <div class="flex justify-center gap-4">
        <button onclick={handleConvert} class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
          {t('convert')}
        </button>
        <button onclick={copyResult} class="px-6 py-3 btn-success rounded-lg hover:bg-green-700 transition-colors">
          {copied ? t('copied') : t('copy')}
        </button>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('referenceTitle')}</h3>
        <div class="grid grid-cols-4 md:grid-cols-7 gap-2 text-center text-sm">
          {#each [['I', '1'], ['V', '5'], ['X', '10'], ['L', '50'], ['C', '100'], ['D', '500'], ['M', '1000']] as [r, a] (r)}
<div  class="p-2 bg-white dark:bg-gray-700 rounded">
              <div class="font-bold text-lg text-amber-600 dark:text-amber-400">{r}</div>
              <div class="text-gray-600 dark:text-gray-400">{a}</div>
            </div>
{/each}
        </div>
      </div>
    </div>
  
