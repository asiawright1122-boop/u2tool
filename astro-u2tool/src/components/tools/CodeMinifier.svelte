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
  function tc(key: string): string {
    const scope = translations['tools']['code-minifier'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.code-minifier.${key}`;
  }

  // Types
  type CodeType = 'html' | 'css' | 'js';

  let codeType = $state('html');

  let input = $state('');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function minify() {
    if (!input.trim()) {
      output = '';
      return;
    }
    
    let result = '';
    switch (codeType) {
      case 'html':
        result = minifyHtml(input);
        break;
      case 'css':
        result = minifyCss(input);
        break;
      case 'js':
        result = minifyJs(input);
        break;
    }
    output = result;
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const stats = {
    original: input.length,
    minified: output.length,
    saved: input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0,
  };

</script>


    <div class="space-y-4">
      <!-- Code Type Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{tc('codeType')}</label>
        <div class="flex gap-2">
          {#each (['html', 'css', 'js'] as CodeType[]) as type (type)}
<button 
              onclick={() => codeType = type}
              class={`px-4 py-2 rounded-lg uppercase font-medium text-white ${
                codeType === type ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-800 hover:bg-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              {type}
            </button>
{/each}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          class="tool-textarea font-mono text-sm"
          bind:value={input}
          placeholder={tc('placeholder', { type: codeType.toUpperCase() })}
          rows={8}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={minify} class="btn-primary">
          {t('minify')}
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if output}
<div>

          <!-- Stats -->
          <div class="flex gap-4 text-sm">
            <span class="text-gray-600 dark:text-gray-300">{tc('original')}: {stats.original} bytes</span>
            <span class="text-gray-600 dark:text-gray-300">{tc('minified')}: {stats.minified} bytes</span>
            <span class="text-green-600 dark:text-green-400">{tc('saved')}: {stats.saved}%</span>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium">{t('output')}</label>
              <button
                onclick={copyOutput}
                class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
            <textarea
              class="tool-textarea font-mono text-sm"
              value={output}
              readOnly
              rows={6}></textarea>
          </div>
        
</div>
{/if}
    </div>
  
