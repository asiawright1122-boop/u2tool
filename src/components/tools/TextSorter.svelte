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
  export type SortType = 'alphabetical' | 'numerical' | 'natural' | 'length';
  export type SortOrder = 'asc' | 'desc';

  let input = $state('');

  let output = $state('');

  let sortType = $state('alphabetical');

  let order = $state('asc');

  let caseSensitive = $state(false);

  let trimLines = $state(true);

  let removeDups = $state(false);

  let removeEmpty = $state(true);

  let copied = $state(false);

  let timerRef = $state(null);

  function handleSort() {
    let lines = input.split('\n');
    
    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }
    
    if (removeDups) {
      lines = removeDuplicates(lines, caseSensitive);
    }
    
    const sorted = sortLines(lines, sortType, order, caseSensitive, trimLines);
    output = sorted.join('\n');
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  export function sortLines(
  lines: string[],
  sortType: SortType,
  order: SortOrder,
  caseSensitive: boolean,
  trimLines: boolean
): string[] {
  const processed = lines.map(line => trimLines ? line.trim() : line);
  
  const compareFn = (a: string, b: string): number => {
    const strA = caseSensitive ? a : a.toLowerCase();
    const strB = caseSensitive ? b : b.toLowerCase();
    
    let result: number;
    
    switch (sortType) {
      case 'alphabetical':
        result = strA.localeCompare(strB);
        break;
      case 'numerical':
        const numA = parseFloat(strA) || 0;
        const numB = parseFloat(strB) || 0;
        result = numA - numB;
        break;
      case 'natural':
        result = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: caseSensitive ? 'case' : 'base' });
        break;
      case 'length':
        result = a.length - b.length;
        break;
      default:
        result = 0;
    }
    
    return order === 'desc' ? -result : result;
  };
  
  // 使用稳定排序
  return [...processed].sort((a, b) => {
    const cmp = compareFn(a, b);
    // 如果相等，保持原始顺序（稳定排序）
    if (cmp === 0) {
      return processed.indexOf(a) - processed.indexOf(b);
    }
    return cmp;
  });
}
  export function removeDuplicates(lines: string[], caseSensitive: boolean): string[] {
  const seen = new Set<string>();
  return lines.filter(line => {
    const key = caseSensitive ? line : line.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function handleClear() {
    input = '';
    output = '';
  }
  function loadExample() {
    input = 'banana\napple\nCherry\n10\n2\n1\nfile1.txt\nfile10.txt\nfile2.txt';
  }
  const inputLines = input.split('\n').filter(l => l.trim()).length;
  const outputLines = output.split('\n').filter(l => l.trim()).length;

</script>


    <div class="space-y-4">
      <!-- 控制面板 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- 排序类型 -->
          <div>
            <label for="sort-type" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('sorter.sortType')}</label>
            <select
              id="sort-type"
              name="sortType"
              value={sortType}
              onchange={(e) => sortType = e.target.value as SortType}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="alphabetical">{t('sorter.alphabetical')}</option>
              <option value="numerical">{t('sorter.numerical')}</option>
              <option value="natural">{t('sorter.natural')}</option>
              <option value="length">{t('sorter.byLength')}</option>
            </select>
          </div>
          
          <!-- 排序顺序 -->
          <div>
            <label for="sort-order" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('sorter.order')}</label>
            <select
              id="sort-order"
              name="sortOrder"
              value={order}
              onchange={(e) => order = e.target.value as SortOrder}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              <option value="asc">{t('sorter.ascending')}</option>
              <option value="desc">{t('sorter.descending')}</option>
            </select>
          </div>
        </div>

        <!-- 选项 -->
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              id="sort-case-sensitive"
              name="sortCaseSensitive"
              bind:checked={caseSensitive}
              class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('sorter.caseSensitive')}
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              id="sort-trim-lines"
              name="sortTrimLines"
              bind:checked={trimLines}
              class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('sorter.trimLines')}
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              id="sort-remove-empty"
              name="sortRemoveEmpty"
              bind:checked={removeEmpty}
              class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('sorter.removeEmpty')}
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              id="sort-remove-duplicates"
              name="sortRemoveDuplicates"
              bind:checked={removeDups}
              class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('sorter.removeDuplicates')}
          </label>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            onclick={handleSort}
            class="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded text-sm font-medium text-white"
          >
            {t('sorter.sort')}
          </button>
          <button
            onclick={loadExample}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
          >
            {t('sorter.loadExample')}
          </button>
          <button
            onclick={handleClear}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
          >
            {t('clear')}
          </button>
        </div>
      </div>

      <!-- 输入输出区域 -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- 输入 -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label for="sort-input" class="text-sm text-gray-700 dark:text-gray-300">{t('input')}</label>
            <span class="text-xs text-gray-500 dark:text-gray-300">{inputLines} {t('sorter.lines')}</span>
          </div>
          <textarea
            id="sort-input"
            name="sortInput"
            bind:value={input}
            placeholder={t('sorter.placeholder')}
            class="w-full h-64 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:border-amber-500"></textarea>
        </div>

        <!-- 输出 -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label for="sort-output" class="text-sm text-gray-700 dark:text-gray-300">{t('output')}</label>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 dark:text-gray-300">{outputLines} {t('sorter.lines')}</span>
              <button
                onclick={handleCopy}
                disabled={!output}
                class={`px-2 py-1 text-xs rounded ${
                  copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                } disabled:opacity-50`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
          </div>
          <textarea
            id="sort-output"
            name="sortOutput"
            value={output}
            readOnly
            class="w-full h-64 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-gray-100 resize-none"></textarea>
        </div>
      </div>

      <!-- 说明 -->
      <div class="p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-xs text-gray-600 dark:text-gray-300">
        <div class="font-medium mb-1">{t('sorter.sortTypes')}</div>
        <ul class="list-disc list-inside space-y-1">
          <li><strong>{t('sorter.alphabetical')}</strong>: {t('sorter.alphabeticalDesc')}</li>
          <li><strong>{t('sorter.numerical')}</strong>: {t('sorter.numericalDesc')}</li>
          <li><strong>{t('sorter.natural')}</strong>: {t('sorter.naturalDesc')}</li>
          <li><strong>{t('sorter.byLength')}</strong>: {t('sorter.byLengthDesc')}</li>
        </ul>
      </div>
    </div>
  
