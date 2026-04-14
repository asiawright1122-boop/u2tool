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
        <label for="json-formatter-input" class="tool-label">{tg('input')}</label>
        <textarea
          id="json-formatter-input"
          name="inputValue"
          class="tool-textarea h-64"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={formatJson} class="btn-primary">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            {tg('format')}
          </div>
        </button>
        <button onclick={minifyJson} class="btn-secondary">
          {tg('minify')}
        </button>
        <button onclick={clearAll} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {#if error}
        <div class="tool-error animate-in fade-in slide-in-from-top-1 duration-300">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        </div>
      {/if}

      <div>
        <div class="flex justify-between items-center mb-2.5">
          <label for="json-formatter-output" class="tool-label !mb-0">{tg('output')}</label>
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
          id="json-formatter-output"
          name="outputValue"
          class="tool-result h-64"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}></textarea>
      </div>
    </div>
  
