<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sql-query-optimizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sql-query-optimizer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface OptimizationResult {
  original: string;
  optimized: string;
  suggestions: Array<{ type: 'warning' | 'info' | 'improvement'; message: string; fix?: string }>;
  score: number;
}

  let sql = $state('');

  let copied = $state(false);

  let result = $derived.by(() => {
    if (!sql.trim()) return null;
    return optimizeSQL(sql);
  });

  function handleClear() { return sql = ''; }

  function loadExample() { return sql = EXAMPLE_SQL; }

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result.optimized);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

  // Functions
  function getTypeColor(type: string) {
    switch (type) {
      case 'warning': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'improvement': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sqlQuery')}</label>
          <button onclick={loadExample} class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea bind:value={sql} placeholder={t("inputPlaceholder")}
          class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if result}
<div class="space-y-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div class={`text-3xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {result.score}/100
            </div>
            <div class="text-sm text-gray-500">{t('queryPerformanceScore')}</div>
          </div>

          {#if result.suggestions.length > 0}
<div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('optimizationSuggestions')}</h3>
              {#each result.suggestions as s, idx (idx)}
<div  class={`p-3 rounded-lg border ${getTypeColor(s.type)}`}>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg">{s.type === 'warning' ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>' : s.type === 'improvement' ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>' : 'ℹ'}</span>
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{s.message}</span>
                  </div>
                  {#if s.fix}
<p class="text-sm text-gray-600 dark:text-gray-400 ml-7">{t('fix')}: {s.fix}</p>
{/if}
                </div>
{/each}
            </div>
{/if}

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('formattedQuery')}</label>
              <button onclick={handleCopy} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {result.optimized}
            </pre>
          </div>
        </div>
{/if}
    </div>
  
