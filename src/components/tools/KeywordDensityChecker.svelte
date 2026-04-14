<script lang="ts">
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

  // Types
  interface KeywordResult {
  word: string;
  count: number;
  density: number;
}

  let text = $state('');

  let minLength = $state('3');

  let excludeCommon = $state(true);

  let analysis = $derived.by(() => {
    if (!text.trim()) return null;

    const words = text.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
    const totalWords = words.length;
    const minLen = parseInt(minLength) || 3;

    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      if (word.length >= minLen && (!excludeCommon || !commonWords.has(word))) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const results: KeywordResult[] = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    // Phrase analysis (2-3 word phrases)
    const phrases2: Record<string, number> = {};
    const phrases3: Record<string, number> = {};
    
    for (let i = 0; i < words.length - 1; i++) {
      const phrase2 = `${words[i]} ${words[i + 1]}`;
      phrases2[phrase2] = (phrases2[phrase2] || 0) + 1;
      
      if (i < words.length - 2) {
        const phrase3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        phrases3[phrase3] = (phrases3[phrase3] || 0) + 1;
      }
    }

    const topPhrases2 = Object.entries(phrases2)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topPhrases3 = Object.entries(phrases3)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { totalWords, results, topPhrases2, topPhrases3 };
  });

  // Functions
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who',
    'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
  ]);

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <label class="tool-label">
          {t('enterText')}
        </label>
        <textarea
          bind:value={text}
          placeholder={tc('inputPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
      </div>

      <!-- Options -->
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">{t('minLength')}:</label>
          <input
            type="number"
            bind:value={minLength}
            min="1"
            max="10"
            class="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
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
  
