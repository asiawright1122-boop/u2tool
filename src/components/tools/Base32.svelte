<script lang="ts">
  import { onDestroy } from 'svelte';
  import { BASE32_CHARS } from '@/lib/tool-stubs';

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

  let input = $state('');

  let output = $state('');

  let mode = $state('encode');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function encode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let bits = '';
    bytes.forEach(b => bits += b.toString(2).padStart(8, '0'));
    while (bits.length % 5 !== 0) bits += '0';
    let result = '';
    for (let i = 0; i < bits.length; i += 5) {
      result += BASE32_CHARS[parseInt(bits.slice(i, i + 5), 2)];
    }
    while (result.length % 8 !== 0) result += '=';
    return result;
  }
  function decode(str: string): string {
    const cleaned = str.replace(/=/g, '').toUpperCase();
    let bits = '';
    for (const char of cleaned) {
      const idx = BASE32_CHARS.indexOf(char);
      if (idx === -1) throw new Error('Invalid');
      bits += idx.toString(2).padStart(5, '0');
    }
    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
  function convert() {
    try {
      output = mode === 'encode' ? encode(input) : decode(input);
    } catch {
      output = t('error');
    }
  }
  async function copy() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2">
        <button onclick={() => mode = 'encode'} class={`px-4 py-2 rounded text-white ${mode === 'encode' ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-700'}`}>{t('encode')}</button>
        <button onclick={() => mode = 'decode'} class={`px-4 py-2 rounded text-white ${mode === 'decode' ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-700'}`}>{t('decode')}</button>
      </div>
      <div>
        <label for="base32-input" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('input')}</label>
        <textarea id="base32-input" name="inputValue" bind:value={input} class="w-full h-32 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={mode === 'encode' ? 'Hello World' : 'JBSWY3DPEBLW64TMMQ======'}></textarea>
      </div>
      <div class="flex gap-2">
        <button onclick={convert} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onclick={copy} class="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div>
        <label for="base32-output" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('output')}</label>
        <textarea id="base32-output" name="outputValue" value={output} readOnly class="w-full h-32 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white"></textarea>
      </div>
    </div>
  
