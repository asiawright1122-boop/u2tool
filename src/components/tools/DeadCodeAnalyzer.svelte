<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['dead-code-analyzer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.dead-code-analyzer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface DeadCodeItem {
  type: 'function' | 'variable' | 'class' | 'export';
  name: string;
  line: number;
  code: string;
  reason: string;
}

  let code = $state('');

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    return analyzeDeadCode(code);
  });

  function handleClear() { return code = ''; }

  function loadExample() { return code = EXAMPLE_CODE; }

  // Functions
  function getTypeColor(type: string) {
    switch (type) {
      case 'function': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300';
      case 'variable': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300';
      case 'class': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Code {tCommon('input')}</label>
          <button onclick={loadExample} class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea bind:value={code} placeholder={t("inputPlaceholder")}
          class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if result}
<div class="space-y-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="text-center">
              <div class={`text-3xl font-bold ${result.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.length}
              </div>
              <div class="text-sm text-gray-500">{t('deadCodeItemsFound')}</div>
            </div>
          </div>

          {#if result.length > 0}
<div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('deadCodeAnalysis')}</h3>
              {#each result as item, idx (idx)}
<div  class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div class="flex items-center gap-2 mb-2">
                    <span class={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <span class="font-mono font-medium text-gray-900 dark:text-white">{item.name}</span>
                    <span class="text-xs text-gray-500">{t('line')} {item.line}</span>
                  </div>
                  <code class="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 font-mono text-gray-700 dark:text-gray-300">
                    {item.code}
                  </code>
                  <p class="text-sm text-orange-700 dark:text-orange-400">{item.reason}</p>
                </div>
{/each}
              
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('recommendations')}</h4>
                <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• {t('tip1')}</li>
                  <li>• {t('tip2')}</li>
                  <li>• {t('tip3')}</li>
                  <li>• {t('tip4')}</li>
                </ul>
              </div>
            </div>
{:else}
<div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></div>
              <p class="text-green-700 dark:text-green-300 font-medium">{t('noDeadCodeDetected')}</p>
            </div>
{/if}
        </div>
{/if}
    </div>
  
