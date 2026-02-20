<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-formatter.${key}`;
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

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function formatJson() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed, null, 2);
      error = '';
    } catch (_e) {
      error = tg('json.invalidJson') + ': ' + (_e as Error).message;
      output = '';
    }
  }
  function minifyJson() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed);
      error = '';
    } catch (_e) {
      error = tg('json.invalidJson') + ': ' + (_e as Error).message;
      output = '';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function clearAll() {
    input = '';
    output = '';
    error = '';
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={formatJson} class="btn-primary">
          {tg('format')} ({tg('beautify')})
        </button>
        <button onclick={minifyJson} class="btn-secondary">
          {tg('minify')}
        </button>
        <button onclick={clearAll} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{tg('output')}</label>
          {#if output}
<button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
{/if}
        </div>
        <textarea
          class="tool-textarea"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}></textarea>
      </div>
    </div>
  
