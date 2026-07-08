<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['readability-checker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.readability-checker.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateReadability, type ReadabilityResult } from '@/lib/readability';

  let input = $state('');

  let result = $derived.by(() => {
    if (!input.trim()) return null;
    return calculateReadability(input);
  });

  // Functions
  function getGradeColor(grade: number): string {
    if (grade <= 6) return 'text-green-600';
    if (grade <= 10) return 'text-yellow-600';
    if (grade <= 14) return 'text-orange-600';
    return 'text-red-600';
  }
  function getScoreColor(score: number): string {
    if (score >= 60) return 'text-green-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-red-600';
  }

</script>


    <div class="space-y-4">
      <div>
        <label for="readability-checker-field-2" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          bind:value={input}
          class="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
          placeholder={t('inputPlaceholder')} id="readability-checker-field-2"></textarea>
      </div>

      {#if result}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('fleschKincaid')}</h3>
            <p class={`text-2xl font-bold ${getGradeColor(result.metrics.fleschKincaidGrade)}`}>
              {result.metrics.fleschKincaidGrade.toFixed(1)}
            </p>
            <p class="text-xs text-gray-500">{t('gradeLevel')}</p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('fleschReading')}</h3>
            <p class={`text-2xl font-bold ${getScoreColor(result.metrics.fleschReadingEase)}`}>
              {result.metrics.fleschReadingEase.toFixed(1)}
            </p>
            <p class="text-xs text-gray-500">{t('easeScore')}</p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('gunningFog')}</h3>
            <p class={`text-2xl font-bold ${getGradeColor(result.metrics.gunningFogIndex)}`}>
              {result.metrics.gunningFogIndex.toFixed(1)}
            </p>
            <p class="text-xs text-gray-500">{t('gradeLevel')}</p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('smog')}</h3>
            <p class={`text-2xl font-bold ${getGradeColor(result.metrics.smogIndex)}`}>
              {result.metrics.smogIndex.toFixed(1)}
            </p>
            <p class="text-xs text-gray-500">{t('gradeLevel')}</p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('readingTime')}</h3>
            <p class="text-2xl font-bold text-amber-600">
              {result.readingTime} {t('minutes')}
            </p>
          </div>

          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('statistics')}</h3>
            <div class="text-sm space-y-1">
              <p>{t('words')}: {result.metrics.wordCount}</p>
              <p>{t('sentences')}: {result.metrics.sentenceCount}</p>
              <p>{t('characters')}: {result.metrics.characterCount}</p>
            </div>
          </div>
        </div>
{/if}

      {#if result}
<div class="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
          <h3 class="font-medium text-amber-800 dark:text-amber-200 mb-2">{t('interpretation')}</h3>
          <p class="text-sm text-amber-700 dark:text-amber-300">
            {result.gradeLevel}
          </p>
          {#if result.suggestions.length > 0}
<ul class="mt-2 text-sm text-amber-700 dark:text-amber-300 list-disc list-inside">
              {#each result.suggestions as suggestion, i (i)}
<li >{suggestion}</li>
{/each}
            </ul>
{/if}
        </div>
{/if}
    </div>
  
