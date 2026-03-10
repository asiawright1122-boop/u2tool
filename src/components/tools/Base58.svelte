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
  function tb(key: string): string {
    const scope = translations['tools']['base58'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.base58.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function encode() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      output = encodeBase58(input);
      error = '';
    } catch (_e) {
      error = t('errorEncoding');
      output = '';
    }
  }
  function decode() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      output = decodeBase58(input);
      error = '';
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : t('errorInvalidInput');
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
        <label for="base58-input" class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          id="base58-input"
          name="inputValue"
          class="tool-textarea"
          bind:value={input}
          placeholder={tb('placeholder')}
          rows={4}></textarea>
      </div>

      {#if error}
<div class="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
{/if}

      <div class="flex flex-wrap gap-2">
        <button onclick={encode} class="btn-primary">
          {tb('encodeBtn')}
        </button>
        <button onclick={decode} class="btn-secondary">
          {tb('decodeBtn')}
        </button>
        <button onclick={() => { input = ''; output = ''; error = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="base58-output" class="text-sm font-medium">{t('output')}</label>
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
          id="base58-output"
          name="outputValue"
          class="tool-textarea"
          value={output}
          readOnly
          placeholder={tb('resultPlaceholder')}
          rows={4}></textarea>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{tb('aboutTitle')}</h3>
        <p class="mb-2">
          {tb('aboutText')}
        </p>
        <p class="font-mono text-xs">
          Alphabet: {BASE58_ALPHABET}
        </p>
      </div>
    </div>
  
