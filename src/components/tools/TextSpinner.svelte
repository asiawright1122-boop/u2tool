<script lang="ts">
  import { onDestroy } from 'svelte';
  import { SYNONYMS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-spinner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-spinner.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Level = 'conservative' | 'moderate' | 'aggressive';

  let input = $state('');

  let output = $state('');

  let level = $state('moderate');

  let copied = $state(false);

  let timerRef = $state(null);

  function spin() {
    if (!input.trim()) {
      output = '';
      return;
    }

    const chance = getReplacementChance(level);
    const words = input.split(/(\s+)/);
    
    const result = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (SYNONYMS[cleanWord] && Math.random() < chance) {
        const synonyms = SYNONYMS[cleanWord];
        const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
        // 保持原始大小写
        if (word[0] === word[0].toUpperCase()) {
          return synonym.charAt(0).toUpperCase() + synonym.slice(1);
        }
        return synonym;
      }
      return word;
    }).join('');

    output = result;
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function getReplacementChance(level: Level): number {
    switch (level) {
      case 'conservative': return 0.3;
      case 'moderate': return 0.5;
      case 'aggressive': return 0.8;
    }
  }
  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function clearAll() {
    input = '';
    output = '';
  }
  function calculateUniqueness(): number {
    if (!input || !output) return 0;
    const inputWords = input.toLowerCase().split(/\s+/);
    const outputWords = output.toLowerCase().split(/\s+/);
    let different = 0;
    inputWords.forEach((word, i) => {
      if (outputWords[i] && word !== outputWords[i]) different++;
    });
    return Math.round((different / inputWords.length) * 100);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('level')}</label>
          <select
            value={level}
            onchange={(e) => level = e.target.value as Level}
            class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="conservative">{t('conservative')}</option>
            <option value="moderate">{t('moderate')}</option>
            <option value="aggressive">{t('aggressive')}</option>
          </select>
        </div>
        {#if output}
<div class="text-sm text-gray-600 dark:text-gray-300">
            {t('uniqueness')}: <span class="font-bold text-amber-600">{calculateUniqueness()}%</span>
          </div>
{/if}
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={spin} class="btn-primary">
          {t('spin')}
        </button>
        <button onclick={copyOutput} disabled={!output} class="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
        <button onclick={clearAll} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  
