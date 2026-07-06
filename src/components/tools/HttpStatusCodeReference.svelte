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
  category: StatusCategory;
  solutions?: string[];
}

  type StatusCategory = '1xx' | '2xx' | '3xx' | '4xx' | '5xx';

  const CATEGORY_COLORS: Record<StatusCategory, string> = {
    '1xx': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    '2xx': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    '3xx': 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
    '4xx': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    '5xx': 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  };

  const CATEGORY_NAMES: Record<StatusCategory, string> = {
    '1xx': 'Informational',
    '2xx': 'Success',
    '3xx': 'Redirection',
    '4xx': 'Client Error',
    '5xx': 'Server Error',
  };

  const STATUS_DETAILS: Record<number, { description: string; solutions?: string[] }> = {
    200: { description: 'The request succeeded and the response contains the requested resource.' },
    201: { description: 'The request succeeded and a new resource was created.' },
    301: { description: 'The resource has permanently moved to a new URL.' },
    400: { description: 'The server could not process the request because the client sent invalid input.' },
    401: { description: 'Authentication is required or the provided credentials are invalid.' },
    403: { description: 'The server understood the request but refuses to authorize it.' },
    404: { description: 'The requested resource could not be found at this URL.' },
    500: { description: 'The server encountered an unexpected error while processing the request.' },
  };

  function getCategory(code: number): StatusCategory {
    const prefix = Math.floor(code / 100);
    return `${prefix}xx` as StatusCategory;
  }

  function normalizeStatusCodes(value: unknown): StatusCode[] {
    if (Array.isArray(value)) {
      return value
        .filter((item): item is StatusCode => typeof item?.code === 'number' && typeof item?.name === 'string')
        .map((item) => ({
          ...item,
          category: item.category || getCategory(item.code),
          description: item.description || STATUS_DETAILS[item.code]?.description || item.name,
          solutions: item.solutions || STATUS_DETAILS[item.code]?.solutions,
        }));
    }

    if (value && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([code, name]) => {
          const numericCode = Number(code);
          if (!Number.isFinite(numericCode) || typeof name !== 'string') {
            return null;
          }
          return {
            code: numericCode,
            name,
            category: getCategory(numericCode),
            description: STATUS_DETAILS[numericCode]?.description || name,
            solutions: STATUS_DETAILS[numericCode]?.solutions,
          };
        })
        .filter((item): item is StatusCode => item !== null)
        .sort((a, b) => a.code - b.code);
    }

    return [];
  }

  const statusCodes = normalizeStatusCodes(HTTP_STATUS_CODES);

  let search = $state('');

  let selectedCategory = $state<StatusCategory | null>(null);

  let selectedCode = $state<StatusCode | null>(null);

  function closeDetailModal() {
    selectedCode = null;
  }

  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeDetailModal();
    }
  }

  let filteredCodes = $derived.by(() => {
    return statusCodes.filter(status => {
      const matchesSearch = search === '' || 
        status.code.toString().includes(search) ||
        status.name.toLowerCase().includes(search.toLowerCase()) ||
        status.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !selectedCategory || status.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  });

  // Functions
  const categories: StatusCategory[] = ['1xx', '2xx', '3xx', '4xx', '5xx'];

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
<button
            type="button"
            onclick={() => selectedCode = status}
            class="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 cursor-pointer transition-colors bg-white dark:bg-gray-800"
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
          </button>
{/each}
      </div>

      {#if filteredCodes.length === 0}
<div class="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('httpStatus.noResults')}
        </div>
{/if}

      <!-- Detail Modal -->
      {#if selectedCode}
<div 
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="button"
          tabindex="0"
          aria-label="Close status code details"
          onclick={(event) => event.currentTarget === event.target && closeDetailModal()}
          onkeydown={handleBackdropKeydown}
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl"
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
  
