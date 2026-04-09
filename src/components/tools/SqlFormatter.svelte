<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formatSql, minifySql } from '@/lib/tool-stubs';

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
  function format() {
    if (!input.trim()) {
      output = '';
      return;
    }
    output = formatSql(input);
  }
  function minify() {
    if (!input.trim()) {
      output = '';
      return;
    }
    output = minifySql(input);
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const exampleSql = `select id, name, email from users where status = 'active' and created_at > '2024-01-01' order by name asc limit 10`;

</script>


    <div class="space-y-4">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{t('input')}</label>
          <button
            onclick={() => input = exampleSql}
            class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
          >
            {t('sql.loadExample')}
          </button>
        </div>
        <textarea
          class="tool-textarea font-mono text-sm"
          bind:value={input}
          placeholder={t('sql.loadExample')}
          rows={6}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={format} class="btn-primary">
          {t('format')}
        </button>
        <button onclick={minify} class="btn-secondary">
          {t('minify')}
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{t('output')}</label>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            class="tool-textarea font-mono text-sm"
            value={output}
            readOnly
            rows={10}></textarea>
        </div>
{/if}
    </div>
  
