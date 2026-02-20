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
  interface FileData {
  id: string;
  name: string;
  sheets: { name: string; data: Record<string, unknown>[]; headers: string[]; selected: boolean }[];
}

  let files = $state([]);

  let mergeMode = $state('vertical');

  let error = $state('');

  let outputFileName = $state('merged');

  function handleFileUpload(e: Event) {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    error = '';

    Array.from(uploadedFiles).forEach(file => {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        error = t('excelMerger.invalidFileType');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const XLSX = await import('xlsx');
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = workbook.SheetNames.map(name => {
            const worksheet = workbook.Sheets[name];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
            const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
            return { name, data: jsonData, headers, selected: true };
          });

          files = [...files, { id: Date.now().toString() + Math.random(), name: file.name, sheets }];
        } catch {
          error = t('excelMerger.parseError');
        }
      };
      reader.readAsArrayBuffer(file);
    });

    e.target.value = '';
  }

  // Functions
  function removeFile(id: string) {
    files = files.filter(f => f.id !== id);
  }
  function toggleSheet(fileId: string, sheetName: string) {
    files = files.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          sheets: f.sheets.map(s => s.name === sheetName ? { ...s, selected: !s.selected } : s)
        };
      }
      return f;
    });
  }
  async function handleMerge() {
    const selectedSheets = files.flatMap(f => 
      f.sheets.filter(s => s.selected).map(s => ({ fileName: f.name, ...s }))
    );

    if (selectedSheets.length === 0) {
      error = t('excelMerger.noSheetsSelected');
      return;
    }

    try {
      const XLSX = await import('xlsx');
      const mergedData: Record<string, unknown>[] = [];

      if (mergeMode === 'vertical') {
        // Collect all headers
        const allHeaders = new Set<string>();
        selectedSheets.forEach(s => s.headers.forEach(h => allHeaders.add(h)));
        
        // Merge data vertically
        selectedSheets.forEach(sheet => {
          sheet.data.forEach(row => {
            const newRow: Record<string, unknown> = {};
            allHeaders.forEach(h => { newRow[h] = row[h] ?? ''; });
            mergedData.push(newRow);
          });
        });
      } else {
        // Horizontal merge - append columns
        const maxRows = Math.max(...selectedSheets.map(s => s.data.length));
        
        for (let i = 0; i < maxRows; i++) {
          const row: Record<string, unknown> = {};
          selectedSheets.forEach((sheet, _sheetIdx) => {
            const prefix = selectedSheets.length > 1 ? `${sheet.name}_` : '';
            sheet.headers.forEach(h => {
              row[`${prefix}${h}`] = sheet.data[i]?.[h] ?? '';
            });
          });
          mergedData.push(row);
        }
      }

      const worksheet = XLSX.utils.json_to_sheet(mergedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Merged');
      XLSX.writeFile(workbook, `${outputFileName}.xlsx`);
    } catch {
      error = t('excelMerger.mergeError');
    }
  }
  const totalSelectedSheets = files.reduce((sum, f) => sum + f.sheets.filter(s => s.selected).length, 0);

</script>


    <div class="space-y-6">
      <!-- File Upload -->
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".xlsx,.xls" multiple onchange={handleFileUpload} class="hidden" id="excel-merger-upload" />
        <label for="excel-merger-upload" class="cursor-pointer flex flex-col items-center">
          <span class="text-4xl mb-2">🔗</span>
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">{t('excelMerger.uploadFiles')}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('excelMerger.multipleFiles')}</span>
        </label>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      <!-- File List -->
      {#if files.length > 0}
<div class="space-y-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('excelMerger.uploadedFiles')}</h3>
          {#each files as file (file.id)}
<div  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
                <button onclick={() => removeFile(file.id)} class="text-red-500 hover:text-red-700">✕</button>
              </div>
              <div class="flex flex-wrap gap-2">
                {#each file.sheets as sheet (sheet.name)}
<button 
                    onclick={() => toggleSheet(file.id, sheet.name)}
                    class={`px-3 py-1 text-sm rounded-full transition-colors ${
                      sheet.selected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {sheet.name} ({sheet.data.length})
                  </button>
{/each}
              </div>
            </div>
{/each}
        </div>
{/if}

      <!-- Options -->
      {#if files.length > 0}
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('excelMerger.mergeMode')}
            </label>
            <div class="flex gap-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  value="vertical"
                  checked={mergeMode === 'vertical'}
                  onchange={() => mergeMode = 'vertical'}
                  class="mr-2"
                />
                {t('excelMerger.vertical')}
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  value="horizontal"
                  checked={mergeMode === 'horizontal'}
                  onchange={() => mergeMode = 'horizontal'}
                  class="mr-2"
                />
                {t('excelMerger.horizontal')}
              </label>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('excelMerger.outputFileName')}
            </label>
            <input
              type="text"
              bind:value={outputFileName}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
        </div>
{/if}

      <!-- Merge Button -->
      {#if files.length > 0}
<button
          onclick={handleMerge}
          disabled={totalSelectedSheets === 0}
          class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {t('excelMerger.merge')} ({totalSelectedSheets} {t('excelMerger.sheets')})
        </button>
{/if}
    </div>
  
