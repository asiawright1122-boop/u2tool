<script lang="ts">
  import { analyzeKeywordDensity } from '@/lib/popular-tools-batch3-remaining';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['keyword-density-checker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.keyword-density-checker.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let text = $state('');

  let minLength = $state('3');

  let excludeCommon = $state(true);

  let analysis = $derived.by(() => {
    const minLen = parseInt(minLength) || 3;

    return analyzeKeywordDensity(text, minLen, excludeCommon);
  });

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <label for="keyword-density-checker-field-4" class="tool-label">
          {t('enterText')}
        </label>
        <textarea
          bind:value={text}
          placeholder={tc('inputPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" id="keyword-density-checker-field-4"></textarea>
      </div>

      <!-- Options -->
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label for="keyword-density-checker-field-3" class="text-sm text-gray-600 dark:text-gray-400">{t('minLength')}:</label>
          <input
            type="number"
            bind:value={minLength}
            min="1"
            max="10"
            class="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm" id="keyword-density-checker-field-3" />
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={excludeCommon}
            class="rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">{t('excludeCommon')}</span>
        </label>
      </div>

      <!-- Stats -->
      {#if analysis}
<div>

          <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {analysis.totalWords}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalWords')}</div>
            </div>
          </div>

          <!-- Single Keywords -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{t('topKeywords')}</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-600">
                    <th class="px-3 py-2 text-left">{t('keyword')}</th>
                    <th class="px-3 py-2 text-right">{t('count')}</th>
                    <th class="px-3 py-2 text-right">{t('density')}</th>
                    <th class="px-3 py-2">{t('visual')}</th>
                  </tr>
                </thead>
                <tbody>
                  {#each analysis.results.slice(0, 20) as item, idx (idx)}
<tr  class="border-b border-gray-100 dark:border-gray-700">
                      <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{item.word}</td>
                      <td class="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{item.count}</td>
                      <td class="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{item.density.toFixed(2)}%</td>
                      <td class="px-3 py-2 w-32">
                        <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            class="h-full bg-amber-500 rounded-full"
                            style="width: {Math.min(item.density * 10, 100)}%"></div>
                        </div>
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- 2-Word Phrases -->
          {#if analysis.topPhrases2.length > 0}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{t('twoWordPhrases')}</h3>
              <div class="flex flex-wrap gap-2">
                {#each analysis.topPhrases2 as [phrase, count], idx (idx)}
<span  class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                    {phrase} ({count})
                  </span>
{/each}
              </div>
            </div>
{/if}

          <!-- 3-Word Phrases -->
          {#if analysis.topPhrases3.length > 0}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{t('threeWordPhrases')}</h3>
              <div class="flex flex-wrap gap-2">
                {#each analysis.topPhrases3 as [phrase, count], idx (idx)}
<span  class="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-full text-sm">
                    {phrase} ({count})
                  </span>
{/each}
              </div>
            </div>
{/if}
        
</div>
{/if}
    </div>
  
