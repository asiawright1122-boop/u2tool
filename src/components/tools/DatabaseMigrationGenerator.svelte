<script lang="ts">
  import { DATA_TYPES, generatePrisma, generateRawSQL, generateTypeORM } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['database-migration-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.database-migration-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Database = 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  type Framework = 'raw' | 'prisma' | 'typeorm' | 'sequelize' | 'knex';
  interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue: string;
  foreignKey: string;
}

  let tableName = $state('users');

  let database = $state('postgresql');

  let framework = $state('raw');

  let action = $state('create');

  let columns = $state([
    { id: '1', name: 'id', type: 'SERIAL', nullable: false, primaryKey: true, unique: false, defaultValue: '', foreignKey: '' },
    { id: '2', name: 'email', type: 'VARCHAR(255)', nullable: false, primaryKey: false, unique: true, defaultValue: '', foreignKey: '' },
    { id: '3', name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false, unique: false, defaultValue: 'NOW()', foreignKey: '' },
  ] as Column[]);

  let copied = $state(false);

  function addColumn() {
    columns = [...columns, {
      id: Date.now().toString(),
      name: '',
      type: DATA_TYPES[database][0],
      nullable: true,
      primaryKey: false,
      unique: false,
      defaultValue: '',
      foreignKey: '',
    }];
  }

  function removeColumn(id: string) {
    columns = columns.filter(c => c.id !== id);
  }

  function updateColumn(id: string, field: keyof Column, value: string | boolean) {
    columns = columns.map(c => c.id === id ? { ...c, [field]: value } : c);
  }

  let result = $derived.by(() => {
    if (!tableName || columns.length === 0) return '';
    
    switch (framework) {
      case 'raw':
        return generateRawSQL(tableName, columns, database, action);
      case 'prisma':
        return generatePrisma(tableName, columns);
      case 'typeorm':
        return generateTypeORM(tableName, columns);
      default:
        return generateRawSQL(tableName, columns, database, action);
    }
  });

  function handleCopy() {
    navigator.clipboard.writeText(result);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Options -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tableName')}</label>
          <input
            type="text"
            bind:value={tableName}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('database')}</label>
          <select
            value={database}
            onchange={(e) => database = e.target.value as Database}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('framework')}</label>
          <select
            value={framework}
            onchange={(e) => framework = e.target.value as Framework}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="raw">{t('rawSql')}</option>
            <option value="prisma">Prisma</option>
            <option value="typeorm">TypeORM</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('action')}</label>
          <select
            value={action}
            onchange={(e) => action = e.target.value as 'create' | 'alter'}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="create">{t('createTable')}</option>
            <option value="alter">{t('alterTable')}</option>
          </select>
        </div>
      </div>

      <!-- Columns -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">{t('columns')}</label>
          <button
            onclick={addColumn}
            class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {t('addColumn')}
          </button>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          {#each columns as col (col.id)}
<div  class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <input
                type="text"
                value={col.name}
                onchange={(e) => updateColumn(col.id, 'name', e.target.value)}
                placeholder={t("columnNamePlaceholder")}
                class="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <select
                value={col.type}
                onchange={(e) => updateColumn(col.id, 'type', e.target.value)}
                class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {#each DATA_TYPES[database] as type (type)}
<option  value={type}>{type}</option>
{/each}
              </select>
              <label class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={col.primaryKey} onchange={(e) => updateColumn(col.id, 'primaryKey', e.target.checked)} class="rounded" />
                {t('pk')}
              </label>
              <label class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={col.nullable} onchange={(e) => updateColumn(col.id, 'nullable', e.target.checked)} class="rounded" />
                {t('nullable')}
              </label>
              <label class="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={col.unique} onchange={(e) => updateColumn(col.id, 'unique', e.target.checked)} class="rounded" />
                {t('unique')}
              </label>
              <button onclick={() => removeColumn(col.id)} class="text-red-500 hover:text-red-600">✕</button>
            </div>
{/each}
        </div>
      </div>

      <!-- Result -->
      {#if result}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label">
              {t('generatedMigration')}
            </label>
            <button onclick={handleCopy} class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400">
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-80">
            {result}
          </pre>
        </div>
{/if}
    </div>
  
