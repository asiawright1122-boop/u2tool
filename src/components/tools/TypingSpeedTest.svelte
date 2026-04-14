<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['typing-speed-test'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.typing-speed-test.${key}`;
  }

  // Imports
  import { calculateTypingStats, type TypingTestResult } from '@/lib/calculator-utils';

  let sampleTexts = $derived(({
    easy: [
      t('sampleTexts.easy.0'),
      t('sampleTexts.easy.1'),
      t('sampleTexts.easy.2'),
    ],
    medium: [
      t('sampleTexts.medium.0'),
      t('sampleTexts.medium.1'),
      t('sampleTexts.medium.2'),
    ],
    hard: [
      t('sampleTexts.hard.0'),
      t('sampleTexts.hard.1'),
      t('sampleTexts.hard.2'),
    ],
  }));

  let difficulty = $state('medium');

  let targetText = $state('');

  let typedText = $state('');

  let isStarted = $state(false);

  let isFinished = $state(false);

  let startTime = $state(0);

  let result = $state(null);

  let inputRef = $state(null);

  function getRandomText() {
    const texts = sampleTexts[difficulty];
    return texts[Math.floor(Math.random() * texts.length)];
  }

  $effect(() => {
    targetText = getRandomText();
  });

  // Functions
  function startTest() {
    targetText = getRandomText();
    typedText = '';
    isStarted = false;
    isFinished = false;
    result = null;
    inputRef?.focus();
  }
  function handleInput(value: string) {
    if (!isStarted && value.length > 0) {
      isStarted = true;
      startTime = Date.now();
    }

    typedText = value;

    if (value.length >= targetText.length) {
      const duration = Date.now() - startTime;
      const stats = calculateTypingStats(targetText, value, duration);
      result = stats;
      isFinished = true;
    }
  }

</script>

{#snippet renderText()}
{#each targetText.split('') as char, index (index)}
<span class={index < typedText.length ? (typedText[index] === char ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30') : index === typedText.length ? 'bg-amber-200 dark:bg-amber-800 text-gray-900 dark:text-white' : 'text-gray-400'}>{char}</span>
{/each}
{/snippet}


    <div class="space-y-6">
      <div class="flex gap-2">
        {#each (['easy', 'medium', 'hard'] as const) as level (level)}
<button 
            onclick={() => {
              difficulty = level;
              startTest();
            }}
            class={`px-4 py-2 rounded-lg transition-colors ${
              difficulty === level
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t(level)}
          </button>
{/each}
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="text-lg font-mono leading-relaxed">
          {@render renderText()}
        </div>
      </div>

      <textarea
        bind:this={inputRef}
        value={typedText}
        onchange={(e) => handleInput(e.target.value)}
        disabled={isFinished}
        class="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono resize-none"
        placeholder={t('startTyping')}
      />

      <button
        onclick={startTest}
        class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {isFinished ? t('tryAgain') : t('newText')}
      </button>

      {#if isStarted}
{#if !isFinished}
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {t('typing')}...
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {typedText.length} / {targetText.length} {t('characters')}
          </div>
        </div>
      {/if}
{/if}

      {#if result}
<div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-6 bg-gradient-to-r from-amber-500 to-slate-500 rounded-lg text-white text-center">
              <div class="text-sm opacity-80">{t('wpm')}</div>
              <div class="text-4xl font-bold">{result.wpm}</div>
            </div>
            <div class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
              <div class="text-sm opacity-80">{t('accuracy')}</div>
              <div class="text-4xl font-bold">{result.accuracy}%</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('correctChars')}</div>
              <div class="text-xl font-bold text-green-600 dark:text-green-400">
                {result.correctChars}
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('incorrectChars')}</div>
              <div class="text-xl font-bold text-red-600 dark:text-red-400">
                {result.incorrectChars}
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('duration')}</div>
              <div class="text-xl font-bold text-gray-900 dark:text-white">
                {result.duration.toFixed(1)}s
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('rating')}</div>
            <div class="text-lg font-semibold">
              {#if result.wpm < 20}
{t('beginner')}
{/if}
              {#if result.wpm >= 20}
{result.wpm < 40 ? t('average') : ''}
{/if}
              {#if result.wpm >= 40}
{result.wpm < 60 ? t('aboveAverage') : ''}
{/if}
              {#if result.wpm >= 60}
{result.wpm < 80 ? t('fast') : ''}
{/if}
              {#if result.wpm >= 80}
{t('professional')}
{/if}
            </div>
          </div>
        </div>
{/if}
    </div>
  
