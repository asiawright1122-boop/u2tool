<script lang="ts">
  import { EXAMPLE_SQL, parseSchema } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['database-schema-visualizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.database-schema-visualizer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Table {
  name: string;
  columns: Array<{ name: string; type: string; pk?: boolean; fk?: string }>;
}

  let sql = $state('');

  let tables = $derived.by(() => {
    if (!sql.trim()) return [];
    return parseSchema(sql);
  });

  function handleClear() { return sql = ''; }

  function loadExample() { return sql = EXAMPLE_SQL; }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sqlSchema')}</label>
          <button onclick={loadExample} class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea bind:value={sql} placeholder={t("inputPlaceholder")}
          class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if tables.length > 0}
<div class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('schemaVisualization')} ({tables.length} {t('tables')})</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each tables as table, idx (idx)}
<div  class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="bg-blue-600 text-white px-4 py-2 font-medium">{table.name}</div>
                <div class="divide-y divide-gray-200 dark:divide-gray-700">
                  {#each table.columns as col, cidx (cidx)}
<div  class="px-4 py-2 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        {#if col.pk}<span class="text-yellow-500" title="Primary Key"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg></span>{/if}
                        {#if col.fk}<span class="text-blue-500" title={`FK: ${col.fk}`}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>{/if}
                        <span class="font-mono text-sm text-gray-900 dark:text-white">{col.name}</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{col.type}</span>
                    </div>
{/each}
                </div>
              </div>
{/each}
          </div>

          <!-- Relationships -->
          {#if tables.some(t => t.columns.some(c => c.fk))}
<div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('relationships')}</h4>
              <div class="space-y-2">
                {#each tables as table}
                  {#each table.columns.filter(c => c.fk) as col}
                    <div class="flex items-center gap-2 text-sm">
                      <span class="font-mono text-blue-600 dark:text-blue-400">{table.name}.{col.name}</span>
                      <span class="text-gray-400">→</span>
                      <span class="font-mono text-green-600 dark:text-green-400">{col.fk}</span>
                    </div>
                  {/each}
                {/each}
              </div>
            </div>
{/if}
        </div>
{/if}
    </div>
  
