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

  let width = $state(80);

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function wrap() {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    output = lines.join('\n');
  }
  async function copy() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <label class="text-sm text-gray-700 dark:text-white" for="text-width">{t('textWrapper.width')}:</label>
        <input type="number" id="text-width" name="width" value={width} onchange={(e) => width = Number(e.target.value)} min={20} max={200} class="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white" />
        <span class="text-gray-600 dark:text-gray-300">{t('textWrapper.chars')}</span>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('input')}</label>
          <textarea bind:value={text} class="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('textWrapper.placeholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('output')}</label>
          <textarea value={output} readOnly class="w-full h-48 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white"></textarea>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick={wrap} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('textWrapper.wrap')}</button>
        <button onclick={copy} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  
