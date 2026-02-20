<script lang="ts">
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
  const filtered = commonMimeTypes.filter(item => 
    item.ext.toLowerCase().includes(search.toLowerCase()) || 
    item.mime.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

</script>


    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <input
          type="text"
          bind:value={search}
          placeholder={t('searchPlaceholder') || 'Search MIME types...'}
          class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-6 py-4 text-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 w-32">Extension</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 w-64">MIME Type</th>
                <th class="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              {#each filtered as item, index (index)}
<tr  class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td class="px-6 py-4 font-mono text-blue-600 dark:text-blue-400">{item.ext}</td>
                  <td class="px-6 py-4 font-mono text-green-600 dark:text-green-400 break-all">{item.mime}</td>
                  <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{item.desc}</td>
                </tr>
{/each}
              {#if filtered.length === 0}
<tr>
                  <td colspan={3} class="px-6 py-8 text-center text-gray-600 dark:text-gray-300">
                    No matching MIME types found.
                  </td>
                </tr>
{/if}
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-4 text-right text-gray-600 dark:text-gray-300 text-sm">
        Showing {filtered.length} results
      </div>
    </div>
  
