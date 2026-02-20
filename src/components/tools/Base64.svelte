<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['base64'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.base64.${key}`;
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
    try {
      output = btoa(unescape(encodeURIComponent(input)));
    } catch (_e) {
      output = tg('errorEncoding');
    }
  }
  function decode() {
    if (!input.trim()) {
      output = '';
      return;
    }
    try {
      output = decodeURIComponent(escape(atob(input)));
    } catch (_e) {
      output = tg('errorInvalidBase64');
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
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={encode} class="btn-primary">
          {t('encodeToBase64')}
        </button>
        <button onclick={decode} class="btn-secondary">
          {t('decodeFromBase64')}
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

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
  
