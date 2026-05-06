<script lang="ts">
  import { onDestroy } from 'svelte';
  import { convertSqlToMongo } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sql-to-mongo'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sql-to-mongo.${key}`;
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
  function convert() {
    if (!input.trim()) {
      output = '';
      return;
    }
    const conversion = convertSqlToMongo(input) as { query?: string } | string | null;
    output = typeof conversion === 'string' ? conversion : conversion?.query || '';
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const examples = [
    { sql: "SELECT * FROM users WHERE age > 25", descKey: "exampleSimpleSelect" },
    { sql: "SELECT name, email FROM users WHERE status = 'active' ORDER BY name LIMIT 10", descKey: "exampleSelectProjection" },
    { sql: "INSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 30)", descKey: "exampleInsert" },
    { sql: "UPDATE users SET status = 'inactive' WHERE age < 18", descKey: "exampleUpdate" },
    { sql: "DELETE FROM users WHERE status = 'deleted'", descKey: "exampleDelete" },
  ];

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">{t('sqlQuery')}</label>
        <textarea
          class="tool-textarea font-mono"
          bind:value={input}
          placeholder={t('sqlPlaceholder')}
          rows={4}></textarea>
      </div>

      <div class="flex gap-2">
        <button onclick={convert} class="btn-primary">{tg('convert')}</button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium">{t('mongoQuery')}</label>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-emerald-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <pre class="tool-textarea font-mono text-sm whitespace-pre">{output}</pre>
        </div>
{/if}

      <div>
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('examples')}</h3>
        <div class="space-y-2">
          {#each examples as ex, i (i)}
<button 
              onclick={() => input = ex.sql}
              class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="text-sm text-gray-600 dark:text-gray-300">{t(ex.descKey)}</div>
              <code class="text-amber-600 dark:text-amber-400 text-sm">{ex.sql}</code>
            </button>
{/each}
        </div>
      </div>
    </div>
  
