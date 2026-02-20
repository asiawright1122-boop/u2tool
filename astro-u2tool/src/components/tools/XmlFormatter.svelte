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

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function format() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML');
      }
      output = formatXml(input);
      error = '';
    } catch (_e) {
      error = t('xml.invalidXml');
      output = '';
    }
  }
  function minify() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/xml');
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML');
      }
      output = minifyXml(input);
      error = '';
    } catch (_e) {
      error = t('xml.invalidXml');
      output = '';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder='<root><item>value</item></root>'
          rows={8}
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={format} class="btn-primary">
          {t('format')}
        </button>
        <button onclick={minify} class="btn-secondary">
          {t('minify')}
        </button>
        <button onclick={() => { input = ''; output = ''; error = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            class="tool-textarea"
            value={output}
            readOnly
            rows={8}></textarea>
        </div>
{/if}
    </div>
  
