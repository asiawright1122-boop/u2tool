<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

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

  // Imports
  import { checkGrammar, type GrammarError } from '@/lib/grammar-rules';

  let input = $state('');

  let errors = $derived.by(() => {
    if (!input.trim()) return [];
    return checkGrammar(input);
  });

  // Functions
  function getHighlightedText() {
    if (!input || errors.length === 0) return input;
    
    let result = input;
    // 从后往前替换，避免位置偏移
    const sortedErrors = [...errors].sort((a, b) => b.position.start - a.position.start);
    
    sortedErrors.forEach(error => {
      const before = result.slice(0, error.position.start);
      const match = result.slice(error.position.start, error.position.end);
      const after = result.slice(error.position.end);
      result = `${before}<mark class="bg-red-200 dark:bg-red-800">${match}</mark>${after}`;
    });
    
    return result;
  }
  function applyFix(error: GrammarError) {
    if (!error.suggestions || error.suggestions.length === 0) return;
    let newText = input.slice(0, error.position.start) + error.suggestions[0] + input.slice(error.position.end);
    input = newText;
  }
  function applyAllFixes() {
    let newText = input;
    // 从后往前应用修复
    const sortedErrors = [...errors].sort((a, b) => b.position.start - a.position.start);
    sortedErrors.forEach(error => {
      if (error.suggestions && error.suggestions.length > 0) {
        newText = newText.slice(0, error.position.start) + error.suggestions[0] + newText.slice(error.position.end);
      }
    });
    input = newText;
  }

</script>


    <div class="space-y-4">
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
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('preview')}</label>
          <div 
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white overflow-auto">{@html getHighlightedText() || t('noErrors')}</div>
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
error.suggestions.length > 0 && (
                    <p class="text-xs text-green-600 dark:text-green-400">
                      {t('suggestion')}: {error.suggestions[0]}
                    </p>
                  )
{/if}
                </div>
                {#if error.suggestions}
error.suggestions.length > 0 && (
                  <button
                    onclick={() => applyFix(error)}
                    class="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {t('fix')}
                  </button>
                )
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
