<script lang="ts">
  import { buildCrc32Table, crc32 } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['crc32-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.crc32-calculator.${key}`;
  }

  let inputMode = $state('text');

  let text = $state('');

  let file = $state(null);

  let crcHex = $state('');

  let crcDec = $state('');

  let error = $state('');

  let table = $derived(buildCrc32Table());

  function calculateForBytes(bytes: Uint8Array) {
    const value = crc32(bytes, table);
    crcHex = value.toString(16).toUpperCase().padStart(8, '0');
    crcDec = value.toString(10);
  }

  async function handleCalculate() {
    error = '';
    crcHex = '';
    crcDec = '';

    if (inputMode === 'text') {
      if (!text) return;
      const encoder = new TextEncoder();
      calculateForBytes(encoder.encode(text));
      return;
    }

    if (!file) {
      error = t('errorNoFile');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      calculateForBytes(new Uint8Array(buffer));
    } catch {
      error = t('errorReadFile');
    }
  }

  // Functions
  function handleCopy(value: string) {
    navigator.clipboard.writeText(value);
  }
  function loadSample() {
    inputMode = 'text';
    file = null;
    text = t('sampleText');
    crcHex = '';
    crcDec = '';
    error = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label for="crc32-calculator-field-6" class="text-sm text-gray-600 dark:text-gray-300">{t('inputMode')}:</label>
          <select
            value={inputMode}
            onchange={(e) => {
              inputMode = e.target.value as 'text' | 'file';
              error = '';
              crcHex = '';
              crcDec = '';
            }}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" id="crc32-calculator-field-6">
            <option value="text">{t('modeText')}</option>
            <option value="file">{t('modeFile')}</option>
          </select>
        </div>

        <button
          onclick={loadSample}
          class="text-sm text-amber-600 hover:text-amber-800"
        >
          {t('loadSample')}
        </button>
      </div>

      {#if inputMode === 'text'}
<div class="space-y-2">
          <label for="crc32-calculator-field-5" class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('textInput')}
          </label>
          <textarea
            bind:value={text}
            placeholder={t('textPlaceholder')}
            class="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono" id="crc32-calculator-field-5"></textarea>
        </div>
{:else}
<div class="space-y-2">
          <label for="crc32-calculator-field-4" class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('fileInput')}
          </label>
          <input
            type="file"
            onchange={(e) => file = e.target.files?.[0] || null}
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" id="crc32-calculator-field-4" />
          {#if file}
<div class="text-sm text-gray-600 dark:text-gray-300">
              {t('selectedFile')}: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
{/if}
        </div>
{/if}

      {#if error}
<div class="p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
{/if}

      <div class="flex justify-center">
        <button
          onclick={handleCalculate}
          class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {t('calculate')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('crcHex')}</div>
            {#if crcHex}
<button
                onclick={() => handleCopy(crcHex)}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <div class="mt-1 font-mono text-lg text-gray-900 dark:text-gray-100">{crcHex ? `0x${crcHex}` : '-'}</div>
        </div>

        <div class="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('crcDec')}</div>
            {#if crcDec}
<button
                onclick={() => handleCopy(crcDec)}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <div class="mt-1 font-mono text-lg text-gray-900 dark:text-gray-100">{crcDec || '-'}</div>
        </div>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-amber-700 dark:text-amber-400">{t('infoText')}</p>
      </div>
    </div>
  
