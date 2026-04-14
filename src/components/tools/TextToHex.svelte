<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-to-hex'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-to-hex.${key}`;
  }

  // Types
  type Encoding = 'utf8' | 'ascii' | 'utf16';
  type Separator = 'space' | 'none' | 'comma' | '0x';

  let text = $state('');

  let hex = $state('');

  let encoding = $state('utf8');

  let separator = $state('space');

  let uppercase = $state(true);

  let mode = $state('encode');

  function textToHex(input: string) {
    if (!input) return '';
    
    let bytes: number[] = [];
    
    if (encoding === 'utf8') {
      const encoder = new TextEncoder();
      bytes = Array.from(encoder.encode(input));
    } else if (encoding === 'ascii') {
      bytes = input.split('').map(c => c.charCodeAt(0) & 0xFF);
    } else if (encoding === 'utf16') {
      for (let i = 0; i < input.length; i++) {
        const code = input.charCodeAt(i);
        bytes.push((code >> 8) & 0xFF);
        bytes.push(code & 0xFF);
      }
    }

    const sep = getSeparatorChar(separator);
    
    let result = bytes.map(b => {
      const hexStr = b.toString(16).padStart(2, '0');
      return uppercase ? hexStr.toUpperCase() : hexStr;
    }).join(sep);

    if (separator === '0x' && result) {
      result = '0x' + result;
    }

    return result;
  }

  function hexToText(input: string) {
    if (!input) return '';
    
    // Clean the input - remove 0x prefixes, spaces, commas
    const cleaned = input.replace(/0x/gi, '').replace(/[,\s]/g, '');
    
    if (!/^[0-9A-Fa-f]*$/.test(cleaned) || cleaned.length % 2 !== 0) {
      return t('errorInvalidHex');
    }

    const bytes: number[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes.push(parseInt(cleaned.substr(i, 2), 16));
    }

    if (encoding === 'utf8') {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(new Uint8Array(bytes));
    } else if (encoding === 'ascii') {
      return bytes.map(b => String.fromCharCode(b)).join('');
    } else if (encoding === 'utf16') {
      let result = '';
      for (let i = 0; i < bytes.length; i += 2) {
        const code = (bytes[i] << 8) | (bytes[i + 1] || 0);
        result += String.fromCharCode(code);
      }
      return result;
    }

    return '';
  }

  // Functions
  function getSeparatorChar(sep: Separator): string {
    switch (sep) {
      case 'space': return ' ';
      case 'comma': return ', ';
      case '0x': return ' 0x';
      default: return '';
    }
  }
  function handleConvert() {
    if (mode === 'encode') {
      hex = textToHex(text);
    } else {
      text = hexToText(hex);
    }
  }
  function handleSwap() {
    mode = mode === 'encode' ? 'decode' : 'encode';
  }
  function handleCopy(content: string) {
    navigator.clipboard.writeText(content);
  }
  function loadSample() {
    text = 'Hello, World! 你好世界';
    hex = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('encoding')}:</label>
          <select
            value={encoding}
            onchange={(e) => encoding = e.target.value as Encoding}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="utf8">UTF-8</option>
            <option value="ascii">ASCII</option>
            <option value="utf16">UTF-16</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('separator')}:</label>
          <select
            value={separator}
            onchange={(e) => separator = e.target.value as Separator}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="space">{t('sepSpace')}</option>
            <option value="none">{t('sepNone')}</option>
            <option value="comma">{t('sepComma')}</option>
            <option value="0x">0x {t('sepPrefix')}</option>
          </select>
        </div>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={uppercase}
            class="w-4 h-4 text-amber-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('uppercase')}</span>
        </label>

        <button
          onclick={loadSample}
          class="text-sm text-amber-600 hover:text-amber-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('textInput')}
            </label>
            {#if text}
<button
                onclick={() => handleCopy(text)}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            id="text-hex-input"
            name="textInput"
            bind:value={text}
            placeholder={t('textPlaceholder')}
            class="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="text-hex-output" class="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('hexOutput')}
            </label>
            {#if hex}
<button
                onclick={() => handleCopy(hex)}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            id="text-hex-output"
            name="hexOutput"
            bind:value={hex}
            placeholder={t('hexPlaceholder')}
            class="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          onclick={handleConvert}
          class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {mode === 'encode' ? t('textToHex') : t('hexToText')}
        </button>
        <button
          onclick={handleSwap}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ⇄ {t('swap')}
        </button>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-amber-700 dark:text-amber-400">{t('infoText')}</p>
      </div>
    </div>
  
