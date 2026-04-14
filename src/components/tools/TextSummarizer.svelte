<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-summarizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-summarizer.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let text = $state('');

  let summaryLength = $state('medium');

  let copied = $state(false);

  let timerRef = $state(null);

  let summary = $derived.by(() => {
    if (!text.trim()) return null;

    // Split into sentences
    const sentences = text
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentences.length === 0) return null;

    // Score sentences based on various factors
    const wordFreq: Record<string, number> = {};
    const allWords = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    allWords.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0;
      const words = sentence.toLowerCase().match(/\b[a-z]+\b/g) || [];
      
      // Word frequency score
      words.forEach(word => {
        score += wordFreq[word] || 0;
      });
      
      // Position score (first and last sentences are important)
      if (index === 0) score *= 1.5;
      if (index === sentences.length - 1) score *= 1.2;
      
      // Length penalty (too short or too long)
      if (words.length < 5) score *= 0.5;
      if (words.length > 30) score *= 0.8;
      
      // Normalize by length
      score = score / Math.max(words.length, 1);
      
      return { sentence, score, index };
    });

    // Determine number of sentences based on length setting
    const targetCount = {
      short: Math.max(1, Math.floor(sentences.length * 0.2)),
      medium: Math.max(2, Math.floor(sentences.length * 0.35)),
      long: Math.max(3, Math.floor(sentences.length * 0.5)),
    }[summaryLength];

    // Select top sentences and sort by original order
    const selected = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, targetCount)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence);

    const summaryText = selected.join(' ');
    const reduction = Math.round((1 - summaryText.length / text.length) * 100);

    return {
      text: summaryText,
      originalWords: allWords.length,
      summaryWords: summaryText.match(/\b[a-z]+\b/gi)?.length || 0,
      sentences: selected.length,
      reduction,
    };
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyToClipboard() {
    if (summary) {
      await navigator.clipboard.writeText(summary.text);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }

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
          rows={8}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
      </div>

      <!-- Length Selection -->
      <div>
        <label class="tool-label">
          {t('summaryLength')}
        </label>
        <div class="flex gap-2">
          {#each (['short', 'medium', 'long'] as const) as len (len)}
<button 
              onclick={() => summaryLength = len}
              class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                summaryLength === len
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(len)}
            </button>
{/each}
        </div>
      </div>

      <!-- Summary Output -->
      {#if summary}
<div>

          <!-- Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{summary.originalWords}</div>
              <div class="text-xs text-gray-500">{t('originalWords')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-amber-600">{summary.summaryWords}</div>
              <div class="text-xs text-gray-500">{t('summaryWords')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{summary.sentences}</div>
              <div class="text-xs text-gray-500">{t('sentences')}</div>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div class="text-2xl font-bold text-green-600">{summary.reduction}%</div>
              <div class="text-xs text-gray-500">{t('reduction')}</div>
            </div>
          </div>

          <!-- Summary Text -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-gray-900 dark:text-white">{t('summary')}</h3>
              <button
                onclick={copyToClipboard}
                class={`px-3 py-1 rounded text-sm font-medium ${
                  copied
                    ? 'btn-success'
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            </div>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary.text}
            </p>
          </div>
        
</div>
{/if}

      <!-- Tips -->
      <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
        <h4 class="font-medium text-amber-800 dark:text-amber-200 mb-2">{t('tips')}</h4>
        <ul class="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
