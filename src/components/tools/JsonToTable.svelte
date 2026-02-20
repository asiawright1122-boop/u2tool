<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-table'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-table.${key}`;
  }

  let input = $state('');

  let tableData = $state(null);

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        result[newKey] = JSON.stringify(value);
      } else {
        result[newKey] = String(value ?? '');
      }
    }
    
    return result;
  }
  function convert() {
    error = '';
    tableData = null;

    if (!input.trim()) {
      error = t('errors.empty');
      return;
    }

    try {
      const json = JSON.parse(input);
      let data: Record<string, unknown>[];

      if (Array.isArray(json)) {
        data = json;
      } else if (typeof json === 'object' && json !== null) {
        data = [json];
      } else {
        error = t('errors.notObjectOrArray');
        return;
      }

      if (data.length === 0) {
        error = t('errors.emptyArray');
        return;
      }

      const flattenedData = data.map(item => flattenObject(item as Record<string, unknown>));
      const allKeys = new Set<string>();
      flattenedData.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
      
      const headers = Array.from(allKeys);
      const rows = flattenedData.map(item => headers.map(header => item[header] || ''));

      tableData = { headers, rows };
    } catch {
      error = t('errors.invalidJson');
    }
  }
  function copyAsHtml() {
    if (!tableData) return;

    const html = `<table border="1">
  <thead>
    <tr>
      ${tableData.headers.map(h => `<th>${h}</th>`).join('\n      ')}
    </tr>
  </thead>
  <tbody>
    ${tableData.rows.map(row => `<tr>
      ${row.map(cell => `<td>${cell}</td>`).join('\n      ')}
    </tr>`).join('\n    ')}
  </tbody>
</table>`;

    navigator.clipboard.writeText(html);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function copyAsCsv() {
    if (!tableData) return;

    const csv = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    navigator.clipboard.writeText(csv);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function downloadCsv() {
    if (!tableData) return;

    const csv = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('jsonInput')}
        </label>
        <textarea
          bind:value={input}
          placeholder={t('placeholder')}
          class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      <button
        onclick={convert}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('convert')}
      </button>

      {#if tableData}
<div class="space-y-4">
          <div class="flex gap-4 flex-wrap">
            <button
              onclick={copyAsHtml}
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              {copied ? t('copied') : t('copyHtml')}
            </button>
            <button
              onclick={copyAsCsv}
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              {t('copyCsv')}
            </button>
            <button
              onclick={downloadCsv}
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              {t('downloadCsv')}
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-300 dark:border-gray-600">
              <thead class="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {#each tableData.headers as header, i (i)}
<th 
                      class="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600"
                    >
                      {header}
                    </th>
{/each}
                </tr>
              </thead>
              <tbody>
                {#each tableData.rows as row, i (i)}
<tr  class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {#each row as cell, j (j)}
<td 
                        class="px-4 py-2 text-sm text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600"
                      >
                        {cell}
                      </td>
{/each}
                  </tr>
{/each}
              </tbody>
            </table>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t('rowCount', { count: tableData.rows.length })}
          </p>
        </div>
{/if}
    </div>
  
