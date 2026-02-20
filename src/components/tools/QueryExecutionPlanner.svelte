<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['query-execution-planner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.query-execution-planner.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface PlanStep {
  operation: string;
  table?: string;
  cost: number;
  rows: number;
  details: string;
  warning?: string;
}

  let sql = $state('');

  let plan = $derived.by(() => {
    if (!sql.trim()) return [];
    return analyzeQuery(sql);
  });

  let totalCost = $derived(plan.reduce((sum, step) => sum + step.cost, 0));

  function handleClear() { return sql = ''; }

  function loadExample() { return sql = EXAMPLE_SQL; }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">SQL Query</label>
          <button onclick={loadExample} class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea bind:value={sql} placeholder={t("inputPlaceholder")}
          class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if plan.length > 0}
<div class="space-y-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{totalCost}</div>
            <div class="text-sm text-gray-500">Estimated Total Cost</div>
          </div>

          <div class="space-y-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Execution Plan</h3>
            {#each plan as step, idx (idx)}
<div  class={`p-4 rounded-lg border ${step.warning ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'}`}>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-3">
                    <span class="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs rounded-full">{idx + 1}</span>
                    <span class="font-medium text-gray-900 dark:text-white">{step.operation}</span>
                    {#if step.table}
<span class="text-sm text-gray-500">on {step.table}</span>
{/if}
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">Cost: {step.cost}</div>
                    <div class="text-xs text-gray-500">~{step.rows} rows</div>
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{step.details}</p>
                {#if step.warning}
<p class="text-sm text-yellow-700 dark:text-yellow-400 mt-2">⚠️ {step.warning}</p>
{/if}
              </div>
{/each}
          </div>

          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-400">
              <strong>Note:</strong> This is a simplified execution plan analysis. 
              For accurate plans, use EXPLAIN ANALYZE in your database client.
            </p>
          </div>
        </div>
{/if}
    </div>
  
