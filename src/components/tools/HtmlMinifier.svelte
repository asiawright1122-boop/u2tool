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

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function minifyHtml() {
    try {
      const result = input
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .trim();
      output = result;
    } catch {
      output = t('error');
    }
  }
  function beautifyHtml() {
    try {
      const result = input.replace(/></g, '>\n<');
      const lines = result.split('\n');
      let indent = 0;
      const formatted = lines.map(line => {
        line = line.trim();
        if (line.match(/^<\/\w/)) indent--;
        const spaces = '  '.repeat(Math.max(0, indent));
        if (line.match(/^<\w[^>]*[^/]>.*$/)) indent++;
        return spaces + line;
      });
      output = formatted.join('\n');
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
      <div class="flex gap-2 flex-wrap">
        <button onclick={minifyHtml} class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('minify')}</button>
        <button onclick={beautifyHtml} class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('beautify')}</button>
        <button onclick={copy} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="html-minifier-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('input')}</label>
          <textarea id="html-minifier-input" name="inputValue" bind:value={input} class="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" placeholder="<html>..." />
        </div>
        <div>
          <label for="html-minifier-output" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('output')}</label>
          <textarea id="html-minifier-output" name="outputValue" value={output} readOnly class="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100"></textarea>
        </div>
      </div>
    </div>
  
