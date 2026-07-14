<script lang="ts">
  import { getGrammarLanguageSupport } from '@/lib/grammar-language-support';
  import type { Locale } from '@/lib/i18n';
  import {
    applyCorrections,
    checkGrammar,
    type GrammarError,
  } from '@/lib/grammar-rules';
  import { escapeHtmlAttribute } from '@/lib/sanitize';

  interface Props {
    locale: Locale;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();
  const languageSupport = $derived(getGrammarLanguageSupport(locale));

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['grammar-checker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.grammar-checker.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let errors = $derived.by(() => {
    if (!input.trim()) return [];
    return checkGrammar(input);
  });

  // Functions
  function getHighlightedText() {
    if (!input) return '';
    if (errors.length === 0) return escapeHtmlAttribute(input);

    let cursor = 0;
    let result = '';
    const sortedErrors = [...errors].sort((a, b) => a.position.start - b.position.start);

    sortedErrors.forEach(error => {
      result += escapeHtmlAttribute(input.slice(cursor, error.position.start));
      result += `<mark class="bg-red-200 dark:bg-red-800">${escapeHtmlAttribute(input.slice(error.position.start, error.position.end))}</mark>`;
      cursor = error.position.end;
    });

    result += escapeHtmlAttribute(input.slice(cursor));
    return result;
  }
  function applyFix(error: GrammarError) {
    if (!error.suggestions || error.suggestions.length === 0) return;
    input = applyCorrections(input, [error]);
  }
  function applyAllFixes() {
    input = applyCorrections(input, errors);
  }

</script>


    <div class="space-y-4">
      <p
        class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        data-grammar-language-notice
        data-input-language={languageSupport.localInputLanguage}
      >
        {t('languageNotice')}
      </p>

      <div class="flex flex-wrap gap-2">
        <button 
          onclick={applyAllFixes} 
          disabled={errors.length === 0}
          class="btn-primary"
        >
          {t('fixAll')} ({errors.length})
        </button>
        <button onclick={() => input = ''} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="grammar-checker-field-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')} id="grammar-checker-field-3"></textarea>
        </div>

        <div>
          <div class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('preview')}</div>
          <div 
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white overflow-auto">{@html getHighlightedText() || escapeHtmlAttribute(t('noErrors'))}</div>
        </div>
      </div>

      {#if errors.length > 0}
<div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">{t('foundErrors')} ({errors.length})</h3>
          <div class="space-y-2 max-h-64 overflow-auto">
            {#each errors as error, index (index)}
<div  class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex justify-between items-start">
                <div>
                  <p class="text-sm text-red-600 dark:text-red-400 font-medium">
                    &quot;{error.original}&quot;
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{error.message}</p>
                  {#if error.suggestions}
{#if error.suggestions.length > 0}
                    <p class="text-xs text-green-600 dark:text-green-400">
                      {t('suggestion')}: {error.suggestions[0]}
                    </p>
                  {/if}
{/if}
                </div>
                {#if error.suggestions}
{#if error.suggestions.length > 0}
                  <button
                    onclick={() => applyFix(error)}
                    class="text-xs px-2 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    {t('fix')}
                  </button>
                {/if}
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
