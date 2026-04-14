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

  // Types
  type SortDirection = 'asc' | 'desc' | null;
  interface SheetData {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

  let sheets = $state([]);

  let selectedSheet = $state('');

  let fileName = $state('');

  let error = $state('');

  let sortColumn = $state('');

  let sortDirection = $state(null);

  let filterColumn = $state('');

  let filterValue = $state('');

  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (!isValidType) {
      error = t('excelViewer.invalidFileType');
      return;
    }

    error = '';
    fileName = file.name;
    sortColumn = '';
    sortDirection = null;
    filterColumn = '';
    filterValue = '';

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const XLSX = await import('xlsx');
        let data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const parsedSheets: SheetData[] = workbook.SheetNames.map(name => {
          const worksheet = workbook.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
          const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
          return { name, data: jsonData, headers };
        });

        sheets = parsedSheets;
        if (parsedSheets.length > 0) {
          selectedSheet = parsedSheets[0].name;
        }
      } catch {
        error = t('excelViewer.parseError');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  let processedData = $derived.by(() => {
    if (!currentSheet) return [];

    let data = [...currentSheet.data];

    // Filter
    if (filterColumn && filterValue) {
      data = data.filter(row => {
        const cellValue = String(row[filterColumn] ?? '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    }

    // Sort
    if (sortColumn && sortDirection) {
      data.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return data;
  });

  // Functions
  const currentSheet = sheets.find(s => s.name === selectedSheet);
  function handleSort(column: string) {
    if (sortColumn === column) {
      if (sortDirection === 'asc') sortDirection = 'desc';
      else if (sortDirection === 'desc') { sortColumn = ''; sortDirection = null; }
      else sortDirection = 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }

</script>


    <div class="space-y-6">
      <!-- File Upload -->
      <div class="tool-dropzone">
        <input type="file" accept=".xlsx,.xls" onchange={handleFileUpload} class="hidden" id="excel-viewer-upload" />
        <label for="excel-viewer-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('excelViewer.uploadFile')}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('excelViewer.supportedFormats')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if fileName}
<div class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
          {t('excelViewer.fileLoaded')}: {fileName}
        </div>
{/if}

      <!-- Sheet Tabs -->
      {#if sheets.length > 1}
<div class="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {#each sheets as sheet (sheet.name)}
<button 
              onclick={() => { selectedSheet = sheet.name; filterColumn = ''; filterValue = ''; }}
              class={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${selectedSheet === sheet.name
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {sheet.name}
            </button>
{/each}
        </div>
{/if}

      <!-- Filter -->
      {#if currentSheet}
{#if currentSheet.headers.length > 0}
        <div class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('excelViewer.filterColumn')}
            </label>
            <select
              bind:value={filterColumn}
              class="tool-select"
            >
              <option value="">{t('excelViewer.selectColumn')}</option>
              {#each currentSheet.headers as h (h)}
<option  value={h}>{h}</option>
{/each}
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('excelViewer.filterValue')}
            </label>
            <input
              type="text"
              bind:value={filterValue}
              placeholder={t('excelViewer.enterValue')}
              class="tool-input"
              disabled={!filterColumn}
            />
          </div>
          {#if filterColumn || filterValue}
<button
              onclick={() => { filterColumn = ''; filterValue = ''; }}
              class="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              {t('excelViewer.clearFilter')}
            </button>
{/if}
        </div>
      {/if}
{/if}

      <!-- Data Table -->
      {#if currentSheet}
{#if processedData.length > 0}
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t('excelViewer.showing')} {processedData.length} / {currentSheet.data.length} {t('excelViewer.rows')}
          </p>
          <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-96">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {#each currentSheet.headers as header (header)}
<th 
                      onclick={() => handleSort(header)}
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div class="flex items-center gap-1">
                        {header}
                        {#if sortColumn === header}
<span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
{/if}
                      </div>
                    </th>
{/each}
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {#each processedData as row, idx (idx)}
<tr  class="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {#each currentSheet.headers as header (header)}
<td  class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {String(row[header] ?? '')}
                      </td>
{/each}
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
{/if}

      {#if currentSheet}
{#if processedData.length === 0}
        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
          {filterValue ? t('excelViewer.noResults') : t('excelViewer.emptySheet')}
        </div>
      {/if}
{/if}
    </div>
  
