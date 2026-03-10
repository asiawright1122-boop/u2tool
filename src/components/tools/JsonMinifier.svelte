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

  let stats = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function minify() {
    if (!input.trim()) {
      output = '';
      error = '';
      stats = null;
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      output = minified;
      error = '';
      stats = {
        original: input.length,
        minified: minified.length,
        saved: Math.round((1 - minified.length / input.length) * 100)
      };
    } catch (_e) {
      error = t('json.invalidJson');
      output = '';
      stats = null;
    }
  }
  function beautify() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed, null, 2);
      error = '';
      stats = null;
    } catch (_e) {
      error = t('json.invalidJson');
      output = '';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadSample() {
    input = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "gaming", "coding"]
}`;
  }

</script>


    <div class="space-y-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="json-min-input" class="block text-sm font-medium">{t('input')}</label>
          <button onclick={loadSample} class="text-sm text-blue-400 hover:text-blue-300">
            Load Sample
          </button>
        </div>
        <textarea
          id="json-min-input"
          name="jsonInput"
          class="tool-textarea"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          rows={8}></textarea>
      </div>

      {#if error}
<div class="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
{/if}

      <div class="flex flex-wrap gap-2">
        <button onclick={minify} class="btn-primary">
          {t('minify')}
        </button>
        <button onclick={beautify} class="btn-secondary">
          {t('beautify')}
        </button>
        <button onclick={() => { input = ''; output = ''; error = ''; stats = null; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if stats}
<div class="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.original}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Original (bytes)</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{stats.minified}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Minified (bytes)</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.saved}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Saved</div>
          </div>
        </div>
{/if}

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{t('output')}</label>
          {#if output}
<button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
{/if}
        </div>
        <textarea
          class="tool-textarea"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}
          rows={6}></textarea>
      </div>
    </div>
  
