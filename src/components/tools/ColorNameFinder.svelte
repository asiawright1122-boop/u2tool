<script lang="ts">
  import { findClosestColor } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['color-name-finder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.color-name-finder.${key}`;
  }

  let color = $state('#4682B4');

  let results = $state<Array<{ name: string; hex: string; distance: number }>>([]);

  // Functions
  function handleFind() {
    const matches = findClosestColor(color);
    results = matches;
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label for="color-hex" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('inputLabel')}</label>
          <div class="flex gap-2">
            <input type="color" id="color-picker" name="color" bind:value={color}
              class="w-12 h-10 rounded cursor-pointer" />
            <input type="text" id="color-hex" name="hexColor" bind:value={color}
              class="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono focus:outline-none focus:border-amber-500" />
          </div>
        </div>
        <button onclick={handleFind} class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          {t('find')}
        </button>
      </div>

      {#if results.length > 0}
<div class="space-y-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('closestColors')}</label>
          {#each results as r, i (i)}
<div  class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div class="w-10 h-10 rounded" style="background-color: {r.hex}"></div>
              <div class="flex-1">
                <div class="text-gray-900 dark:text-white font-medium">{r.name}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{r.hex}</div>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('distance')}: {r.distance.toFixed(1)}</div>
            </div>
{/each}
        </div>
{/if}
    </div>
  
