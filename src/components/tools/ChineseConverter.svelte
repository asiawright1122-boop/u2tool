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
  function convertToTraditional() {
    if (!input.trim()) { output = ''; return; }
    output = toTraditional(input);
  }
  function convertToSimplified() {
    if (!input.trim()) { output = ''; return; }
    output = toSimplified(input);
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
        <label for="chinese-input" class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea id="chinese-input" name="inputValue" class="tool-textarea" bind:value={input} placeholder={t('chinese.placeholder')} rows={6}></textarea>
      </div>
      <div class="flex flex-wrap gap-2">
        <button onclick={convertToTraditional} class="btn-primary">{t('chinese.toTraditional')}</button>
        <button onclick={convertToSimplified} class="btn-secondary">{t('chinese.toSimplified')}</button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">{t('clear')}</button>
      </div>
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label for="chinese-output" class="text-sm font-medium">{t('output')}</label>
            <button onclick={copyOutput} class={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea id="chinese-output" name="outputValue" class="tool-textarea" value={output} readOnly rows={6}></textarea>
        </div>
{/if}
    </div>
  
