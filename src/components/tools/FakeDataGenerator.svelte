<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['fake-data-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.fake-data-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type FieldType = 'name' | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'country' | 'company' | 'jobTitle' | 'date' | 'number' | 'uuid' | 'url' | 'username';
  interface Field {
  id: string;
  name: string;
  type: FieldType;
}

  let mounted = $state(false);

  let count = $state(10);

  // Removed duplicate declaration of 'locale' (already in props)

  let fields = $state([
    { id: '1', name: 'name', type: 'name' },
    { id: '2', name: 'email', type: 'email' },
    { id: '3', name: 'phone', type: 'phone' },
  ]);

  let data = $state([] as Record<string, string>[]);

  let tableName = $state('users');

  let copied = $state(false);

  let editingCell = $state(null);

  let editValue = $state('');

  let timerRef = $state(null);

  function handleGenerate() {
    const generated: Record<string, string>[] = [];
    for (let i = 0; i < count; i++) {
      const record: Record<string, string> = {};
      for (const field of fields) {
        record[field.name] = generators[field.type](locale);
      }
      generated.push(record);
    }
    data = generated;
  }

  $effect(() => {
    mounted = true;
  });

  $effect(() => {
    const fieldNames = FIELD_NAMES[locale] || FIELD_NAMES.en;
    fields = fields.map(f => ({ ...f, name: fieldNames[f.type] || f.name }));
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function addField() {
    const id = Date.now().toString();
    const fieldNames = FIELD_NAMES[locale] || FIELD_NAMES.en;
    fields = [...fields, { id, name: fieldNames.name, type: 'name' }];
  }
  function removeField(id: string) {
    fields = fields.filter(f => f.id !== id);
  }
  function updateField(id: string, updates: Partial<Field>) {
    fields = fields.map(f => {
      if (f.id !== id) return f;
      // If type changes, update name to match the new type
      if (updates.type && updates.type !== f.type) {
        const fieldNames = FIELD_NAMES[locale] || FIELD_NAMES.en;
        return { ...f, ...updates, name: fieldNames[updates.type] };
      }
      return { ...f, ...updates };
    });
  }
  function handleClear() { return data = []; }
  function startEditing(rowIndex: number, fieldName: string, currentValue: string) {
    editingCell = { row: rowIndex, field: fieldName };
    editValue = currentValue;
  }
  function saveEdit() {
    if (editingCell) {
      data = data.map((row, idx) => 
        idx === editingCell.row ? { ...row, [editingCell.field]: editValue } : row
      );
      editingCell = null;
      editValue = '';
    }
  }
  function cancelEdit() {
    editingCell = null;
    editValue = '';
  }
  function exportJson() {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportCsv() {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${row[h]}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportSql() {
    if (data.length === 0) return;
    const columns = Object.keys(data[0]);
    const values = data.map(row => {
      const vals = columns.map(c => `'${row[c].replace(/'/g, "''")}'`);
      return `(${vals.join(', ')})`;
    });
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')})\nVALUES\n${values.join(',\n')};`;
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.sql';
    a.click();
    URL.revokeObjectURL(url);
  }
  async function handleCopy() {
    const json = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(json);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <!-- Configuration Section - Two columns with equal width -->
      <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('count')}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onchange={(e) => count = Math.min(1000, Math.max(1, parseInt(e.target.value) || 1))}
            class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('locale')}
          </label>
          <select
            bind:value={locale}
            class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {#each LOCALES as l (l.value)}
<option  value={l.value}>{l.label}</option>
{/each}
          </select>
        </div>
      </div>

      <!-- Fields Configuration -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fields')}
          </label>
          <button
            onclick={addField}
            class="text-sm px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            {t('addField')}
          </button>
        </div>
        <div class="space-y-2">
          {#each fields as field (field.id)}
<div  class="grid grid-cols-2 gap-2 items-center">
              <input
                type="text"
                value={field.name}
                onchange={(e) => updateField(field.id, { name: e.target.value })}
                placeholder={t('fieldName')}
                class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <div class="flex gap-2">
                <select
                  value={field.type}
                  onchange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                  class="flex-1 h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {#each FIELD_TYPES as type (type)}
<option  value={type}>
                      {mounted ? (TYPE_DISPLAY_NAMES[locale] || TYPE_DISPLAY_NAMES.en)[type] : TYPE_DISPLAY_NAMES.en[type]}
                    </option>
{/each}
                </select>
                <button
                  onclick={() => removeField(field.id)}
                  class="h-10 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg whitespace-nowrap"
                  disabled={fields.length <= 1}
                >
                  {t('removeField')}
                </button>
              </div>
            </div>
{/each}
        </div>
      </div>

      <!-- Table Name for SQL Export -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('tableName')} (SQL)
        </label>
        <input
          type="text"
          bind:value={tableName}
          class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button onclick={handleGenerate} class="btn-primary">
          {t('generate')}
        </button>
        <button onclick={handleClear} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Results Section -->
      {#if data.length > 0}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('preview')} ({data.length})
            </label>
            <div class="flex gap-2">
              <button
                onclick={handleCopy}
                class={`text-sm px-3 py-1 rounded ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                {copied ? tg('copied') : tg('copy')}
              </button>
              <button
                onclick={exportJson}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportJson')}
              </button>
              <button
                onclick={exportCsv}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportCsv')}
              </button>
              <button
                onclick={exportSql}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportSql')}
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">#</th>
                  {#each fields as field (field.id)}
<th  class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      {field.name}
                    </th>
{/each}
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each data.slice(0, 20) as row, index (index)}
<tr >
                    <td class="px-4 py-2 text-gray-500 dark:text-gray-400">{index + 1}</td>
                    {#each fields as field (field.id)}
<td  class="px-1 py-1">
                        {#if editingCell?.row === index && editingCell?.field === field.name}
<input
                            type="text"
                            bind:value={editValue}
                            onblur={saveEdit}
                            onkeydown={(e) => {
                              if (e.key === 'Enter') {
                                saveEdit();
                              } else if (e.key === 'Escape') {
                                cancelEdit();
                              }
                            }}
                            autoFocus
                            class="w-full px-2 py-1 border border-blue-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
{:else}
<div
                            onclick={() => startEditing(index, field.name, row[field.name] || '')}
                            class="px-3 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-gray-100 min-h-[28px]"
                            title={t('clickToEdit')}
                          >
                            {row[field.name]}
                          </div>
{/if}
                      </td>
{/each}
                  </tr>
{/each}
              </tbody>
            </table>
            {#if data.length > 20}
<div class="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                ... and {data.length - 20} more rows
              </div>
{/if}
          </div>
        </div>
{/if}
    </div>
  
