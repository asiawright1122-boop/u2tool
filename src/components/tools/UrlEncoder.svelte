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
  function encode() {
    if (!input.trim()) {
      output = '';
      return;
    }
    output = encodeURIComponent(input);
  }
  function decode() {
    if (!input.trim()) {
      output = '';
      return;
    }
    try {
      output = decodeURIComponent(input);
    } catch (_e) {
      output = 'Error: Invalid URL encoding';
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
        <label for="url-encoder-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          id="url-encoder-input"
          name="inputValue"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={encode} class="btn-primary">
          {t('url.encodeUrl')}
        </button>
        <button onclick={decode} class="btn-secondary">
          {t('url.decodeUrl')}
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="url-encoder-output" class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
          {#if output}
<button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
{/if}
        </div>
        <textarea
          id="url-encoder-output"
          name="outputValue"
          class="tool-textarea"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}></textarea>
      </div>
    </div>
  
