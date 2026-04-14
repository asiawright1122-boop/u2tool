<script lang="ts">
  import { onDestroy } from 'svelte';
  import { chineseSentences, chineseWords } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['chinese-lorem-ipsum'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.chinese-lorem-ipsum.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let outputType = $state('paragraphs');

  let count = $state('3');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateWords(num: number): string {
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      result.push(chineseWords[Math.floor(Math.random() * chineseWords.length)]);
    }
    return result.join('');
  }
  function generateSentences(num: number): string {
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      result.push(chineseSentences[Math.floor(Math.random() * chineseSentences.length)]);
    }
    return result.join('');
  }
  function generateParagraphs(num: number): string {
    const result: string[] = [];
    for (let i = 0; i < num; i++) {
      const sentenceCount = 4 + Math.floor(Math.random() * 4);
      const paragraph = generateSentences(sentenceCount);
      result.push(paragraph);
    }
    return result.join('\n\n');
  }
  function generate() {
    const num = parseInt(count) || 1;
    let result = '';

    switch (outputType) {
      case 'paragraphs':
        result = generateParagraphs(num);
        break;
      case 'sentences':
        result = generateSentences(num);
        break;
      case 'words':
        result = generateWords(num);
        break;
    }

    output = result;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-2">
        {#each (['paragraphs', 'sentences', 'words'] as const) as type (type)}
<button 
            onclick={() => outputType = type}
            class={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              outputType === type
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t(type)}
          </button>
{/each}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('count')}
        </label>
        <input
          type="number"
          bind:value={count}
          min="1"
          max="100"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <button
        onclick={generate}
        class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {tc('generate')}
      </button>

      {#if output}
<div class="space-y-2">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('output')}
            </label>
            <div class="flex gap-2">
              <span class="text-sm text-gray-500">
                {output.length} {t('characters')}
              </span>
              <button
                onclick={copyToClipboard}
                class="text-sm text-amber-600 hover:text-amber-700"
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-96 overflow-y-auto">
            <p class="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
              {output}
            </p>
          </div>
        </div>
{/if}

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-semibold mb-2">{t('about')}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {t('aboutText')}
        </p>
      </div>
    </div>
  
