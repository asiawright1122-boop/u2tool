<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['url-parser'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.url-parser.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let url = $state('https://example.com:8080/path/to/page?name=John&age=30#section');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function parseUrl() {
    try {
      const parsed = new URL(url);
      return {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        origin: parsed.origin,
        host: parsed.host,
        params: Object.fromEntries(parsed.searchParams)
      };
    } catch {
      return null;
    }
  }
  const parsed = parseUrl();
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    copied = text;
    setTimeout(() => copied = '', 1500);
  }

</script>

{#snippet Row(label, value)}
<div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
      <span class="text-gray-600 dark:text-gray-300">{label}</span>
      <div class="flex items-center gap-2">
        <code class="text-blue-600 dark:text-blue-400">{value}</code>
        <button onclick={() => copy(value)} class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-white">{copied === value ? '✓' : tg('copy')}</button>
      </div>
    </div>
{/snippet}


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('urlLabel')}</label>
        <input type="text" bind:value={url} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" />
      </div>
      {#if parsed}
<div class="space-y-2">
          {@render Row(t('protocol'), parsed.protocol)}
          {@render Row(t('hostname'), parsed.hostname)}
          {@render Row(t('port'), parsed.port || t('defaultPort'))}
          {@render Row(t('pathname'), parsed.pathname)}
          {@render Row(t('search'), parsed.search || t('none'))}
          {@render Row(t('hash'), parsed.hash || t('none'))}
          {@render Row(t('origin'), parsed.origin)}
          {#if Object.keys(parsed.params).length > 0}
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('queryParams')}</h3>
              <div class="space-y-2">
                {#each Object.entries(parsed.params) as [k, v] (k)}
<div  class="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <span class="text-yellow-600 dark:text-yellow-400">{k}</span>
                    <span class="text-green-600 dark:text-green-400">{v}</span>
                  </div>
{/each}
              </div>
            </div>
{/if}
        </div>
{:else}
<p class="text-red-600 dark:text-red-400">{t('invalid')}</p>
{/if}
    </div>
  
