<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let text1 = $state('');

  let text2 = $state('');

  let similarity = $derived.by(() => {
    if (!text1 || !text2) return null;
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;
    if (longer.length === 0) return { charSim: '100', wordSim: '100', distance: 0, common: 0, total: 0 };
    
    // Levenshtein distance
    const costs: number[] = [];
    for (let i = 0; i <= shorter.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= longer.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let newValue = costs[j - 1];
          if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[longer.length] = lastValue;
    }
    const distance = costs[longer.length];
    const percent = ((longer.length - distance) / longer.length * 100).toFixed(1);
    
    // Common words
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    const common = [...words1].filter(w => words2.has(w)).length;
    const total = new Set([...words1, ...words2]).size;
    const wordSim = total > 0 ? (common / total * 100).toFixed(1) : '0';

    return { charSim: percent, wordSim, distance, common, total };
  });

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('textCompare.text1')}</label>
          <textarea bind:value={text1} class="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('textCompare.placeholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('textCompare.text2')}</label>
          <textarea bind:value={text2} class="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('textCompare.placeholder')}></textarea>
        </div>
      </div>
      {#if similarity}
<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-amber-600 dark:text-amber-400">{similarity.charSim}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{t('textCompare.charSimilarity')}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">{similarity.wordSim}%</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{t('textCompare.wordSimilarity')}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{similarity.distance}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{t('textCompare.editDistance')}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <p class="text-3xl font-bold text-slate-600 dark:text-slate-400">{similarity.common}/{similarity.total}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">{t('textCompare.commonWords')}</p>
          </div>
        </div>
{/if}
    </div>
  
