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

  // Types
  type Command = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE TABLE';

  let command = $state('SELECT');

  let tableName = $state('users');

  let columns = $state('id, name, email, created_at');

  let where = $state('active = 1');

  let orderBy = $state('id DESC');

  let limit = $state('10');

  let values = $state("'John Doe', 'john@example.com', NOW()");

  let updates = $state("status = 'active', updated_at = NOW()");

  let tableSchema = $state(`id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE,
status ENUM('active', 'inactive') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);

  // Functions
  function generateSql() {
    switch (command) {
      case 'SELECT':
        return `SELECT ${columns}
FROM ${tableName}
WHERE ${where}
ORDER BY ${orderBy}
LIMIT ${limit};`;
      case 'INSERT':
        return `INSERT INTO ${tableName} (${columns})
VALUES (${values});`;
      case 'UPDATE':
        return `UPDATE ${tableName}
SET ${updates}
WHERE ${where};`;
      case 'DELETE':
        return `DELETE FROM ${tableName}
WHERE ${where};`;
      case 'CREATE TABLE':
        return `CREATE TABLE ${tableName} (
${tableSchema.split('\n').map(line => '  ' + line.trim()).join('\n')}
);`;
      default:
        return '';
    }
  }

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{t('sqlGenerator.commandType')}</div>
        <div class="flex flex-wrap gap-2 mb-6">
          {#each (['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE TABLE'] as Command[]) as cmd (cmd)}
<button 
              onclick={() => command = cmd}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                command === cmd
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cmd}
            </button>
{/each}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label for="sql-generator-field-18" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.tableName')}</label>
              <input
                type="text"
                bind:value={tableName}
                class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-18" />
            </div>

            {#if command !== 'DELETE'}
{#if command !== 'CREATE TABLE'}
              <div>
                <label for="sql-generator-field-17" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.columns')}</label>
                <input
                  type="text"
                  bind:value={columns}
                  class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-17" />
              </div>
            {/if}
{/if}

            {#if command === 'INSERT'}
<div>
                <label for="sql-generator-field-16" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.values')}</label>
                <input
                  type="text"
                  bind:value={values}
                  class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-16" />
              </div>
{/if}

            {#if command === 'UPDATE'}
<div>
                <label for="sql-generator-field-15" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.setUpdates')}</label>
                <input
                  type="text"
                  bind:value={updates}
                  class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-15" />
              </div>
{/if}

            {#if command === 'CREATE TABLE'}
<div>
                <label for="sql-generator-field-14" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.schemaDefinition')}</label>
                <textarea
                  bind:value={tableSchema}
                  rows={6}
                  class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-14"></textarea>
              </div>
{/if}

            {#if command === 'SELECT' || command === 'UPDATE' || command === 'DELETE'}
<div>
                <label for="sql-generator-field-13" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.whereClause')}</label>
                <input
                  type="text"
                  bind:value={where}
                  class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-13" />
              </div>
{/if}

            {#if command === 'SELECT'}
<div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="sql-generator-field-12" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.orderBy')}</label>
                  <input
                    type="text"
                    bind:value={orderBy}
                    class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-12" />
                </div>
                <div>
                  <label for="sql-generator-field-11" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('sqlGenerator.limit')}</label>
                  <input
                    type="text"
                    bind:value={limit}
                    class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono" id="sql-generator-field-11" />
                </div>
              </div>
{/if}
          </div>

          <div>
             <div class="flex justify-between items-center mb-2">
              <div class="tool-label">{t('sqlGenerator.generatedSql')}</div>
              <button
                onclick={() => navigator.clipboard.writeText(generateSql())}
                class="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300"
              >
                {t('sqlGenerator.copySql')}
              </button>
            </div>
            <textarea
              readOnly
              value={generateSql()}
              rows={16}
              class="w-full bg-gray-900 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-green-600 dark:text-green-400 font-mono text-sm leading-relaxed"></textarea>
          </div>
        </div>
      </div>
    </div>
  
