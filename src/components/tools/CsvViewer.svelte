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

  let isInitialized = $state(false);

  let input = $state('');

  let delimiter = $state(',');

  let hasHeader = $state(true);

  $effect(() => {
    if (!isInitialized) {
      input = t('csvViewer.defaultInput');
      isInitialized = true;
    }
  });

  // Functions
  function parseCSV(text: string, delim: string) {
    const lines = text.trim().split('\n');
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delim && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  }
  const data = parseCSV(input, delimiter);
  const headers = hasHeader && data.length > 0 ? data[0] : [];
  const rows = hasHeader ? data.slice(1) : data;
  const columnsCount = headers.length || (rows[0]?.length || 0);
  function downloadCSV() {
    const blob = new Blob([input], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('csvJson.delimiter')}</label>
          <select
            bind:value={delimiter}
            class="tool-select"
          >
            <option value=",">{t('csvViewer.delimiterComma')}</option>
            <option value=";">{t('csvViewer.delimiterSemicolon')}</option>
            <option value="\t">{t('csvViewer.delimiterTab')}</option>
            <option value="|">{t('csvViewer.delimiterPipe')}</option>
          </select>
        </div>
        <label class="flex items-center gap-2 cursor-pointer mt-6">
          <input
            type="checkbox"
            bind:checked={hasHeader}
            class="tool-checkbox"
          />
          <span class="text-gray-700 dark:text-gray-300">{t('csvJson.hasHeader')}</span>
        </label>
        <button
          onclick={downloadCSV}
          class="btn-secondary px-4 py-2 rounded-lg mt-6"
        >
          {t('csvViewer.downloadCsv')}
        </button>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('csvViewer.csvInput')}</label>
        <textarea
          bind:value={input}
          class="tool-textarea"
          placeholder={t('csvViewer.csvPlaceholder')}></textarea>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('csvViewer.tablePreview')}</label>
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {t('csvViewer.stats', { rows: rows.length, columns: columnsCount })}
          </span>
        </div>
        
        <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table class="w-full">
            {#if hasHeader}

              <thead class="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th class="py-2 px-4 text-left text-xs text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">#</th>
                  {#each headers as header, i (i)}
<th  class="py-2 px-4 text-left font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      {header}
                    </th>
{/each}
                </tr>
              </thead>
{/if}
            <tbody>
              {#each rows as row, rowIndex (rowIndex)}
<tr  class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="py-2 px-4 text-xs text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    {rowIndex + 1}
                  </td>
                  {#each row as cell, cellIndex (cellIndex)}
<td  class="py-2 px-4 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      {#if cell}
{cell}
{:else}
<span class="text-gray-400 dark:text-gray-500">—</span>
{/if}
                    </td>
{/each}
                </tr>
{/each}
            </tbody>
          </table>
          
          {#if rows.length === 0}
<div class="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('csvViewer.noData')}
            </div>
{/if}
        </div>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('csvViewer.tip')}</p>
      </div>
    </div>
  
