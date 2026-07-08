<script lang="ts">
  import { BASE85_CHARS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['base85'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.base85.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('Hello, World!');

  let output = $state('');

  let mode = $state('encode');

  // Functions
  function encode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let result = '';
    
    for (let i = 0; i < bytes.length; i += 4) {
      let value = 0;
      const chunk = Math.min(4, bytes.length - i);
      
      for (let j = 0; j < chunk; j++) {
        value = value * 256 + bytes[i + j];
      }
      
      // Pad with zeros if needed
      for (let j = chunk; j < 4; j++) {
        value = value * 256;
      }
      
      const encoded: string[] = [];
      for (let j = 0; j < 5; j++) {
        encoded.unshift(BASE85_CHARS[value % 85]);
        value = Math.floor(value / 85);
      }
      
      // Only include necessary characters based on input length
      const outputChars = chunk === 4 ? 5 : chunk + 1;
      result += encoded.slice(0, outputChars).join('');
    }
    
    return result;
  }
  function decode(str: string): string {
    const bytes: number[] = [];
    let i = 0;
    
    while (i < str.length) {
      let value = 0;
      const chunk = Math.min(5, str.length - i);
      
      for (let j = 0; j < chunk; j++) {
        const charIndex = BASE85_CHARS.indexOf(str[i + j]);
        if (charIndex === -1) {
          throw new Error(`Invalid character: ${str[i + j]}`);
        }
        value = value * 85 + charIndex;
      }

      // Pad with 'u' (84) if needed
      for (let j = chunk; j < 5; j++) {
        value = value * 85 + 84;
      }
      
      const outputBytes = chunk === 5 ? 4 : chunk - 1;
      for (let j = 3; j >= 4 - outputBytes; j--) {
        bytes.push((value >> (j * 8)) & 0xff);
      }
      
      i += chunk;
    }
    
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
  function process() {
    try {
      if (mode === 'encode') {
        output = encode(input);
      } else {
        output = decode(input);
      }
    } catch (_e) {
      output = `${tg('error')}: ${_e instanceof Error ? _e.message : tg('errorInvalidInput')}`;
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-4">
        <button onclick={() => mode = 'encode'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${mode === 'encode' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'}`}>
          Encode
        </button>
        <button onclick={() => mode = 'decode'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors text-white ${mode === 'decode' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600'}`}>
          Decode
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="base85-field-4" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
          <textarea bind:value={input}
            class="w-full h-60 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={mode === 'encode' ? t('inputPlaceholderEncode') : t('inputPlaceholderDecode')} id="base85-field-4"></textarea>
        </div>
        <div>
          <label for="base85-field-3" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea value={output} readOnly
            class="w-full h-60 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')} id="base85-field-3"></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button onclick={process}
          class="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
          {mode === 'encode' ? t('encode') : t('decode')}
        </button>
        <button onclick={copyToClipboard} disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>
    </div>
  
