<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['code-complexity-analyzer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.code-complexity-analyzer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ComplexityResult {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  functions: Array<{
    name: string;
    line: number;
    cyclomaticComplexity: number;
    linesOfCode: number;
    parameters: number;
  }>;
  overallComplexity: number;
  maintainabilityIndex: number;
}

  let code = $state('');

  let language = $state('javascript');

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    return analyzeComplexity(code, language);
  });

  function handleClear() {
    code = '';
  }

  function loadExample() {
    code = EXAMPLE_CODE;
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Code {tCommon('input')}
          </label>
          <div class="flex gap-2 items-center">
            <select
              bind:value={language}
              class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
            </select>
            <button onclick={loadExample} class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {t('loadExample')}
            </button>
          </div>
        </div>
        <textarea
          bind:value={code}
          placeholder={t("inputPlaceholder")}
          class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button
        onclick={handleClear}
        class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
      >
        {tCommon('clear')}
      </button>

      <!-- Results -->
      {#if result}
<div class="space-y-6">
          <!-- Summary -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.totalLines}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('totalLines')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.codeLines}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('codeLines')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class={`text-2xl font-bold ${getComplexityColor(result.overallComplexity)}`}>
                {result.overallComplexity}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('totalComplexity')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class={`text-2xl font-bold ${getMaintainabilityColor(result.maintainabilityIndex)}`}>
                {result.maintainabilityIndex}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('maintainability')}</div>
            </div>
          </div>

          <!-- Line Breakdown -->
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('lineBreakdown')}</h3>
            <div class="flex gap-4">
              <div class="flex-1 bg-blue-100 dark:bg-blue-900/30 rounded p-2 text-center">
                <div class="text-lg font-medium text-blue-700 dark:text-blue-300">{result.codeLines}</div>
                <div class="text-xs text-blue-600 dark:text-blue-400">{t('code')}</div>
              </div>
              <div class="flex-1 bg-green-100 dark:bg-green-900/30 rounded p-2 text-center">
                <div class="text-lg font-medium text-green-700 dark:text-green-300">{result.commentLines}</div>
                <div class="text-xs text-green-600 dark:text-green-400">{t('comments')}</div>
              </div>
              <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded p-2 text-center">
                <div class="text-lg font-medium text-gray-700 dark:text-gray-300">{result.blankLines}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{t('blank')}</div>
              </div>
            </div>
          </div>

          <!-- Functions -->
          {#if result.functions.length > 0}
<div>
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('functions')} ({result.functions.length})
              </h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-gray-100 dark:bg-gray-700">
                      <th class="px-4 py-2 text-left">{t('function')}</th>
                      <th class="px-4 py-2 text-center">{t('line')}</th>
                      <th class="px-4 py-2 text-center">{t('complexity')}</th>
                      <th class="px-4 py-2 text-center">{t('loc')}</th>
                      <th class="px-4 py-2 text-center">{t('params')}</th>
                      <th class="px-4 py-2 text-center">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    {#each result.functions as func, idx (idx)}
<tr  class="bg-white dark:bg-gray-800">
                        <td class="px-4 py-2 font-mono">{func.name}</td>
                        <td class="px-4 py-2 text-center text-gray-500">{func.line}</td>
                        <td class={`px-4 py-2 text-center font-medium ${getComplexityColor(func.cyclomaticComplexity)}`}>
                          {func.cyclomaticComplexity}
                        </td>
                        <td class="px-4 py-2 text-center">{func.linesOfCode}</td>
                        <td class="px-4 py-2 text-center">{func.parameters}</td>
                        <td class="px-4 py-2 text-center">
                          {#if func.cyclomaticComplexity <= 10}
{'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>'}
{:else if func.cyclomaticComplexity <= 20}
{'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'}
{:else}
{'<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'}
{/if}
                        </td>
                      </tr>
{/each}
                  </tbody>
                </table>
              </div>
            </div>
{/if}

          <!-- Legend -->
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{t('complexityGuide')}</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><span class="text-green-600">1-5:</span> {t('simple')}</div>
              <div><span class="text-yellow-600">6-10:</span> {t('moderate')}</div>
              <div><span class="text-orange-600">11-20:</span> {t('complex')}</div>
              <div><span class="text-red-600">21+:</span> {t('veryComplex')}</div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
