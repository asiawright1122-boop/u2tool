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

  let rows = $state(3);

  let cols = $state(3);

  let hasHeader = $state(true);

  let data = $state(() => 
    Array(3).fill(null).map(() => Array(3).fill('')));

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function updateSize(newRows: number, newCols: number) {
    const newData = Array(newRows).fill(null).map((_, i) =>
      Array(newCols).fill(null).map((_, j) => data[i]?.[j] || '')
    );
    data = newData;
    rows = newRows;
    cols = newCols;
  }
  function updateCell(row: number, col: number, value: string) {
    const newData = [...data];
    newData[row] = [...newData[row]];
    newData[row][col] = value;
    data = newData;
  }
  function generateHtml(): string {
    let html = '<table>\n';
    
    data.forEach((row, i) => {
      if (i === 0 && hasHeader) {
        html += '  <thead>\n    <tr>\n';
        row.forEach(cell => {
          html += `      <th>${cell || ''}</th>\n`;
        });
        html += '    </tr>\n  </thead>\n  <tbody>\n';
      } else {
        if (i === 1 && hasHeader) {
          // Already opened tbody
        } else if (i === 0 && !hasHeader) {
          html += '  <tbody>\n';
        }
        html += '    <tr>\n';
        row.forEach(cell => {
          html += `      <td>${cell || ''}</td>\n`;
        });
        html += '    </tr>\n';
      }
    });
    
    html += '  </tbody>\n</table>';
    return html;
  }
  function copyHtml() {
    navigator.clipboard.writeText(generateHtml());
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('tableGen.rows')}:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={rows}
            onchange={(e) => updateSize(parseInt(e.target.value) || 1, cols)}
            class="w-16 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-center"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('tableGen.cols')}:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onchange={(e) => updateSize(rows, parseInt(e.target.value) || 1)}
            class="w-16 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-center"
          />
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
          <input
            type="checkbox"
            bind:checked={hasHeader}
            class="rounded"
          />
          {t('tableGen.hasHeader')}
        </label>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <tbody>
            {#each data as row, i (i)}
<tr >
                {#each row as cell, j (j)}
<td  class="p-1">
                    <input
                      type="text"
                      value={cell}
                      onchange={(e) => updateCell(i, j, e.target.value)}
                      class={`w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-sm ${
                        i === 0 && hasHeader ? 'font-bold' : ''
                      }`}
                      placeholder={i === 0 && hasHeader ? t('tableGen.header') : t('tableGen.cell')}
                    />
                  </td>
{/each}
              </tr>
{/each}
          </tbody>
        </table>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">HTML</label>
          <button
            onclick={copyHtml}
            class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-3 text-sm text-green-600 dark:text-green-400 overflow-x-auto">
          {generateHtml()}
        </pre>
      </div>

      <div>
        <label class="text-sm text-gray-600 dark:text-gray-300 mb-2 block">{t('tableGen.preview')}</label>
        <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-4 overflow-x-auto">
          <table class="border-collapse border border-gray-400 dark:border-gray-600 text-black">
            {#if hasHeader}

              <thead>
                <tr>
                  {#each data[0] as cell, j (j)}
<th  class="border border-gray-400 dark:border-gray-600 px-3 py-2 bg-gray-200 dark:bg-gray-100 text-gray-900">
                      {cell || '\u00A0'}
                    </th>
{/each}
                </tr>
              </thead>
{/if}
            <tbody>
              {#each data.slice(hasHeader ? 1 : 0) as row, i (i)}
<tr >
                  {#each row as cell, j (j)}
<td  class="border border-gray-400 dark:border-gray-600 px-3 py-2 bg-white text-gray-900">
                      {cell || '\u00A0'}
                    </td>
{/each}
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
