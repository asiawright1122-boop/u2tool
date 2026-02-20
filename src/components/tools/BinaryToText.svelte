<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['binary-to-text'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.binary-to-text.${key}`;
  }

  let binary = $state('');

  let text = $state('');

  let mode = $state('toText');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function binaryToText(bin: string): string {
    const cleaned = bin.replace(/[^01]/g, '');
    if (cleaned.length % 8 !== 0) {
      throw new Error('Invalid binary length');
    }
    let result = '';
    for (let i = 0; i < cleaned.length; i += 8) {
      const byte = cleaned.substr(i, 8);
      result += String.fromCharCode(parseInt(byte, 2));
    }
    return result;
  }
  function textToBinary(txt: string): string {
    return txt.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  }
  function handleConvert() {
    error = '';
    try {
      if (mode === 'toText') {
        const result = binaryToText(binary);
        text = result;
      } else {
        const result = textToBinary(text);
        binary = result;
      }
    } catch {
      error = t('invalidBinary');
    }
  }
  function copyToClipboard() {
    const content = mode === 'toText' ? text : binary;
    navigator.clipboard.writeText(content);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function swapMode() {
    mode = mode === 'toText' ? 'toBinary' : 'toText';
    error = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex justify-center">
        <div class="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            onclick={() => mode = 'toText'}
            class={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toText'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('binaryToText')}
          </button>
          <button
            onclick={() => mode = 'toBinary'}
            class={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toBinary'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('textToBinary')}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toText' ? t('binaryInput') : t('textInput')}
          </label>
          <textarea
            value={mode === 'toText' ? binary : text}
            onchange={(e) => mode === 'toText' ? binary = e.target.value : text = e.target.value}
            placeholder={mode === 'toText' ? t('binaryPlaceholder') : t('textPlaceholder')}
            class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toText' ? t('textOutput') : t('binaryOutput')}
          </label>
          <textarea
            value={mode === 'toText' ? text : binary}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"></textarea>
        </div>
      </div>

      {#if error}
<div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
{/if}

      <div class="flex justify-center gap-4">
        <button
          onclick={handleConvert}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        <button
          onclick={swapMode}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> {t('swap')}
        </button>
        <button
          onclick={copyToClipboard}
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {copied ? t('copied') : t('copy')}
        </button>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('exampleTitle')}</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div class="text-gray-500 dark:text-gray-400">{t('text')}:</div>
            <div class="font-mono text-gray-900 dark:text-white">Hello</div>
          </div>
          <div>
            <div class="text-gray-500 dark:text-gray-400">{t('binary')}:</div>
            <div class="font-mono text-gray-900 dark:text-white text-xs">01001000 01100101 01101100 01101100 01101111</div>
          </div>
        </div>
      </div>
    </div>
  
