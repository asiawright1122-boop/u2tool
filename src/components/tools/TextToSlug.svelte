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

  let slug = $state('');

  let separator = $state('-');

  let lowercase = $state(true);

  let copied = $state(false);

  let timerRef = $state(null);

  $effect(() => {
    let result = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .trim()
      .replace(/\s+/g, separator); // Replace spaces

    if (lowercase) {
      result = result.toLowerCase();
    }

    slug = result;
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copySlug() {
    await navigator.clipboard.writeText(slug);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          rows={3}></textarea>
      </div>

      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">Separator</label>
          <select
            bind:value={separator}
            class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value="">None</option>
          </select>
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              bind:checked={lowercase}
              class="w-4 h-4 rounded"
            />
            <span class="text-sm">Lowercase</span>
          </label>
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Slug</label>
          <button
            onclick={copySlug}
            class={`text-sm px-3 py-1 rounded ${copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono break-all text-gray-900 dark:text-gray-100">
          {#if slug}
{slug}
{:else}
<span class="text-gray-500 dark:text-gray-300">slug-will-appear-here</span>
{/if}
        </div>
      </div>
    </div>
  
