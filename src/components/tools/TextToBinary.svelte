<script lang="ts">
  import { onDestroy } from 'svelte';

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

  let text = $state('');

  let binary = $state('');

  let mode = $state('toBinary');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function textToBinary(str: string): string {
    return str.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  }
  function binaryToText(bin: string): string {
    const bytes = bin.replace(/[^01]/g, '').match(/.{1,8}/g);
    if (!bytes) return '';
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  }
  function handleTextChange(value: string) {
    text = value;
    if (mode === 'toBinary') {
      binary = textToBinary(value);
    }
  }
  function handleBinaryChange(value: string) {
    binary = value;
    if (mode === 'toText') {
      try {
        text = binaryToText(value);
      } catch {
        text = '';
      }
    }
  }
  function switchMode(newMode: 'toBinary' | 'toText') {
    mode = newMode;
    if (newMode === 'toBinary' && text) {
      binary = textToBinary(text);
    } else if (newMode === 'toText' && binary) {
      text = binaryToText(binary);
    }
  }
  function copyResult() {
    const result = mode === 'toBinary' ? binary : text;
    navigator.clipboard.writeText(result);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2">
        <button
          onclick={() => switchMode('toBinary')}
          class={`px-4 py-2 rounded ${mode === 'toBinary' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          {t('textBinary.toBinary')}
        </button>
        <button
          onclick={() => switchMode('toText')}
          class={`px-4 py-2 rounded ${mode === 'toText' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          {t('textBinary.toText')}
        </button>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="text-binary-input" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('textBinary.text')}</label>
          <textarea
            id="text-binary-input"
            name="textInput"
            value={text}
            onchange={(e) => handleTextChange(e.target.value)}
            class="w-full h-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-white"
            placeholder={t('textBinary.textPlaceholder')}
            readOnly={mode === 'toText'}
          />
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label for="text-binary-output" class="text-sm text-gray-600 dark:text-gray-300">{t('textBinary.binary')}</label>
            <button onclick={copyResult} class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            id="text-binary-output"
            name="binaryOutput"
            value={binary}
            onchange={(e) => handleBinaryChange(e.target.value)}
            class="w-full h-40 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"
            placeholder={t('textBinary.binaryPlaceholder')}
            readOnly={mode === 'toBinary'}
          />
        </div>
      </div>
    </div>
  
