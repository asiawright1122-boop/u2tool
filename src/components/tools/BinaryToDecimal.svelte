<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['binary-to-decimal'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.binary-to-decimal.${key}`;
  }

  // Types
  type ConversionMode = 'binToDec' | 'decToBin' | 'binToHex' | 'hexToBin';

  let input = $state('');

  let output = $state('');

  let mode = $state('binToDec');

  let error = $state('');

  let bitLength = $state(32);

  function convert() {
    error = '';
    if (!input.trim()) {
      output = '';
      return;
    }

    try {
      let result = '';
      const cleanInput = input.trim().replace(/\s+/g, '');

      switch (mode) {
        case 'binToDec': {
          if (!/^[01]+$/.test(cleanInput)) {
            error = t('errorInvalidBinary');
            return;
          }
          result = parseInt(cleanInput, 2).toString(10);
          break;
        }
        case 'decToBin': {
          const num = parseInt(cleanInput, 10);
          if (isNaN(num) || num < 0) {
            error = t('errorInvalidDecimal');
            return;
          }
          result = num.toString(2).padStart(bitLength, '0');
          break;
        }
        case 'binToHex': {
          if (!/^[01]+$/.test(cleanInput)) {
            error = t('errorInvalidBinary');
            return;
          }
          const dec = parseInt(cleanInput, 2);
          result = dec.toString(16).toUpperCase();
          break;
        }
        case 'hexToBin': {
          if (!/^[0-9A-Fa-f]+$/.test(cleanInput)) {
            error = t('errorInvalidHex');
            return;
          }
          const decimal = parseInt(cleanInput, 16);
          result = decimal.toString(2).padStart(bitLength, '0');
          break;
        }
      }
      output = result;
    } catch {
      error = t('errorConversion');
    }
  }

  // Functions
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }
  function formatBinary(bin: string): string {
    return bin.replace(/(.{4})/g, '$1 ').trim();
  }
  function loadSample() {
    switch (mode) {
      case 'binToDec':
        input = '11111111';
        break;
      case 'decToBin':
        input = '255';
        break;
      case 'binToHex':
        input = '11111111';
        break;
      case 'hexToBin':
        input = 'FF';
        break;
    }
    output = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onchange={(e) => { mode = e.target.value as ConversionMode; output = ''; error = ''; }}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="binToDec">{t('binToDec')}</option>
            <option value="decToBin">{t('decToBin')}</option>
            <option value="binToHex">{t('binToHex')}</option>
            <option value="hexToBin">{t('hexToBin')}</option>
          </select>
        </div>

        {#if mode === 'decToBin' || mode === 'hexToBin'}
<div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">{t('bitLength')}:</label>
            <select
              value={bitLength}
              onchange={(e) => bitLength = parseInt(e.target.value) as 8 | 16 | 32 | 64}
              class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="8">{t('bit8')}</option>
              <option value="16">{t('bit16')}</option>
              <option value="32">{t('bit32')}</option>
              <option value="64">{t('bit64')}</option>
            </select>
          </div>
{/if}

        <button
          onclick={loadSample}
          class="text-sm text-amber-600 hover:text-amber-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="tool-label">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('inputPlaceholder')}
            class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="tool-label">
              {t('output')}
            </label>
            {#if output}
<button
                onclick={handleCopy}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            value={mode === 'decToBin' || mode === 'hexToBin' ? formatBinary(output) : output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>
      </div>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
{/if}

      <div class="flex justify-center">
        <button
          onclick={convert}
          class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {t('convert')}
        </button>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('quickRef')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-amber-700 dark:text-amber-400">
          <div>0 = 0000</div>
          <div>1 = 0001</div>
          <div>2 = 0010</div>
          <div>3 = 0011</div>
          <div>4 = 0100</div>
          <div>5 = 0101</div>
          <div>6 = 0110</div>
          <div>7 = 0111</div>
          <div>8 = 1000</div>
          <div>9 = 1001</div>
          <div>A = 1010</div>
          <div>B = 1011</div>
          <div>C = 1100</div>
          <div>D = 1101</div>
          <div>E = 1110</div>
          <div>F = 1111</div>
        </div>
      </div>
    </div>
  
