<script lang="ts">
  import { onDestroy } from 'svelte';

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
  interface SheetData {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

  let sheets = $state([]);

  let selectedSheet = $state('');

  let jsonOutput = $state('');

  let fileName = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);

  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const isValidType = validTypes.some(type => 
      file.type === type || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );

    if (!isValidType) {
      error = t('excelToJson.invalidFileType');
      return;
    }

    error = '';
    fileName = file.name;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const XLSX = await import('xlsx');
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
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
          jsonOutput = JSON.stringify(parsedSheets[0].data, null, 2);
        }
      } catch {
        error = t('excelToJson.parseError');
      }
    };
    reader.readAsArrayBuffer(file);
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handleSheetChange(sheetName: string) {
    selectedSheet = sheetName;
    const sheet = sheets.find(s => s.name === sheetName);
    if (sheet) {
      jsonOutput = JSON.stringify(sheet.data, null, 2);
    }
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    } catch {
      error = t('excelToJson.copyError');
    }
  }
  function handleDownload() {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.(xlsx|xls)$/i, '')}_${selectedSheet}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  const currentSheet = sheets.find(s => s.name === selectedSheet);

</script>


    <div class="space-y-6">
      <!-- File Upload -->
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onchange={handleFileUpload}
          class="hidden"
          id="excel-upload"
        />
        <label
          for="excel-upload"
          class="cursor-pointer flex flex-col items-center"
        >
          <span class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg></span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">
            {t('excelToJson.uploadFile')}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('excelToJson.supportedFormats')}
          </span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if fileName}
<div class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
          {t('excelToJson.fileLoaded')}: {fileName}
        </div>
{/if}

      <!-- Sheet Selection -->
      {#if sheets.length > 1}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('excelToJson.selectSheet')}
          </label>
          <div class="flex flex-wrap gap-2">
            {#each sheets as sheet (sheet.name)}
<button 
                onclick={() => handleSheetChange(sheet.name)}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSheet === sheet.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {sheet.name} ({sheet.data.length} {t('excelToJson.rows')})
              </button>
{/each}
          </div>
        </div>
{/if}

      <!-- Preview Table -->
      {#if currentSheet}
{#if currentSheet.data.length > 0}
        <div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('excelToJson.preview')} ({currentSheet.data.length} {t('excelToJson.rows')})
          </h3>
          <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-64">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {#each currentSheet.headers as header (header)}
<th 
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
{/each}
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {#each currentSheet.data.slice(0, 10) as row, idx (idx)}
<tr >
                    {#each currentSheet.headers as header (header)}
<td 
                        class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
                      >
                        {String(row[header] ?? '')}
                      </td>
{/each}
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
          {#if currentSheet.data.length > 10}
<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('excelToJson.showingFirst')} 10 / {currentSheet.data.length} {t('excelToJson.rows')}
            </p>
{/if}
        </div>
      {/if}
{/if}

      <!-- JSON Output -->
      {#if jsonOutput}
<div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('excelToJson.jsonOutput')}
            </h3>
            <div class="flex gap-2">
              <button
                onclick={handleCopy}
                class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {copied ? t('excelToJson.copied') : t('excelToJson.copy')}
              </button>
              <button
                onclick={handleDownload}
                class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('excelToJson.download')}
              </button>
            </div>
          </div>
          <textarea
            value={jsonOutput}
            readOnly
            class="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"></textarea>
        </div>
{/if}
    </div>
  
