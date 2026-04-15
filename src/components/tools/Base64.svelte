<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const tools = translations['tools'] as Record<string, unknown> || {};
    const scope = tools['base64'] as Record<string, unknown> || {};
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

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);  onDestroy(() => {
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
        <label for="base64-input" class="tool-label">{tg('input')}</label>
        <textarea
          id="base64-input"
          name="inputValue"
          class="tool-textarea h-48"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={encode} class="btn-primary">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {t('encodeToBase64')}
          </div>
        </button>
        <button onclick={decode} class="btn-secondary">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
            {t('decodeFromBase64')}
          </div>
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2.5">
          <label for="base64-output" class="tool-label !mb-0">{tg('output')}</label>
          {#if output}
            <button
              onclick={copyOutput}
              class={`btn-sm transition-all duration-300 ${copied ? 'btn-success' : 'btn-secondary'}`}
            >
              <div class="flex items-center gap-1.5">
                {#if copied}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {/if}
                {copied ? tg('copied') : tg('copy')}
              </div>
            </button>
          {/if}
        </div>
        <textarea
          id="base64-output"
          name="outputValue"
          class="tool-result h-48"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}></textarea>
      </div>
    </div>
  
