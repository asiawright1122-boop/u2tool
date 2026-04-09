<script lang="ts">
  import { parseUrl } from '@/lib/tool-stubs';

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

  // Types
  interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Array<{ key: string; value: string; decoded: string }>;
}

  let url = $state('');

  let copied = $state(null);

  let parsed = $derived.by(() => {
    if (!url.trim()) return null;
    return parseUrl(url);
  });

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copied = key;
    setTimeout(() => copied = null, 2000);
  }

  function handleClear() {
    url = '';
  }

  function buildQueryString() {
    if (!parsed?.params.length) return '';
    return parsed.params.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.decoded)}`).join('&');
  }

  // Functions
  const exampleUrl = 'https://example.com/search?q=hello%20world&page=1&sort=date&filter[category]=tech&utm_source=google&utm_medium=cpc';

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL / Query String
          </label>
          <button
            onclick={() => url = exampleUrl}
            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('sql.loadExample')}
          </button>
        </div>
        <textarea
          bind:value={url}
          placeholder="https://example.com/path?param1=value1&param2=value2 or ?param1=value1&param2=value2"
          class="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <div class="flex gap-3">
        <button
          onclick={handleClear}
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      <!-- Error -->
      {#if url.trim()}
{#if !parsed}
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {t('urlParser.invalid')}
        </div>
      {/if}
{/if}

      <!-- Parsed Result -->
      {#if parsed}
<div class="space-y-6">
          <!-- URL Components -->
          {#if parsed.hostname}
<div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
                URL Components
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if parsed.protocol}
<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.protocol')}</span>
                    <p class="font-mono text-gray-900 dark:text-white">{parsed.protocol}</p>
                  </div>
{/if}
                {#if parsed.hostname}
<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.hostname')}</span>
                    <p class="font-mono text-gray-900 dark:text-white">{parsed.hostname}</p>
                  </div>
{/if}
                {#if parsed.port}
<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.port')}</span>
                    <p class="font-mono text-gray-900 dark:text-white">{parsed.port}</p>
                  </div>
{/if}
                {#if parsed.pathname}
{#if parsed.pathname !== '/'}
                  <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.pathname')}</span>
                    <p class="font-mono text-gray-900 dark:text-white">{parsed.pathname}</p>
                  </div>
                {/if}
{/if}
                {#if parsed.hash}
<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.hash')}</span>
                    <p class="font-mono text-gray-900 dark:text-white">{parsed.hash}</p>
                  </div>
{/if}
              </div>
            </div>
{/if}

          <!-- Query Parameters -->
          {#if parsed.params.length > 0}
<div>
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  {t('urlParser.queryParams')} ({parsed.params.length})
                </h3>
                <button
                  onclick={() => handleCopy(buildQueryString(), 'query')}
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'query' ? t('copied') : t('copy')} Query String
                </button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-700">
                      <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">#</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Key</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value (Raw)</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value (Decoded)</th>
                      <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    {#each parsed.params as param, idx (idx)}
<tr  class="bg-white dark:bg-gray-800">
                        <td class="px-4 py-2 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                        <td class="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">{param.key}</td>
                        <td class="px-4 py-2 font-mono text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {param.value}
                        </td>
                        <td class="px-4 py-2 font-mono text-gray-900 dark:text-white max-w-xs truncate">
                          {param.decoded}
                        </td>
                        <td class="px-4 py-2">
                          <button
                            onclick={() => handleCopy(param.decoded, `param-${idx}`)}
                            class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            {copied === `param-${idx}` ? '✓' : t('copy')}
                          </button>
                        </td>
                      </tr>
{/each}
                  </tbody>
                </table>
              </div>
            </div>
{/if}

          <!-- JSON Output -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                JSON {t('output')}
              </h3>
              <button
                onclick={() => handleCopy(JSON.stringify(Object.fromEntries(parsed.params.map(p => [p.key, p.decoded])), null, 2), 'json')}
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === 'json' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {JSON.stringify(Object.fromEntries(parsed.params.map(p => [p.key, p.decoded])), null, 2)}
            </pre>
          </div>
        </div>
{/if}
    </div>
  
