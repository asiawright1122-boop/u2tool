<script lang="ts">
  import {
    filterExcelRows,
    parseExcelWorkbook,
    sheetToCsv,
    sortExcelRows,
    type ExcelSheetView,
    type ExcelWorkbookView,
  } from '@/lib/excel-data-viewer';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  type SortDirection = 'asc' | 'desc';
  type DisplayMode = 'values' | 'formulas';

  const EXCEL_FILE_LIMIT = 10 * 1024 * 1024;
  const EXCEL_FILE_PATTERN = /\.(?:xls|xlsx|xlsm)$/i;

  let { locale, translations }: Props = $props();

  let workbook = $state<ExcelWorkbookView | null>(null);
  let selectedSheetIndex = $state(0);
  let fileName = $state('');
  let fileError = $state('');
  let downloadError = $state('');
  let loading = $state(false);
  let displayMode = $state<DisplayMode>('values');
  let sortColumn = $state(-1);
  let sortDirection = $state<SortDirection>('asc');
  let filterColumn = $state(-1);
  let filterQuery = $state('');

  let currentSheet = $derived(workbook?.sheets[selectedSheetIndex] ?? null);
  let visibleRows = $derived.by(() => {
    if (!currentSheet) return [];
    const filteredRows = filterColumn >= 0 && filterQuery
      ? filterExcelRows(currentSheet, filterColumn, filterQuery)
      : currentSheet.rows;
    if (sortColumn < 0) return filteredRows;
    return sortExcelRows(
      { ...currentSheet, rows: filteredRows },
      sortColumn,
      sortDirection,
    );
  });
  let visibleWarnings = $derived(
    workbook?.warnings.map(localizeWorkbookWarning) ?? [],
  );

  function t(
    key: string,
    variables: Record<string, string | number> = {},
  ): string {
    const tools = translations.tools as Record<string, unknown> | undefined;
    const scope = tools?.['excel-viewer'] as Record<string, unknown> | undefined;
    let value: unknown = scope;
    for (const segment of key.split('.')) {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return `MISSING: tools.excel-viewer.${key}`;
      }
      value = (value as Record<string, unknown>)[segment];
    }
    if (typeof value !== 'string') {
      return `MISSING: tools.excel-viewer.${key}`;
    }
    return Object.entries(variables).reduce(
      (result, [name, replacement]) =>
        result.replaceAll(`{${name}}`, String(replacement)),
      value,
    );
  }

  function clearWorkbook(): void {
    workbook = null;
    selectedSheetIndex = 0;
    fileName = '';
    displayMode = 'values';
    resetTableControls();
  }

  function resetTableControls(): void {
    sortColumn = -1;
    sortDirection = 'asc';
    filterColumn = -1;
    filterQuery = '';
    downloadError = '';
  }

  function handleFileUpload(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    fileError = '';
    downloadError = '';

    if (file.size > EXCEL_FILE_LIMIT) {
      clearWorkbook();
      fileError = t('excelViewer.fileTooLarge');
      input.value = '';
      return;
    }
    if (!EXCEL_FILE_PATTERN.test(file.name)) {
      clearWorkbook();
      fileError = t('excelViewer.invalidFileType');
      input.value = '';
      return;
    }

    clearWorkbook();
    loading = true;
    const reader = new FileReader();
    reader.onerror = () => {
      loading = false;
      clearWorkbook();
      fileError = t('excelViewer.readError');
      input.value = '';
    };
    reader.onload = async () => {
      try {
        if (!(reader.result instanceof ArrayBuffer)) {
          throw new Error('Workbook reader returned no bytes');
        }
        const parsed = await parseExcelWorkbook(new Uint8Array(reader.result));
        workbook = parsed;
        selectedSheetIndex = 0;
        fileName = file.name;
        fileError = '';
      } catch {
        clearWorkbook();
        fileError = t('excelViewer.parseError');
      } finally {
        loading = false;
        input.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function selectSheet(index: number): void {
    selectedSheetIndex = index;
    displayMode = 'values';
    resetTableControls();
  }

  function handleSort(column: number): void {
    if (sortColumn !== column) {
      sortColumn = column;
      sortDirection = 'asc';
      return;
    }
    if (sortDirection === 'asc') {
      sortDirection = 'desc';
      return;
    }
    sortColumn = -1;
    sortDirection = 'asc';
  }

  function handleFilterColumn(event: Event): void {
    filterColumn = Number((event.currentTarget as HTMLSelectElement).value);
  }

  function displayCellValue(cell: ExcelSheetView['rows'][number][number]): string {
    if (displayMode === 'formulas' && cell.formula) {
      return `=${cell.formula}`;
    }
    if (cell.value === null) return '';
    return String(cell.value);
  }

  function localizeWorkbookWarning(warning: string): string {
    if (warning.startsWith('Macros are present')) return t('excelViewer.warningMacros');
    if (warning.startsWith('Charts are present')) return t('excelViewer.warningCharts');
    if (warning.startsWith('Complex formatting')) return t('excelViewer.warningFormatting');
    if (warning.startsWith('Formulas are displayed')) return t('excelViewer.warningFormulas');
    return warning;
  }

  function csvFileName(sheet: ExcelSheetView): string {
    const workbookName = fileName.replace(/\.(?:xls|xlsx|xlsm)$/i, '') || 'workbook';
    const sheetName = sheet.name.replace(/[\\/:*?"<>|]+/g, '-').trim() || 'sheet';
    return `${workbookName}-${sheetName}.csv`;
  }

  function downloadSelectedSheetCsv(): void {
    if (!currentSheet) return;
    downloadError = '';
    let objectUrl = '';
    try {
      const blob = new Blob([sheetToCsv(currentSheet)], {
        type: 'text/csv;charset=utf-8',
      });
      objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = csvFileName(currentSheet);
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
    } catch {
      downloadError = t('excelViewer.downloadError');
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }
</script>

<section class="space-y-5" data-excel-viewer data-locale={locale}>
  <div
    class="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100"
    data-excel-local-notice
  >
    <p class="font-medium">{t('excelViewer.localNotice')}</p>
    <p class="mt-1 text-sky-800 dark:text-sky-200">{t('excelViewer.fileLimit')}</p>
  </div>

  <div class="tool-dropzone">
    <input
      id="excel-viewer-upload"
      class="sr-only"
      type="file"
      accept=".xls,.xlsx,.xlsm"
      onchange={handleFileUpload}
      data-excel-file-input
    />
    <label
      for="excel-viewer-upload"
      class="flex cursor-pointer flex-col items-center gap-2 text-center focus-within:outline-none"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" class="h-9 w-9 text-amber-700 dark:text-amber-300" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M4 4.75A1.75 1.75 0 0 1 5.75 3h8.5L20 8.75v10.5A1.75 1.75 0 0 1 18.25 21H5.75A1.75 1.75 0 0 1 4 19.25z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </svg>
      <span class="text-base font-semibold text-gray-900 dark:text-gray-100">
        {t('excelViewer.uploadFile')}
      </span>
      <span class="text-sm text-gray-600 dark:text-gray-300">
        {t('excelViewer.supportedFormats')}
      </span>
    </label>
  </div>

  {#if loading}
    <p class="text-sm text-gray-700 dark:text-gray-200" role="status" aria-live="polite">
      {t('excelViewer.loading')}
    </p>
  {/if}

  {#if fileError}
    <div
      class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      role="alert"
      aria-live="assertive"
      data-excel-error
    >
      {fileError}
    </div>
  {/if}

  {#if workbook && currentSheet}
    <div class="space-y-5">
      <div class="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('excelViewer.fileLoaded')}</p>
          <p class="font-semibold text-gray-950 dark:text-white" data-excel-file-name>{fileName}</p>
        </div>
        <button
          type="button"
          class="tool-btn-secondary"
          onclick={downloadSelectedSheetCsv}
          data-excel-download-csv
        >
          {t('excelViewer.downloadCsv')}
        </button>
      </div>

      {#if downloadError}
        <p
          class="text-sm text-red-700 dark:text-red-300"
          role="alert"
          aria-live="assertive"
          data-excel-download-error
        >
          {downloadError}
        </p>
      {/if}

      {#if visibleWarnings.length > 0}
        <div class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/35">
          <h2 class="font-semibold text-amber-950 dark:text-amber-100">
            {t('excelViewer.workbookWarnings')}
          </h2>
          <ul class="mt-2 list-disc space-y-1 ps-5 text-sm text-amber-900 dark:text-amber-200">
            {#each visibleWarnings as warning}
              <li data-excel-warning>{warning}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <div
        class="flex gap-1 overflow-x-auto border-b border-gray-300 dark:border-gray-700"
        role="tablist"
        aria-label={t('excelViewer.sheetTabs')}
      >
        {#each workbook.sheets as sheet, index (sheet.name)}
          <button
            id={`excel-sheet-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={selectedSheetIndex === index}
            aria-controls="excel-sheet-panel"
            class={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${selectedSheetIndex === index
              ? 'border-amber-600 text-amber-800 dark:border-amber-400 dark:text-amber-200'
              : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-950 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-white'}`}
            onclick={() => selectSheet(index)}
            data-excel-sheet-tab={sheet.name}
          >
            {sheet.name}
          </button>
        {/each}
      </div>

      <div
        id="excel-sheet-panel"
        role="tabpanel"
        aria-labelledby={`excel-sheet-tab-${selectedSheetIndex}`}
        class="space-y-4"
      >
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="flex flex-wrap items-end gap-3">
            <div>
              <label for="excel-filter-column" class="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                {t('excelViewer.filterColumn')}
              </label>
              <select
                id="excel-filter-column"
                class="tool-select"
                value={filterColumn}
                onchange={handleFilterColumn}
                data-excel-filter-column
              >
                <option value="-1">{t('excelViewer.selectColumn')}</option>
                {#each currentSheet.headers as header, index}
                  <option value={index}>{header || t('excelViewer.blankHeader', { column: index + 1 })}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="excel-filter-query" class="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">
                {t('excelViewer.filterValue')}
              </label>
              <input
                id="excel-filter-query"
                class="tool-input"
                type="search"
                bind:value={filterQuery}
                placeholder={t('excelViewer.enterValue')}
                disabled={filterColumn < 0}
                data-excel-filter-query
              />
            </div>
            {#if filterColumn >= 0 || filterQuery}
              <button
                type="button"
                class="tool-btn-secondary"
                onclick={() => {
                  filterColumn = -1;
                  filterQuery = '';
                }}
              >
                {t('excelViewer.clearFilter')}
              </button>
            {/if}
          </div>

          <div class="inline-flex rounded-lg border border-gray-300 p-1 dark:border-gray-700" role="group" aria-label={t('excelViewer.cellDisplay')}>
            <button
              type="button"
              aria-pressed={displayMode === 'values'}
              class={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${displayMode === 'values'
                ? 'bg-amber-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              onclick={() => (displayMode = 'values')}
              data-excel-display-values
            >
              {t('excelViewer.displayValues')}
            </button>
            <button
              type="button"
              aria-pressed={displayMode === 'formulas'}
              class={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${displayMode === 'formulas'
                ? 'bg-amber-600 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}`}
              onclick={() => (displayMode = 'formulas')}
              data-excel-display-formulas
            >
              {t('excelViewer.displayFormulas')}
            </button>
          </div>
        </div>

        {#if currentSheet.merges.length > 0}
          <p class="text-sm text-gray-700 dark:text-gray-200" data-excel-merges>
            <span class="font-medium">{t('excelViewer.mergedRanges')}:</span>
            {currentSheet.merges.join(', ')}
          </p>
        {/if}

        {#if currentSheet.headers.length === 0}
          <div class="rounded-lg border border-dashed border-gray-300 px-4 py-10 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
            {t('excelViewer.emptySheet')}
          </div>
        {:else}
          <p class="text-sm text-gray-600 dark:text-gray-300" data-excel-row-count>
            {t('excelViewer.showingRows', {
              visible: visibleRows.length,
              total: currentSheet.rows.length,
            })}
          </p>

          <div class="max-h-[32rem] overflow-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <table class="min-w-full border-collapse text-sm">
              <thead class="sticky top-0 z-10 bg-gray-100 dark:bg-gray-900">
                <tr>
                  {#each currentSheet.headers as header, column}
                    <th
                      scope="col"
                      class="border-b border-gray-300 px-3 py-2 text-start font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100"
                      aria-sort={sortColumn === column
                        ? sortDirection === 'asc' ? 'ascending' : 'descending'
                        : 'none'}
                    >
                      <button
                        type="button"
                        class="flex w-full items-center justify-between gap-3 rounded px-1 py-1 text-start hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-gray-800"
                        onclick={() => handleSort(column)}
                        data-excel-sort-column={column}
                      >
                        <span>{header || t('excelViewer.blankHeader', { column: column + 1 })}</span>
                        {#if sortColumn === column}
                          <span aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        {/if}
                      </button>
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-950">
                {#each visibleRows as row (row.map((cell) => cell.address).join('|'))}
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-900" data-excel-row>
                    {#each row as cell, column (cell.address)}
                      <td
                        class="min-w-32 px-3 py-2 align-top text-gray-900 dark:text-gray-100"
                        data-excel-cell={cell.address}
                        data-excel-cell-column={column}
                      >
                        <span class="block font-mono text-[0.6875rem] text-gray-500 dark:text-gray-400" data-excel-cell-address>
                          {cell.address}
                        </span>
                        <span class="mt-0.5 block whitespace-pre-wrap break-words" data-excel-cell-content>
                          {displayCellValue(cell)}
                        </span>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          {#if visibleRows.length === 0}
            <p class="text-center text-sm text-gray-600 dark:text-gray-300">
              {t('excelViewer.noResults')}
            </p>
          {/if}
        {/if}
      </div>
    </div>
  {/if}
</section>
