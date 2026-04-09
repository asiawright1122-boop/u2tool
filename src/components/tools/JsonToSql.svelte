<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formatValue, getSqlType, quoteIdentifier } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-sql'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-sql.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  export interface JsonToSqlOptions {
  tableName: string;
  includeCreate: boolean;
  dialect: 'mysql' | 'postgresql' | 'sqlite';
}

  let input = $state('');

  let output = $state('');

  let tableName = $state('my_table');

  let includeCreate = $state(true);

  let dialect = $state('mysql');

  let error = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);

  function handleConvert() {
    error = null;
    try {
      const sql = jsonToSql(input, { tableName, includeCreate, dialect });
      output = sql;
    } catch (_e) {
      error = _e instanceof Error ? _e.message : tg('errorProcessing');
      output = '';
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  export function jsonToSql(jsonStr: string, options: JsonToSqlOptions): string {
  const { tableName, includeCreate, dialect } = options;
  
  let data: Record<string, unknown>[];
  try {
    const parsed = JSON.parse(jsonStr);
    data = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    throw new Error('Invalid JSON');
  }
  
  if (data.length === 0) {
    throw new Error('Empty data');
  }
  
  // 获取所有列名
  const columns = new Set<string>();
  data.forEach(row => {
    Object.keys(row).forEach(key => columns.add(key));
  });
  const columnList = Array.from(columns);
  
  const lines: string[] = [];
  
  // CREATE TABLE 语句
  if (includeCreate) {
    const columnDefs = columnList.map(col => {
      const sampleValue = data.find(row => row[col] !== undefined)?.[col];
      const sqlType = getSqlType(sampleValue, dialect);
      return `  ${quoteIdentifier(col, dialect)} ${sqlType}`;
    });
    
    lines.push(`CREATE TABLE ${quoteIdentifier(tableName, dialect)} (`);
    lines.push(columnDefs.join(',\n'));
    lines.push(');');
    lines.push('');
  }

  // INSERT 语句
  const quotedColumns = columnList.map(col => quoteIdentifier(col, dialect)).join(', ');
  
  data.forEach(row => {
    const values = columnList.map(col => formatValue(row[col], dialect));
    lines.push(`INSERT INTO ${quoteIdentifier(tableName, dialect)} (${quotedColumns}) VALUES (${values.join(', ')});`);
  });
  
  return lines.join('\n');
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
    error = null;
  }
  function loadExample() {
    input = JSON.stringify([
      { id: 1, name: "Alice", email: "alice@example.com", age: 25, active: true },
      { id: 2, name: "Bob", email: "bob@example.com", age: 30, active: false },
      { id: 3, name: "Charlie", email: "charlie@example.com", age: 35, active: true }
    ], null, 2);
  }

</script>


    <div class="space-y-4">
      <!-- 控制面板 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('tableName')}</label>
            <input
              type="text"
              bind:value={tableName}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('dialect')}</label>
            <select
              value={dialect}
              onchange={(e) => dialect = e.target.value as 'mysql' | 'postgresql' | 'sqlite'}
              class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-4 items-center">
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
            <input
              type="checkbox"
              bind:checked={includeCreate}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('includeCreate')}
          </label>
          
          <div class="flex gap-2 ml-auto">
            <button onclick={handleConvert} class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium">
              {tg('convert')}
            </button>
            <button onclick={loadExample} class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm">
              {t('loadExample')}
            </button>
            <button onclick={handleClear} class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm">
              {tg('clear')}
            </button>
          </div>
        </div>
      </div>


      <!-- 输入输出区域 -->
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">JSON {tg('input')}</label>
          <textarea
            bind:value={input}
            placeholder={t('inputPlaceholder')}
            class="w-full h-64 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:border-blue-500"></textarea>
        </div>
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">SQL {tg('output')}</label>
            <button
              onclick={handleCopy}
              disabled={!output}
              class={`px-2 py-1 text-xs rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'} disabled:opacity-50`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <textarea
            value={error || output}
            readOnly
            class={`w-full h-64 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white resize-none ${error ? 'text-red-600 dark:text-red-400' : ''}`}></textarea>
        </div>
      </div>
    </div>
  
