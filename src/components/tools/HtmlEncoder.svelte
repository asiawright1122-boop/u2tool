<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = (translations.tools as Record<string, unknown>) ?? {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');
  let output = $state('');
  let copied = $state(false);
  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  function encode() {
    if (!input.trim()) {
      output = '';
      return;
    }
    const div = document.createElement('div');
    div.textContent = input;
    output = div.innerHTML;
  }

  function decode() {
    if (!input.trim()) {
      output = '';
      return;
    }
    const div = document.createElement('div');
    div.innerHTML = input;
    output = div.textContent || '';
  }

  function clearAll() {
    input = '';
    output = '';
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<div class="space-y-4">
  <div>
    <label for="html-encoder-input" class="block text-sm font-medium mb-2">{t('input')}</label>
    <textarea
      id="html-encoder-input"
      name="htmlInput"
      class="tool-textarea"
      bind:value={input}
      placeholder={t('inputPlaceholder')}
    ></textarea>
  </div>

  <div class="flex flex-wrap gap-2">
    <button onclick={encode} class="btn-primary">{t('html.encodeHtml')}</button>
    <button onclick={decode} class="btn-secondary">{t('html.decodeHtml')}</button>
    <button onclick={clearAll} class="btn-secondary">{t('clear')}</button>
  </div>

  <div>
    <div class="flex justify-between items-center mb-2">
      <label for="html-encoder-output" class="text-sm font-medium">{t('output')}</label>
      {#if output}
        <button
          onclick={copyOutput}
          class={`text-sm px-3 py-1 rounded text-white ${
            copied
              ? 'bg-green-600'
              : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
          }`}
        >
          {copied ? t('copied') : t('copy')}
        </button>
      {/if}
    </div>
    <textarea
      id="html-encoder-output"
      name="htmlOutput"
      class="tool-textarea"
      value={output}
      readonly
      placeholder={t('outputPlaceholder')}
    ></textarea>
  </div>
</div>
