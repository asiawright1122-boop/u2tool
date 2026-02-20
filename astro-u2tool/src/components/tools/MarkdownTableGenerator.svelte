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
  function tm(key: string): string {
    const scope = translations['tools']['markdown-table-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.markdown-table-generator.${key}`;
  }

  // Types
  type Alignment = 'left' | 'center' | 'right';

  let rows = $state(3);

  let cols = $state(3);

  let data = $state([
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
  ]);

  let alignments = $state(['left', 'left', 'left']);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function updateCell(row: number, col: number, value: string) {
    const newData = [...data];
    newData[row][col] = value;
    data = newData;
  }
  function updateAlignment(col: number, alignment: Alignment) {
    const newAlignments = [...alignments];
    newAlignments[col] = alignment;
    alignments = newAlignments;
  }
  function addRow() {
    const newRow = Array(cols).fill('');
    data = [...data, newRow];
    rows = rows + 1;
  }
  function addColumn() {
    const newData = data.map((row, i) => [...row, i === 0 ? `Header ${cols + 1}` : '']);
    data = newData;
    alignments = [...alignments, 'left'];
    cols = cols + 1;
  }
  function removeRow(index: number) {
    if (data.length <= 2) return;
    const newData = data.filter((_, i) => i !== index);
    data = newData;
    rows = rows - 1;
  }
  function removeColumn(index: number) {
    if (cols <= 1) return;
    const newData = data.map(row => row.filter((_, i) => i !== index));
    const newAlignments = alignments.filter((_, i) => i !== index);
    data = newData;
    alignments = newAlignments;
    cols = cols - 1;
  }
  function generateMarkdown(): string {
    if (data.length === 0 || data[0].length === 0) return '';

    const colWidths = data[0].map((_, colIndex) => 
      Math.max(...data.map(row => (row[colIndex] || '').length), 3)
    );

    const padCell = (text: string, width: number, align: Alignment): string => {
      const padding = width - text.length;
      if (align === 'center') {
        const left = Math.floor(padding / 2);
        const right = padding - left;
        return ' '.repeat(left) + text + ' '.repeat(right);
      } else if (align === 'right') {
        return ' '.repeat(padding) + text;
      }
      return text + ' '.repeat(padding);
    };

    const headerRow = '| ' + data[0].map((cell, i) => 
      padCell(cell, colWidths[i], alignments[i])
    ).join(' | ') + ' |';

    const separatorRow = '| ' + alignments.map((align, i) => {
      const width = colWidths[i];
      if (align === 'center') return ':' + '-'.repeat(width - 2) + ':';
      if (align === 'right') return '-'.repeat(width - 1) + ':';
      return '-'.repeat(width);
    }).join(' | ') + ' |';

    const dataRows = data.slice(1).map(row => 
      '| ' + row.map((cell, i) => 
        padCell(cell || '', colWidths[i], alignments[i])
      ).join(' | ') + ' |'
    );

    return [headerRow, separatorRow, ...dataRows].join('\n');
  }
  async function copyMarkdown() {
    await navigator.clipboard.writeText(generateMarkdown());
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadSample() {
    data = [
      ['Name', 'Age', 'City', 'Country'],
      ['John Doe', '30', 'New York', 'USA'],
      ['Jane Smith', '25', 'London', 'UK'],
      ['Bob Johnson', '35', 'Tokyo', 'Japan'],
    ];
    alignments = ['left', 'center', 'left', 'left'];
    cols = 4;
    rows = 4;
  }
  function clearTable() {
    data = [
      ['Header 1', 'Header 2', 'Header 3'],
      ['', '', ''],
      ['', '', ''],
    ];
    alignments = ['left', 'left', 'left'];
    cols = 3;
    rows = 3;
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-2">
        <button onclick={addRow} class="btn-secondary">{tm('addRow')}</button>
        <button onclick={addColumn} class="btn-secondary">{tm('addColumn')}</button>
        <button onclick={loadSample} class="btn-secondary">{tm('loadSample')}</button>
        <button onclick={clearTable} class="btn-secondary">{t('clear')}</button>
      </div>

      <!-- Alignment Controls -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{tm('columnAlignment')}</h3>
        <div class="flex flex-wrap gap-4">
          {#each alignments as align, i (i)}
<div  class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-300">{tm('col')} {i + 1}:</span>
              <select
                value={align}
                onchange={(e) => updateAlignment(i, e.target.value as Alignment)}
                class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
              >
                <option value="left">{tm('left')}</option>
                <option value="center">{tm('center')}</option>
                <option value="right">{tm('right')}</option>
              </select>
            </div>
{/each}
        </div>
      </div>

      <!-- Table Editor -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <tbody>
            {#each data as row, rowIndex (rowIndex)}
<tr  class={rowIndex === 0 ? 'bg-gray-200 dark:bg-gray-700' : ''}>
                {#each row as cell, colIndex (colIndex)}
<td  class="border border-gray-300 dark:border-gray-600 p-0">
                    <input
                      type="text"
                      value={cell}
                      onchange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      class={`w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white ${
                        rowIndex === 0 ? 'font-bold' : ''
                      }`}
                      placeholder={rowIndex === 0 ? tm('header') : tm('cell')}
                    />
                  </td>
{/each}
                <td class="border border-gray-300 dark:border-gray-600 p-1 w-10">
                  {#if rowIndex > 0}
<button
                      onclick={() => removeRow(rowIndex)}
                      class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1"
                      title={tm('removeRow')}
                    >
                      ✕
                    </button>
{/if}
                </td>
              </tr>
{/each}
            <tr>
              {#each data[0] as _, colIndex (colIndex)}
<td  class="border border-gray-300 dark:border-gray-600 p-1 text-center">
                  <button
                    onclick={() => removeColumn(colIndex)}
                    class="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-1 text-sm"
                    title={tm('removeColumn')}
                  >
                    ✕
                  </button>
                </td>
{/each}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{tm('markdownOutput')}</label>
          <button
            onclick={copyMarkdown}
            class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="tool-textarea font-mono text-sm whitespace-pre overflow-x-auto">
          {generateMarkdown()}
        </pre>
      </div>

      <!-- Preview -->
      <div>
        <h3 class="text-sm font-medium mb-2 text-gray-900 dark:text-white">{tm('preview')}</h3>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                {#each data[0] as cell, i (i)}
<th 
                    class={`border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white ${
                      alignments[i] === 'center' ? 'text-center' : 
                      alignments[i] === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {cell}
                  </th>
{/each}
              </tr>
            </thead>
            <tbody>
              {#each data.slice(1) as row, rowIndex (rowIndex)}
<tr >
                  {#each row as cell, colIndex (colIndex)}
<td 
                      class={`border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-white ${
                        alignments[colIndex] === 'center' ? 'text-center' : 
                        alignments[colIndex] === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {cell}
                    </td>
{/each}
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
