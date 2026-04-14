<script lang="ts">
  import { statusCodes } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['http-status-codes'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.http-status-codes.${key}`;
  }

  let search = $state('');

  let filter = $state('all');

  // Functions
  const filtered = statusCodes.filter(item => {
    const matchesSearch = 
      item.code.toString().includes(search) || 
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === '1xx' && item.code >= 100 && item.code < 200) ||
      (filter === '2xx' && item.code >= 200 && item.code < 300) ||
      (filter === '3xx' && item.code >= 300 && item.code < 400) ||
      (filter === '4xx' && item.code >= 400 && item.code < 500) ||
      (filter === '5xx' && item.code >= 500 && item.code < 600);

    return matchesSearch && matchesFilter;
  });
  function getBadgeColor(code: number) {
    if (code >= 100 && code < 200) return 'bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-400/30 dark:border-gray-500/30';
    if (code >= 200 && code < 300) return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
    if (code >= 300 && code < 400) return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30';
    if (code >= 400 && code < 500) return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    if (code >= 500 && code < 600) return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30';
    return 'bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
  }

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          bind:value={search}
          placeholder={t('searchPlaceholder')}
          class="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
        />
        <select
          bind:value={filter}
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">{t('allCategories')}</option>
          <option value="1xx">{t('informational')}</option>
          <option value="2xx">{t('success')}</option>
          <option value="3xx">{t('redirection')}</option>
          <option value="4xx">{t('clientError')}</option>
          <option value="5xx">{t('serverError')}</option>
        </select>
      </div>

      <div class="grid grid-cols-1 gap-4">
        {#each filtered as item (item.code)}
<div  class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col md:flex-row gap-4 md:items-start hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
            <div class={`flex-shrink-0 w-24 h-16 flex items-center justify-center rounded-lg border text-xl font-bold font-mono ${getBadgeColor(item.code)}`}>
              {item.code}
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.status}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
            </div>
          </div>
{/each}
        {#if filtered.length === 0}
<div class="text-center py-12 text-gray-500 dark:text-gray-300">
            {t('noResults')}
          </div>
{/if}
      </div>
    </div>
  
