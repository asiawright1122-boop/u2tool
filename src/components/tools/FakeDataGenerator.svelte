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

  interface LocaleOption {
    value: string;
    label: string;
  }

  const FIELD_TYPES: FieldType[] = [
    'name',
    'firstName',
    'lastName',
    'email',
    'phone',
    'address',
    'city',
    'country',
    'company',
    'jobTitle',
    'date',
    'number',
    'uuid',
    'url',
    'username',
  ];

  const LOCALES: LocaleOption[] = [
    { value: 'en', label: 'English' },
    { value: 'zh', label: '简体中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'pt', label: 'Português' },
    { value: 'ru', label: 'Русский' },
    { value: 'ar', label: 'العربية' },
  ];

  const TYPE_DISPLAY_NAMES: Record<string, Record<FieldType, string>> = {
    en: {
      name: 'Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country',
      company: 'Company',
      jobTitle: 'Job Title',
      date: 'Date',
      number: 'Number',
      uuid: 'UUID',
      url: 'URL',
      username: 'Username',
    },
    zh: {
      name: '姓名',
      firstName: '名',
      lastName: '姓',
      email: '邮箱',
      phone: '电话',
      address: '地址',
      city: '城市',
      country: '国家',
      company: '公司',
      jobTitle: '职位',
      date: '日期',
      number: '数字',
      uuid: 'UUID',
      url: '链接',
      username: '用户名',
    },
  };

  const FIRST_NAMES: Record<string, string[]> = {
    en: ['Alex', 'Jordan', 'Taylor', 'Casey', 'Sam', 'Maya', 'Chris', 'Morgan'],
    zh: ['张', '李', '王', '刘', '陈', '杨', '赵', '周'],
  };

  const LAST_NAMES: Record<string, string[]> = {
    en: ['Smith', 'Johnson', 'Brown', 'Miller', 'Wilson', 'Taylor', 'Clark', 'Lee'],
    zh: ['伟', '芳', '娜', '敏', '静', '磊', '洋', '强'],
  };

  const CITY_BY_LOCALE: Record<string, string[]> = {
    en: ['New York', 'Los Angeles', 'Chicago', 'Seattle', 'Austin', 'Boston'],
    zh: ['北京', '上海', '广州', '深圳', '杭州', '成都'],
  };

  const COUNTRY_BY_LOCALE: Record<string, string[]> = {
    en: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Japan'],
    zh: ['中国', '日本', '韩国', '新加坡', '美国', '英国'],
  };

  const COMPANY_SAMPLES = ['Acme Labs', 'Nova Tech', 'Blue Ocean', 'Pioneer AI', 'Cloud Peak', 'Vertex Soft'];
  const JOB_TITLE_SAMPLES = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Consultant', 'Director'];
  const ADDRESS_SAMPLES = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 River Dr', '654 Lake Blvd'];
  const EMAIL_DOMAINS = ['example.com', 'mail.com', 'demo.io', 'sample.net', 'u2tool.com'];

  function normalizeLocaleKey(input: string): string {
    const normalized = (input || 'en').toLowerCase();
    const short = normalized.split('-')[0];
    return TYPE_DISPLAY_NAMES[short] ? short : 'en';
  }

  function getFieldNames(localeKey: string): Record<FieldType, string> {
    return TYPE_DISPLAY_NAMES[normalizeLocaleKey(localeKey)] || TYPE_DISPLAY_NAMES.en;
  }

  function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickOne(items: string[]): string {
    if (items.length === 0) return '';
    return items[randomInt(0, items.length - 1)];
  }

  function randomUuid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
      const r = Math.floor(Math.random() * 16);
      const v = char === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function normalizeName(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '');
  }

  function generateFirstName(localeKey: string): string {
    const key = normalizeLocaleKey(localeKey);
    return pickOne(FIRST_NAMES[key] || FIRST_NAMES.en);
  }

  function generateLastName(localeKey: string): string {
    const key = normalizeLocaleKey(localeKey);
    return pickOne(LAST_NAMES[key] || LAST_NAMES.en);
  }

  function generateFullName(localeKey: string): string {
    const key = normalizeLocaleKey(localeKey);
    const first = generateFirstName(key);
    const last = generateLastName(key);
    return key === 'zh' ? `${first}${last}` : `${first} ${last}`;
  }

  const GENERATORS: Record<FieldType, (localeKey: string) => string> = {
    name: (localeKey) => generateFullName(localeKey),
    firstName: (localeKey) => generateFirstName(localeKey),
    lastName: (localeKey) => generateLastName(localeKey),
    email: (localeKey) => {
      const name = normalizeName(generateFullName(localeKey)).replace(/\.+/g, '.');
      return `${name || `user${randomInt(1000, 9999)}`}@${pickOne(EMAIL_DOMAINS)}`;
    },
    phone: (localeKey) => normalizeLocaleKey(localeKey) === 'zh'
      ? `1${randomInt(30, 99)}${randomInt(10000000, 99999999)}`
      : `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    address: () => pickOne(ADDRESS_SAMPLES),
    city: (localeKey) => {
      const key = normalizeLocaleKey(localeKey);
      return pickOne(CITY_BY_LOCALE[key] || CITY_BY_LOCALE.en);
    },
    country: (localeKey) => {
      const key = normalizeLocaleKey(localeKey);
      return pickOne(COUNTRY_BY_LOCALE[key] || COUNTRY_BY_LOCALE.en);
    },
    company: () => pickOne(COMPANY_SAMPLES),
    jobTitle: () => pickOne(JOB_TITLE_SAMPLES),
    date: () => {
      const start = new Date('2020-01-01').getTime();
      const end = new Date('2030-12-31').getTime();
      return new Date(randomInt(start, end)).toISOString().slice(0, 10);
    },
    number: () => String(randomInt(1, 100000)),
    uuid: () => randomUuid(),
    url: () => `https://example.com/item/${randomInt(1000, 9999)}`,
    username: (localeKey) => {
      const first = normalizeName(generateFirstName(localeKey));
      const last = normalizeName(generateLastName(localeKey));
      return `${first}${last}${randomInt(10, 99)}`;
    },
  };

  let count = $state(10);

  let previousLocale = $state(locale);
  const initialFieldNames = getFieldNames(locale);

  let fields = $state<Field[]>([
    { id: '1', name: initialFieldNames.name, type: 'name' },
    { id: '2', name: initialFieldNames.email, type: 'email' },
    { id: '3', name: initialFieldNames.phone, type: 'phone' },
  ]);

  let data = $state([] as Record<string, string>[]);

  let tableName = $state('users');

  let copied = $state(false);

  let editingCell = $state<{ row: number; field: string } | null>(null);

  let editValue = $state('');

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  function handleGenerate() {
    const generated: Record<string, string>[] = [];
    const activeLocale = normalizeLocaleKey(locale);
    for (let i = 0; i < count; i++) {
      const record: Record<string, string> = {};
      for (const field of fields) {
        record[field.name] = GENERATORS[field.type](activeLocale);
      }
      generated.push(record);
    }
    data = generated;
  }

  $effect(() => {
    const previousNames = getFieldNames(previousLocale);
    const currentNames = getFieldNames(locale);

    if (normalizeLocaleKey(previousLocale) === normalizeLocaleKey(locale)) {
      return;
    }

    let changed = false;
    const nextFields = fields.map((field) => {
      const previousDefault = previousNames[field.type];
      if (field.name === previousDefault) {
        changed = true;
        return { ...field, name: currentNames[field.type] };
      }
      return field;
    });

    if (changed) {
      fields = nextFields;
    }

    previousLocale = locale;
  });

  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function addField() {
    const id = Date.now().toString();
    const fieldNames = getFieldNames(locale);
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
        const fieldNames = getFieldNames(locale);
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
          <label for="fake-data-generator-field-8" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('count')}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onchange={(e) => count = Math.min(1000, Math.max(1, parseInt(e.target.value) || 1))}
            class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" id="fake-data-generator-field-8" />
        </div>
        <div>
          <label for="fake-data-generator-field-7" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('locale')}
          </label>
          <select
            bind:value={locale}
            class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" id="fake-data-generator-field-7">
            {#each LOCALES as l (l.value)}
<option  value={l.value}>{l.label}</option>
{/each}
          </select>
        </div>
      </div>

      <!-- Fields Configuration -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fields')}
          </div>
          <button
            onclick={addField}
            class="text-sm px-3 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50"
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
                      {getFieldNames(locale)[type]}
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
        <label for="fake-data-generator-field-6" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('tableName')} (SQL)
        </label>
        <input
          type="text"
          bind:value={tableName}
          class="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" id="fake-data-generator-field-6" />
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
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('preview')} ({data.length})
            </div>
            <div class="flex gap-2">
              <button
                onclick={handleCopy}
                class={`text-sm px-3 py-1 rounded ${
                  copied
                    ? 'btn-success'
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
                            class="w-full px-2 py-1 border border-amber-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
{:else}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
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

