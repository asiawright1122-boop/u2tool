<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['document-word-counter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.document-word-counter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface DocumentStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  pages: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  longestWord: string;
  mostFrequentWords: { word: string; count: number }[];
}

  let text = $state(SAMPLE_TEXT);

  let stats = $derived(analyzeDocument(text));

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('documentText')}
        </label>
        <textarea
          bind:value={text}
          placeholder={tCommon('inputPlaceholder')}
          rows={10}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words.toLocaleString()}</div>
          <div class="text-sm text-blue-700 dark:text-blue-300">{t('words')}</div>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{stats.characters.toLocaleString()}</div>
          <div class="text-sm text-green-700 dark:text-green-300">{t('characters')}</div>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.sentences}</div>
          <div class="text-sm text-purple-700 dark:text-purple-300">{t('sentences')}</div>
        </div>
        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.paragraphs}</div>
          <div class="text-sm text-orange-700 dark:text-orange-300">{t('paragraphs')}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('detailedStatistics')}</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{t('charactersNoSpaces')}</span>
              <span class="font-medium text-gray-900 dark:text-white">{stats.charactersNoSpaces.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{t('lines')}</span>
              <span class="font-medium text-gray-900 dark:text-white">{stats.lines}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{t('pages')}</span>
              <span class="font-medium text-gray-900 dark:text-white">{stats.pages}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{t('uniqueWords')}</span>
              <span class="font-medium text-gray-900 dark:text-white">{stats.uniqueWords}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{t('avgWordLength')}</span>
              <span class="font-medium text-gray-900 dark:text-white">{stats.avgWordLength} {t('chars')}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">{t('avgSentenceLength')}</span>
              <span class="font-medium text-gray-900 dark:text-white">{stats.avgSentenceLength} {t('words')}</span>
            </div>
            {#if stats.longestWord}
<div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">{t('longestWord')}</span>
                <span class="font-medium text-gray-900 dark:text-white">{stats.longestWord}</span>
              </div>
{/if}
          </div>
        </div>

        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('timeEstimates')}</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600 dark:text-gray-400">{t('readingTime')}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{stats.readingTime} {t('min')}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: {Math.min(100, stats.readingTime * 5)}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600 dark:text-gray-400">{t('speakingTime')}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{stats.speakingTime} {t('min')}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: {Math.min(100, stats.speakingTime * 5)}%"></div>
              </div>
            </div>
          </div>

          {#if stats.mostFrequentWords.length > 0}
<div class="mt-4">
              <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('topWords')}</h4>
              <div class="flex flex-wrap gap-1">
                {#each stats.mostFrequentWords.slice(0, 5) as { word, count } (word)}
<span  class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                    {word} ({count})
                  </span>
{/each}
              </div>
            </div>
{/if}
        </div>
      </div>
    </div>
  
