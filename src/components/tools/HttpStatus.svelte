<script lang="ts">
  import { HTTP_CODES } from '@/lib/tool-stubs';

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

  let search = $state('');

  // Functions
  const filtered = Object.entries(HTTP_CODES).filter(([code, info]) =>
    code.includes(search) || info.name.toLowerCase().includes(search.toLowerCase())
  );
  function getColor(code: string) {
    if (code.startsWith('2')) return 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700';
    if (code.startsWith('3')) return 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700';
    if (code.startsWith('4')) return 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700';
    if (code.startsWith('5')) return 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700';
    return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
  }

</script>


    <div class="space-y-4">
      <input type="text" id="http-status-search" name="search" bind:value={search} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('httpStatus.search')} />
      <div class="grid md:grid-cols-2 gap-3 max-h-[500px] overflow-auto">
        {#each filtered as [code, info] (code)}
<div  class={`p-4 rounded-lg border ${getColor(code)}`}>
            <div class="flex items-center gap-3">
              <span class="text-2xl font-bold text-gray-900 dark:text-white">{code}</span>
              <span class="font-medium text-gray-900 dark:text-white">{info.name}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{info.desc}</p>
          </div>
{/each}
      </div>
    </div>
  
