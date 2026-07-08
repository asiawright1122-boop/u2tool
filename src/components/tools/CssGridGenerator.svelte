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
  function tg(key: string): string {
    const scope = translations['tools']['css-grid-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-grid-generator.${key}`;
  }

  let columns = $state(3);

  let rows = $state(3);

  let gap = $state(16);

  let columnSizes = $state(['1fr', '1fr', '1fr']);

  let rowSizes = $state(['auto', 'auto', 'auto']);

  let justifyItems = $state('stretch');

  let alignItems = $state('stretch');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function updateColumns(newCols: number) {
    columns = newCols;
    const newSizes = [...columnSizes];
    while (newSizes.length < newCols) newSizes.push('1fr');
    while (newSizes.length > newCols) newSizes.pop();
    columnSizes = newSizes;
  }
  function updateRows(newRows: number) {
    rows = newRows;
    const newSizes = [...rowSizes];
    while (newSizes.length < newRows) newSizes.push('auto');
    while (newSizes.length > newRows) newSizes.pop();
    rowSizes = newSizes;
  }
  function generateCSS() {
    return `.grid-container {
  display: grid;
  grid-template-columns: ${columnSizes.join(' ')};
  grid-template-rows: ${rowSizes.join(' ')};
  gap: ${gap}px;
  justify-items: ${justifyItems};
  align-items: ${alignItems};
}`;
  }
  function getPreviewStyle() {
    return `display: grid; grid-template-columns: ${columnSizes.join(' ')}; grid-template-rows: ${rowSizes.join(' ')}; gap: ${gap}px; justify-items: ${justifyItems}; align-items: ${alignItems};`;
  }
  let css = $derived(generateCSS());
  async function copyCSS() {
    await navigator.clipboard.writeText(css);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const sizeOptions = ['auto', '1fr', '2fr', '3fr', 'min-content', 'max-content', '100px', '200px', '50%'];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="flex flex-col">
          <label for="grid-columns" class="block text-sm font-medium mb-2 truncate">{tg('columns')}</label>
          <input
            id="grid-columns"
            name="gridColumns"
            type="number"
            min={1}
            max={12}
            value={columns}
            onchange={(e) => updateColumns(parseInt(e.target.value) || 1)}
            class="tool-input flex-1"
          />
        </div>
        <div class="flex flex-col">
          <label for="grid-rows" class="block text-sm font-medium mb-2 truncate">{tg('rows')}</label>
          <input
            id="grid-rows"
            name="gridRows"
            type="number"
            min={1}
            max={12}
            value={rows}
            onchange={(e) => updateRows(parseInt(e.target.value) || 1)}
            class="tool-input flex-1"
          />
        </div>
        <div class="flex flex-col">
          <label for="grid-gap" class="block text-sm font-medium mb-2 truncate">{tg('gap')}</label>
          <input
            id="grid-gap"
            name="gridGap"
            type="number"
            min={0}
            value={gap}
            onchange={(e) => gap = parseInt(e.target.value) || 0}
            class="tool-input flex-1"
          />
        </div>
        <div class="flex flex-col">
          <label for="grid-justify-items" class="block text-sm font-medium mb-2 truncate">{tg('justifyItems')}</label>
          <select id="grid-justify-items" name="gridJustifyItems" bind:value={justifyItems} class="tool-input flex-1">
            <option value="stretch">{tg('stretch')}</option>
            <option value="start">{tg('start')}</option>
            <option value="center">{tg('center')}</option>
            <option value="end">{tg('end')}</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="grid-align-items" class="block text-sm font-medium mb-2 truncate">{tg('alignItems')}</label>
          <select id="grid-align-items" name="gridAlignItems" bind:value={alignItems} class="tool-input flex-1">
            <option value="stretch">{tg('stretch')}</option>
            <option value="start">{tg('start')}</option>
            <option value="center">{tg('center')}</option>
            <option value="end">{tg('end')}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="css-grid-generator-field-6" class="block text-sm font-medium mb-3">{tg('columnSizes')}</label>
          <div class="space-y-2">
            {#each columnSizes as size, i (i)}
<div  class="flex items-center gap-3">
                <span class="text-sm text-gray-600 dark:text-gray-300 w-16 shrink-0 whitespace-nowrap">{tg('col', { index: i + 1 })}:</span>
                <select
                  value={size}
                  onchange={(e) => {
                    const newSizes = [...columnSizes];
                    newSizes[i] = e.target.value;
                    columnSizes = newSizes;
                  }}
                  class="tool-input flex-1 min-w-0" id="css-grid-generator-field-6">
                  {#each sizeOptions as opt (opt)}
<option  value={opt}>{opt}</option>
{/each}
                </select>
              </div>
{/each}
          </div>
        </div>
        <div>
          <label for="css-grid-generator-field-5" class="block text-sm font-medium mb-3">{tg('rowSizes')}</label>
          <div class="space-y-2">
            {#each rowSizes as size, i (i)}
<div  class="flex items-center gap-3">
                <span class="text-sm text-gray-600 dark:text-gray-300 w-16 shrink-0 whitespace-nowrap">{tg('row', { index: i + 1 })}:</span>
                <select
                  value={size}
                  onchange={(e) => {
                    const newSizes = [...rowSizes];
                    newSizes[i] = e.target.value;
                    rowSizes = newSizes;
                  }}
                  class="tool-input flex-1 min-w-0" id="css-grid-generator-field-5">
                  {#each sizeOptions as opt (opt)}
<option  value={opt}>{opt}</option>
{/each}
                </select>
              </div>
{/each}
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div>
        <div class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{tg('preview')}</div>
        <div
          class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px]"
          style={getPreviewStyle()}
        >
          {#each Array.from({ length: columns * rows }) as _, i (i)}
<div 
              class="bg-amber-600/50 border border-amber-400 rounded p-2 text-center text-sm text-gray-900 dark:text-white"
            >
              {i + 1}
            </div>
{/each}
        </div>
      </div>

      <!-- CSS Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium">{tg('generatedCss')}</div>
          <button
            onclick={copyCSS}
            class={`text-sm px-3 py-1 rounded ${copied ? 'bg-emerald-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="tool-textarea font-mono text-sm">{css}</pre>
      </div>
    </div>
  
