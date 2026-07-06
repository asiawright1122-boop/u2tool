<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale: _locale, translations }: Props = $props();

  // Translation helpers
  function getNestedValue(scope: Record<string, unknown>, key: string): string | undefined {
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : undefined;
  }

  function t(key: string): string {
    const toolsScope = translations['tools'] as Record<string, unknown> | undefined;
    const kebabScope = toolsScope?.['excel-to-csv'] as Record<string, unknown> | undefined;
    const camelScope = toolsScope?.['excelToCsv'] as Record<string, unknown> | undefined;

    const value =
      (kebabScope && getNestedValue(kebabScope, key)) ||
      (camelScope && getNestedValue(camelScope, key));

    return value ?? `MISSING: tools.excel-to-csv.${key}`;
  }

  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    return getNestedValue(scope, key) ?? `MISSING: tools.${key}`;
  }

  let csv = $state('');

  let loading = $state(false);

  let error = $state('');

  let fileName = $state('');

  let sheets = $state<string[]>([]);

  let selectedSheet = $state('');

  let workbook = $state<any>(null);

  async function loadExcel(file: File) {
    loading = true;
    error = '';
    csv = '';
    fileName = file.name;

    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      workbook = wb;
      sheets = wb.SheetNames;
      selectedSheet = wb.SheetNames[0];
      const csvData = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      csv = csvData;
    } catch {
      error = t('errorParsing');
    } finally {
      loading = false;
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file?.name.match(/\.(xlsx|xls)$/i)) {
      loadExcel(file);
    } else {
      error = t('errorInvalidFile');
    }
  }

  // Functions
  async function handleSheetChange(sheetName: string) {
    if (workbook) {
      const XLSX = await import('xlsx');
      selectedSheet = sheetName;
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      csv = csvData;
    }
  }
  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement | null;
    const file = target?.files?.[0];
    if (file) loadExcel(file);
  }
  function copyToClipboard() { return navigator.clipboard.writeText(csv); }
  function downloadCsv() {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.(xlsx|xls)$/i, `_${selectedSheet}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onchange={handleFileChange}
          class="hidden"
          id="excel-csv-input"
        />
        <label for="excel-csv-input" class="cursor-pointer">
          <div class="text-4xl mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg></div>
          <p class="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p class="text-sm text-gray-500 mt-2">XLSX, XLS → CSV</p>
        </label>
      </div>

      {#if loading}
<div class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('converting')}</p>
        </div>
{/if}

      {#if error}
<div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
{/if}

      {#if csv}
<div class="space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">{fileName}</span>
              {#if sheets.length > 1}
<select
                  value={selectedSheet}
                  onchange={(e) => handleSheetChange(e.target.value)}
                  class="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {#each sheets as sheet (sheet)}
<option  value={sheet}>{sheet}</option>
{/each}
                </select>
{/if}
            </div>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tc('copy')}
              </button>
              <button
                onclick={downloadCsv}
                class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                {tc('download')} CSV
              </button>
            </div>
          </div>
          <textarea
            value={csv}
            readOnly
            class="w-full h-96 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"></textarea>
        </div>
{/if}
    </div>
  
