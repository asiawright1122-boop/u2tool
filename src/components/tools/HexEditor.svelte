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

  let hex = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function textToHex() {
    const result = Array.from(new TextEncoder().encode(text))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
    hex = result;
  }
  function hexToText() {
    try {
      const bytes = hex.replace(/\s+/g, '').match(/.{1,2}/g) || [];
      const result = new TextDecoder().decode(new Uint8Array(bytes.map(b => parseInt(b, 16))));
      text = result;
    } catch { text = 'Error'; }
  }
  async function copy(val: string) {
    await navigator.clipboard.writeText(val);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('hexEditor.text')}</label>
          <textarea bind:value={text} class="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('inputPlaceholder')}></textarea>
          <div class="flex gap-2 mt-2">
            <button onclick={textToHex} class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">{t('hexEditor.toHex')}</button>
            <button onclick={() => copy(text)} class="px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('hexEditor.hex')}</label>
          <textarea bind:value={hex} class="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder="48 65 6C 6C 6F"></textarea>
          <div class="flex gap-2 mt-2">
            <button onclick={hexToText} class="px-4 py-2 btn-success rounded hover:bg-green-700">{t('hexEditor.toText')}</button>
            <button onclick={() => copy(hex)} class="px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
          </div>
        </div>
      </div>
    </div>
  
