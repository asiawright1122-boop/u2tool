<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['hex-base64-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.hex-base64-converter.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let mode = $state('hex-to-base64');

  let copied = $state(false);

  let error = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function hexToBase64(hex: string): string {
    // Remove spaces and validate
    const cleanHex = hex.replace(/\s+/g, '').toLowerCase();
    if (!/^[0-9a-f]*$/.test(cleanHex)) {
      throw new Error('Invalid hexadecimal string');
    }
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hex string must have even length');
    }

    // Convert hex to bytes
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }

    // Convert bytes to base64
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }
  function base64ToHex(base64: string): string {
    // Decode base64 to bytes
    const binary = atob(base64.trim());
    
    // Convert bytes to hex
    let hex = '';
    for (let i = 0; i < binary.length; i++) {
      const byte = binary.charCodeAt(i);
      hex += byte.toString(16).padStart(2, '0');
    }
    
    // Format with spaces every 2 characters for readability
    return hex.toUpperCase().match(/.{1,2}/g)?.join(' ') || '';
  }
  function convert() {
    error = '';
    if (!input.trim()) {
      output = '';
      return;
    }

    try {
      if (mode === 'hex-to-base64') {
        output = hexToBase64(input);
      } else {
        output = base64ToHex(input);
      }
    } catch (_e) {
      error = _e instanceof Error ? _e.message : tg('errorProcessing');
      output = '';
    }
  }
  function swap() {
    mode = mode === 'hex-to-base64' ? 'base64-to-hex' : 'hex-to-base64';
    input = output.replace(/\s+/g, '');
    output = '';
    error = '';
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadSample() {
    if (mode === 'hex-to-base64') {
      input = '48 65 6C 6C 6F 20 57 6F 72 6C 64 21';
    } else {
      input = 'SGVsbG8gV29ybGQh';
    }
  }

</script>


    <div class="space-y-6">
      <div class="flex items-center justify-center gap-4">
        <button
          onclick={() => { mode = 'hex-to-base64'; output = ''; error = ''; }}
          class={`px-4 py-2 rounded-lg text-white ${mode === 'hex-to-base64' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'}`}
        >
          {t('hexToBase64')}
        </button>
        <button
          onclick={swap}
          class="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
          title={t('swap')}
        >
          ⇄
        </button>
        <button
          onclick={() => { mode = 'base64-to-hex'; output = ''; error = ''; }}
          class={`px-4 py-2 rounded-lg text-white ${mode === 'base64-to-hex' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'}`}
        >
          {t('base64ToHex')}
        </button>
      </div>

      <div class="flex gap-2">
        <button
          onclick={loadSample}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-2">
            {mode === 'hex-to-base64' ? t('hexInput') : t('base64Input')}
          </label>
          <textarea
            bind:value={input}
            class="tool-textarea h-40 font-mono"
            placeholder={mode === 'hex-to-base64' ? t('hexPlaceholder') : t('base64Placeholder')}></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            class="tool-textarea h-40 font-mono"></textarea>
        </div>
      </div>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
{/if}

      <div class="flex justify-center gap-3">
        <button
          onclick={convert}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
        >
          {tg('convert')}
        </button>
        <button
          onclick={copyOutput}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
          disabled={!output}
        >
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
        <h3 class="font-medium mb-2 text-gray-900 dark:text-white">{t('examples')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Hex:</p>
            <code class="text-amber-600 dark:text-amber-400">48 65 6C 6C 6F</code>
          </div>
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-300">Base64:</p>
            <code class="text-green-600 dark:text-green-400">SGVsbG8=</code>
          </div>
        </div>
      </div>
    </div>
  
