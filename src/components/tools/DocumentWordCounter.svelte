<script lang="ts">
  import { SAMPLE_TEXT } from '@/lib/tool-stubs';

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

  const WORDS_PER_PAGE = 250;

  function analyzeDocumentText(content: string): DocumentStats {
    const text = content ?? '';
    const trimmed = text.trim();
    const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
    const sentences = trimmed.length > 0
      ? trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
      : [];
    const paragraphs = trimmed.length > 0
      ? trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : [];
    const lines = text.length > 0 ? text.split(/\r?\n/).length : 0;
    const wordFrequency = new Map<string, number>();

    for (const rawWord of words) {
      const normalized = rawWord.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      if (!normalized) continue;
      wordFrequency.set(normalized, (wordFrequency.get(normalized) ?? 0) + 1);
    }

    const uniqueWords = wordFrequency.size;
    const sortedWords = [...wordFrequency.entries()].sort((a, b) => b[1] - a[1]);
    const longestWord = words.reduce((longest, word) => (
      word.length > longest.length ? word : longest
    ), '');

    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      lines,
      pages: Math.max(1, Math.ceil(words.length / WORDS_PER_PAGE)),
      readingTime: Math.max(1, Math.ceil(words.length / 220)),
      speakingTime: Math.max(1, Math.ceil(words.length / 130)),
      uniqueWords,
      avgWordLength: words.length > 0
        ? Number((words.reduce((sum, word) => sum + word.length, 0) / words.length).toFixed(1))
        : 0,
      avgSentenceLength: sentences.length > 0
        ? Number((words.length / sentences.length).toFixed(1))
        : 0,
      longestWord,
      mostFrequentWords: sortedWords
        .slice(0, 10)
        .map(([word, count]) => ({ word, count })),
    };
  }

  let text = $state(SAMPLE_TEXT);

  let stats = $derived.by(() => analyzeDocumentText(text));

</script>


    <div class="space-y-6">
      <div>
        <label class="tool-label">
          {t('documentText')}
        </label>
        <textarea
          bind:value={text}
          placeholder={tCommon('inputPlaceholder')}
          rows={10}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.words.toLocaleString()}</div>
          <div class="text-sm text-amber-700 dark:text-amber-300">{t('words')}</div>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{stats.characters.toLocaleString()}</div>
          <div class="text-sm text-green-700 dark:text-green-300">{t('characters')}</div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-slate-600 dark:text-slate-400">{stats.sentences}</div>
          <div class="text-sm text-slate-700 dark:text-slate-300">{t('sentences')}</div>
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
                <div class="bg-amber-600 h-2 rounded-full" style="width: {Math.min(100, stats.readingTime * 5)}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span class="text-sm text-gray-600 dark:text-gray-400">{t('speakingTime')}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{stats.speakingTime} {t('min')}</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: {Math.min(100, stats.speakingTime * 5)}%"></div>
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
  
