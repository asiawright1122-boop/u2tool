<script lang="ts">
  import { HTTP_STATUS_CODES } from '@/lib/tool-stubs';

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
  interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
  solutions?: string[];
}

  let search = $state('');

  let selectedCategory = $state(null);

  let selectedCode = $state(null);

  let filteredCodes = $derived.by(() => {
    return HTTP_STATUS_CODES.filter(status => {
      const matchesSearch = search === '' || 
        status.code.toString().includes(search) ||
        status.name.toLowerCase().includes(search.toLowerCase()) ||
        status.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !selectedCategory || status.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  });

  // Functions
  const categories = ['1xx', '2xx', '3xx', '4xx', '5xx'];

</script>


    <div class="space-y-6">
      <!-- Search and Filter -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            bind:value={search}
            placeholder={t('httpStatus.search')}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            onclick={() => selectedCategory = null}
            class={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-800' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('all')}
          </button>
          {#each categories as cat (cat)}
<button 
              onclick={() => selectedCategory = cat === selectedCategory ? null : cat}
              class={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat 
                  ? CATEGORY_COLORS[cat]
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
{/each}
        </div>
      </div>

      <!-- Status Code Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filteredCodes as status (status.code)}
<div 
            onclick={() => selectedCode = status}
            class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 cursor-pointer transition-colors bg-white dark:bg-gray-800"
          >
            <div class="flex items-center gap-3 mb-2">
              <span class={`px-2 py-1 rounded text-sm font-bold ${CATEGORY_COLORS[status.category]}`}>
                {status.code}
              </span>
              <span class="font-medium text-gray-900 dark:text-white truncate">
                {status.name}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {status.description}
            </p>
          </div>
{/each}
      </div>

      {#if filteredCodes.length === 0}
<div class="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('nav.noResults')}
        </div>
{/if}

      <!-- Detail Modal -->
      {#if selectedCode}
<div 
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onclick={() => selectedCode = null}
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl"
            onclick={e => e.stopPropagation()}
          >
            <div class="flex items-center gap-4 mb-4">
              <span class={`px-3 py-2 rounded-lg text-xl font-bold ${CATEGORY_COLORS[selectedCode.category]}`}>
                {selectedCode.code}
              </span>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedCode.name}
                </h3>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {CATEGORY_NAMES[selectedCode.category]}
                </span>
              </div>
            </div>
            
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              {selectedCode.description}
            </p>

            {#if selectedCode.solutions}
{#if selectedCode.solutions.length > 0}
              <div class="mt-4">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  Solutions:
                </h4>
                <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {#each selectedCode.solutions as solution, idx (idx)}
<li >{solution}</li>
{/each}
                </ul>
              </div>
            {/if}
{/if}

            <button
              onclick={() => selectedCode = null}
              class="mt-6 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('clear')}
            </button>
          </div>
        </div>
{/if}
    </div>
  
