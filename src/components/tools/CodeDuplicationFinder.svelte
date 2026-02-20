<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['code-duplication-finder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.code-duplication-finder.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface DuplicateBlock {
  lines: string[];
  occurrences: Array<{ start: number; end: number }>;
  similarity: number;
}

  let code = $state('');

  let minLines = $state(3);

  let result = $derived.by(() => {
    if (!code.trim()) return null;
    const duplicates = findDuplicates(code, minLines);
    const stats = calculateStats(code, duplicates);
    return { duplicates, stats };
  });

  function handleClear() { return code = ''; }

  function loadExample() { return code = EXAMPLE_CODE; }

</script>


    <div class="space-y-6">
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Code {tCommon('input')}</label>
          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {t('minLines')}:
              <input type="number" value={minLines} onchange={(e) => minLines = Math.max(2, parseInt(e.target.value) || 3)}
                min={2} max={10} class="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
            </label>
            <button onclick={loadExample} class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
          </div>
        </div>
        <textarea bind:value={code} placeholder={t("inputPlaceholder")}
          class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <button onclick={handleClear} class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {#if result}
<div class="space-y-6">
          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.stats.totalLines}</div>
              <div class="text-sm text-gray-500">{t('totalLines')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class={`text-2xl font-bold ${result.stats.duplicateLines > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.stats.duplicateLines}
              </div>
              <div class="text-sm text-gray-500">{t('duplicateLines')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div class={`text-2xl font-bold ${result.stats.duplicationPercentage > 20 ? 'text-red-600' : result.stats.duplicationPercentage > 10 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.stats.duplicationPercentage}%
              </div>
              <div class="text-sm text-gray-500">{t('duplication')}</div>
            </div>
          </div>

          {#if result.duplicates.length > 0}
<div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {t('foundDuplicateBlocks').replace('{count}', result.duplicates.length.toString())}
              </h3>
              {#each result.duplicates as dup, idx (idx)}
<div  class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-orange-800 dark:text-orange-300">
                      {dup.lines.length} {t('lines')} × {dup.occurrences.length} {t('occurrences')}
                    </span>
                    <span class="text-xs text-orange-600 dark:text-orange-400">
                      {t('linesLabel')}: {#each dup.occurrences as o}
`${o.start}-${o.end}`).join(', '
{/each}
                    </span>
                  </div>
                  <pre class="p-3 bg-white dark:bg-gray-900 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {dup.lines.join('\n')}
                  </pre>
                </div>
{/each}
              
              <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('refactoringSuggestions')}</h4>
                <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• {t('tip1')}</li>
                  <li>• {t('tip2')}</li>
                  <li>• {t('tip3')}</li>
                </ul>
              </div>
            </div>
{:else}
<div class="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></div>
              <p class="text-green-700 dark:text-green-300 font-medium">{t('noDuplicationFound')}</p>
            </div>
{/if}
        </div>
{/if}
    </div>
  
