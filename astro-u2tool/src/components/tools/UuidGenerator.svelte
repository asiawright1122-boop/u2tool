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

  // Imports
  import { v4 as uuidv4 } from 'uuid';

  let uuids = $state([uuidv4()] as string[]);

  let count = $state(1);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateUuids() {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    uuids = newUuids;
  }
  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join('\n'));
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  async function copySingle(uuid: string) {
    await navigator.clipboard.writeText(uuid);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('count')}:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onchange={(e) => count = Math.min(100, Math.max(1, parseInt(e.target.value) || 1))}
          class="w-20 px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
        />
        <button onclick={generateUuids} class="btn-primary">
          {t('generate')}
        </button>
        <button onclick={copyAll} class={`btn-secondary ${copied ? 'bg-green-600' : ''}`}>
          {copied ? t('copied') : t('copy')} {t('all')}
        </button>
      </div>

      <div class="space-y-2">
        {#each uuids as uuid, index (index)}
<div 
            class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100"
          >
            <span class="select-all">{uuid}</span>
            <button
              onclick={() => copySingle(uuid)}
              class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-gray-900 dark:text-gray-100"
            >
              {t('copy')}
            </button>
          </div>
{/each}
      </div>
    </div>
  
