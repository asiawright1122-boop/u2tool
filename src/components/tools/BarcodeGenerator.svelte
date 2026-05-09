<script lang="ts">
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

  let text = $state('123456789012');

  let format = $state('code128');

  let bars = $derived(generateCode128(text));

  // Functions
  function generateCode128(data: string): string {
    const patterns: Record<string, string> = {
      ' ': '11011001100', '!': '11001101100', '"': '11001100110', '#': '10010011000',
      '$': '10010001100', '%': '10001001100', '&': '10011001000', "'": '10011000100',
      '(': '10001100100', ')': '11001001000', '*': '11001000100', '+': '11000100100',
      ',': '10110011100', '-': '10011011100', '.': '10011001110', '/': '10111001100',
      '0': '10011101100', '1': '11001110010', '2': '11001011100', '3': '11001001110',
      '4': '11011100100', '5': '11001110100', '6': '11101101110', '7': '11101001100',
      '8': '11100101100', '9': '11100100110', ':': '11101100100', ';': '11100110100',
      '<': '11100110010', '=': '11011011000', '>': '11011000110', '?': '11000110110',
      '@': '10100011000', 'A': '10001011000', 'B': '10001000110', 'C': '10110001000',
      'D': '10001101000', 'E': '10001100010', 'F': '11010001000', 'G': '11000101000',
      'H': '11000100010', 'I': '10110111000', 'J': '10110001110', 'K': '10001101110',
      'L': '10111011000', 'M': '10111000110', 'N': '10001110110', 'O': '11101110110',
      'P': '11010001110', 'Q': '11000101110', 'R': '11011101000', 'S': '11011100010',
      'T': '11011101110', 'U': '11101011000', 'V': '11101000110', 'W': '11100010110',
      'X': '11101101000', 'Y': '11101100010', 'Z': '11100011010'
    };
    const start = '11010000100';
    const stop = '1100011101011';
    let bars = start;
    for (const char of data.toUpperCase()) {
      bars += patterns[char] || patterns['?'];
    }
    bars += stop;
    return bars;
  }

</script>

{#snippet renderBarcode()}
<svg viewBox={`0 0 ${bars.length * 2} 100`} class="w-full h-24">
        <!-- 白色背景确保条码可读 -->
        <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
        {#each bars.split('') as b, i (i)}
          {#if b === '1'}
            <rect x={i * 2} y="10" width="2" height="80" fill="black"></rect>
          {/if}
{/each}
      </svg>
{/snippet}


    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" for="barcode-text">{t('barcode.text')}</label>
          <input type="text" id="barcode-text" name="text" bind:value={text} class="w-full h-12 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
        <div class="flex flex-col">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" for="barcode-format">{t('barcode.format')}</label>
          <select id="barcode-format" name="format" value={format} onchange={(e) => format = e.target.value as typeof format} class="w-full h-12 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
            <option value="code128">Code 128</option>
            <option value="code39">Code 39</option>
            <option value="ean13">EAN-13</option>
            <option value="upc">UPC-A</option>
          </select>
        </div>
      </div>
      <div class="bg-white rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        {@render renderBarcode()}
        <p class="text-center text-gray-900 mt-2 font-mono">{text}</p>
      </div>
    </div>
  
