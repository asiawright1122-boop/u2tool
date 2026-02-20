<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['memory-leak-detector'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.memory-leak-detector.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface LeakResult {
  issues: Array<{
    type: string;
    severity: 'high' | 'medium' | 'low';
    line: number;
    code: string;
    description: string;
    fix: string;
  }>;
  score: number;
}

  let code = $state('');

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    return detectMemoryLeaks(code);
  });

  function handleClear() { return code = ''; }

  function loadExample() { return code = EXAMPLE_CODE; }

  // Functions
  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-800';
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
          <div class="flex items-center gap-6">
            <div class={`p-6 rounded-lg text-center ${result.score >= 80 ? 'bg-green-50 dark:bg-green-900/20' : result.score >= 50 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div class={`text-4xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {result.score}
              </div>
              <div class="text-sm text-gray-500">Memory Safety Score</div>
            </div>
            <div class="flex-1 grid grid-cols-3 gap-4">
              <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <div class="text-xl font-bold text-red-600">{result.issues.filter(i => i.severity === 'high').length}</div>
                <div class="text-xs text-red-500">High</div>
              </div>
              <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <div class="text-xl font-bold text-yellow-600">{result.issues.filter(i => i.severity === 'medium').length}</div>
                <div class="text-xs text-yellow-500">Medium</div>
              </div>
              <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <div class="text-xl font-bold text-blue-600">{result.issues.filter(i => i.severity === 'low').length}</div>
                <div class="text-xs text-blue-500">Low</div>
              </div>
            </div>
          </div>

          {#if result.issues.length > 0}
<div class="space-y-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Potential Memory Leaks</h3>
              {#each result.issues as issue, idx (idx)}
<div  class={`p-4 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-medium text-gray-900 dark:text-white">{issue.type}</span>
                    <span class="text-xs text-gray-500">Line {issue.line}</span>
                  </div>
                  <code class="block text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mb-2 font-mono">{issue.code}</code>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                  <p class="text-sm text-green-600 dark:text-green-400 mt-2">💡 {issue.fix}</p>
                </div>
{/each}
            </div>
{:else}
<div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div class="text-4xl mb-2">✅</div>
              <p class="text-green-700 dark:text-green-300 font-medium">No potential memory leaks detected!</p>
            </div>
{/if}
        </div>
{/if}
    </div>
  
