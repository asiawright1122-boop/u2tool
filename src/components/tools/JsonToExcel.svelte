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

  let jsonInput = $state('');

  let fileName = $state('data');

  let sheetName = $state('Sheet1');

  let error = $state('');

  let preview = $state([] as Record<string, unknown>[]);

  let headers = $state([]);

  function handleJsonChange(value: string) {
    jsonInput = value;
    error = '';
    preview = [];
    headers = [];

    if (!value.trim()) return;

    try {
      const parsed = JSON.parse(value);
      let data: Record<string, unknown>[];

      if (Array.isArray(parsed)) {
        data = parsed.map(item =>
          typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
        );
      } else if (typeof parsed === 'object' && parsed !== null) {
        data = [flattenObject(parsed)];
      } else {
        error = t('jsonToExcel.invalidJson');
        return;
      }

      if (data.length === 0) {
        error = t('jsonToExcel.emptyData');
        return;
      }

      const allHeaders = new Set<string>();
      data.forEach(row => Object.keys(row).forEach(key => allHeaders.add(key)));

      headers = Array.from(allHeaders);
      preview = data.slice(0, 10);
    } catch {
      error = t('jsonToExcel.parseError');
    }
  }

  // Functions
  function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key] as Record<string, unknown>, newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
    return result;
  }
  async function handleDownload() {
    if (!jsonInput.trim()) {
      error = t('jsonToExcel.noInput');
      return;
    }

    try {
      const XLSX = await import('xlsx');
      const parsed = JSON.parse(jsonInput);
      let data: Record<string, unknown>[];

      if (Array.isArray(parsed)) {
        data = parsed.map(item =>
          typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
        );
      } else if (typeof parsed === 'object' && parsed !== null) {
        data = [flattenObject(parsed)];
      } else {
        error = t('jsonToExcel.invalidJson');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch {
      error = t('jsonToExcel.exportError');
    }
  }
  function loadSample() {
    const sample = JSON.stringify([
      { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25 },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35 }
    ], null, 2);
    handleJsonChange(sample);
  }

</script>


    <div class="space-y-6">
      <!-- Input Section -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="tool-label">
            {t('jsonToExcel.jsonInput')}
          </div>
          <button
            onclick={loadSample}
            class="text-sm text-amber-600 hover:text-amber-800 dark:text-amber-400"
          >
            {t('jsonToExcel.loadSample')}
          </button>
        </div>
        <textarea
          value={jsonInput}
          onchange={(e) => handleJsonChange(e.target.value)}
          placeholder={t('jsonToExcel.placeholder')}
          class="tool-textarea h-48"
        ></textarea>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="json-to-excel-field-5" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('jsonToExcel.fileName')}
          </label>
          <input
            type="text"
            bind:value={fileName}
            class="tool-input" id="json-to-excel-field-5" />
        </div>
        <div>
          <label for="json-to-excel-field-4" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('jsonToExcel.sheetName')}
          </label>
          <input
            type="text"
            bind:value={sheetName}
            class="tool-input" id="json-to-excel-field-4" />
        </div>
      </div>

      <!-- Preview -->
      {#if preview.length > 0}
<div>
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('jsonToExcel.preview')}
          </h3>
          <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-64">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {#each headers as header (header)}
<th  class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {header}
                    </th>
{/each}
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {#each preview as row, idx (idx)}
<tr >
                    {#each headers as header (header)}
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

      <!-- Download Button -->
      <button
        onclick={handleDownload}
        disabled={!jsonInput.trim() || !!error}
        class="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {t('jsonToExcel.download')}
      </button>
    </div>
  
