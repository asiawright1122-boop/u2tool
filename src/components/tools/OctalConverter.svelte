<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['octal-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.octal-converter.${key}`;
  }

  // Types
  type ConversionMode = 'octToDec' | 'decToOct' | 'octToBin' | 'binToOct' | 'octToHex' | 'hexToOct';

  let input = $state('');

  let output = $state('');

  let mode = $state('octToDec');

  let error = $state('');

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
        case 'octToDec': {
          if (!/^[0-7]+$/.test(cleanInput)) {
            error = t('errorInvalidOctal');
            return;
          }
          result = parseInt(cleanInput, 8).toString(10);
          break;
        }
        case 'decToOct': {
          const num = parseInt(cleanInput, 10);
          if (isNaN(num) || num < 0) {
            error = t('errorInvalidDecimal');
            return;
          }
          result = num.toString(8);
          break;
        }
        case 'octToBin': {
          if (!/^[0-7]+$/.test(cleanInput)) {
            error = t('errorInvalidOctal');
            return;
          }
          const dec = parseInt(cleanInput, 8);
          result = dec.toString(2);
          break;
        }
        case 'binToOct': {
          if (!/^[01]+$/.test(cleanInput)) {
            error = t('errorInvalidBinary');
            return;
          }
          const dec = parseInt(cleanInput, 2);
          result = dec.toString(8);
          break;
        }
        case 'octToHex': {
          if (!/^[0-7]+$/.test(cleanInput)) {
            error = t('errorInvalidOctal');
            return;
          }
          const dec = parseInt(cleanInput, 8);
          result = dec.toString(16).toUpperCase();
          break;
        }
        case 'hexToOct': {
          if (!/^[0-9A-Fa-f]+$/.test(cleanInput)) {
            error = t('errorInvalidHex');
            return;
          }
          const dec = parseInt(cleanInput, 16);
          result = dec.toString(8);
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
  function loadSample() {
    switch (mode) {
      case 'octToDec':
        input = '755';
        break;
      case 'decToOct':
        input = '493';
        break;
      case 'octToBin':
        input = '777';
        break;
      case 'binToOct':
        input = '111111111';
        break;
      case 'octToHex':
        input = '755';
        break;
      case 'hexToOct':
        input = '1ED';
        break;
    }
    output = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label for="octal-converter-field-5" class="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onchange={(e) => { mode = e.target.value as ConversionMode; output = ''; error = ''; }}
            class="tool-input w-auto" id="octal-converter-field-5">
            <option value="octToDec">{t('octToDec')}</option>
            <option value="decToOct">{t('decToOct')}</option>
            <option value="octToBin">{t('octToBin')}</option>
            <option value="binToOct">{t('binToOct')}</option>
            <option value="octToHex">{t('octToHex')}</option>
            <option value="hexToOct">{t('hexToOct')}</option>
          </select>
        </div>

        <button
          onclick={loadSample}
          class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="octal-converter-field-4" class="tool-label">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('inputPlaceholder')}
            class="tool-textarea h-32" id="octal-converter-field-4"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="tool-label mb-0">
              {t('output')}
            </div>
            {#if output}
<button
                onclick={handleCopy}
                class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="tool-textarea h-32"></textarea>
        </div>
      </div>

      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      <div class="flex justify-center">
        <button
          onclick={convert}
          class="btn-primary"
        >
          {t('convert')}
        </button>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-amber-700 dark:text-amber-400">{t('infoText')}</p>
      </div>
    </div>
  
