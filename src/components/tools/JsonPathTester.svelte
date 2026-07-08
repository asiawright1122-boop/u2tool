<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-path-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-path-tester.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let json = $state('');

  let path = $state('');

  let result = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function evaluatePath() {
    if (!json.trim()) {
      error = tg('errorInvalidInput');
      result = '';
      return;
    }
    if (!path.trim()) {
      error = tg('errorInvalidInput');
      result = '';
      return;
    }
    try {
      const data = JSON.parse(json);
      const pathParts = path
        .replace(/^\$\.?/, '') // Remove leading $. or $
        .split(/\.|\[|\]/)
        .filter(Boolean);

      let current: unknown = data;

      for (const part of pathParts) {
        if (current === null || current === undefined) {
          throw new Error(`Cannot access property "${part}" of ${current}`);
        }

        if (typeof current === 'object') {
          // Handle array index or object property
          const index = parseInt(part);
          if (!isNaN(index) && Array.isArray(current)) {
            current = current[index];
          } else {
            current = (current as Record<string, unknown>)[part];
          }
        } else {
          throw new Error(`Cannot access property "${part}" of non-object`);
        }
      }

      result = JSON.stringify(current, null, 2);
      error = '';
    } catch (_e) {
      error = (_e as Error).message;
      result = '';
    }
  }
  async function copyResult() {
    await navigator.clipboard.writeText(result);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const examples = [
    { path: '$.name', descKey: 'exGetName' },
    { path: '$.users[0]', descKey: 'exFirstUser' },
    { path: '$.users[0].name', descKey: 'exFirstUserName' },
    { path: '$.data.items', descKey: 'exNestedItems' },
  ];

</script>


    <div class="space-y-4">
      <div>
        <label for="json-path-json" class="block text-sm font-medium mb-2">{t('jsonData')}</label>
        <textarea
          id="json-path-json"
          name="jsonData"
          class="tool-textarea"
          bind:value={json}
          placeholder={t('jsonPlaceholder')}
          rows={8}></textarea>
      </div>

      <div>
        <label for="json-path-expression" class="block text-sm font-medium mb-2">{t('expression')}</label>
        <input
          id="json-path-expression"
          name="pathExpression"
          bind:value={path}
          class="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
          placeholder={t('expressionPlaceholder')}
        />
        <div class="flex flex-wrap gap-2 mt-2">
          {#each examples as ex (ex.path)}
<button 
              onclick={() => path = ex.path}
              class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded"
              title={t(ex.descKey)}
            >
              {ex.path}
            </button>
{/each}
        </div>
      </div>

      <button onclick={evaluatePath} class="btn-primary">
        {t('evaluate')}
      </button>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
{/if}

      {#if result}
<div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-600 dark:text-white">{t('result')}</div>
            <button
              onclick={copyResult}
              class={`text-sm px-3 py-1 rounded ${copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-white">
            {result}
          </pre>
        </div>
{/if}
    </div>
  
