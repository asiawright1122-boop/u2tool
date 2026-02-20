<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tool']['csvToExcel'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tool.csvToExcel.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let data = $state([]);

  let loading = $state(false);

  let error = $state('');

  let fileName = $state('');

  async function loadCsv(file: File) {
    loading = true;
    error = '';
    data = [];
    fileName = file.name;

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      }).filter(row => row.some(cell => cell));
      data = rows;
    } catch {
      error = t('errorParsing');
    } finally {
      loading = false;
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) {
      loadCsv(file);
    } else {
      error = t('errorInvalidFile');
    }
  }

  // Functions
  function handleFileChange(e: Event) {
    const file = e.target.files?.[0];
    if (file) loadCsv(file);
  }
  async function downloadExcel() {
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, fileName.replace('.csv', '.xlsx'));
    } catch (error) {
      console.error('Failed to export Excel:', error);
      error = t('errorExport');
    }
  }

</script>


    <div class="space-y-6">
      <div
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          accept=".csv"
          onchange={handleFileChange}
          class="hidden"
          id="csv-excel-input"
        />
        <label for="csv-excel-input" class="cursor-pointer">
          <div class="text-4xl mb-4">📋</div>
          <p class="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p class="text-sm text-gray-500 mt-2">CSV → XLSX</p>
        </label>
      </div>

      {#if loading}
<div class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('converting')}</p>
        </div>
{/if}

      {#if error}
<div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
{/if}

      {#if data.length > 0}
<div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {fileName} - {data.length} {t('rows')}
            </div>
            <button
              onclick={downloadExcel}
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {tc('download')} XLSX
            </button>
          </div>
          <div class="overflow-auto max-h-96 border rounded-lg dark:border-gray-700">
            <table class="w-full text-sm">
              <tbody>
                {#each data.slice(0, 100) as row, i (i)}
<tr  class={i === 0 ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'border-t dark:border-gray-700'}>
                    {#each row as cell, j (j)}
<td  class="px-3 py-2 whitespace-nowrap">{cell}</td>
{/each}
                  </tr>
{/each}
              </tbody>
            </table>
            {#if data.length > 100}
<div class="text-center py-2 text-gray-500 text-sm">
                {t('showingFirst')} 100 / {data.length} {t('rows')}
              </div>
{/if}
          </div>
        </div>
{/if}
    </div>
  
