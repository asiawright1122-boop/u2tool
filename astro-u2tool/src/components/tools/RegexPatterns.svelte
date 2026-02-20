<script lang="ts">
  import { onDestroy } from 'svelte';

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

  // Types
  interface Pattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

  let testInput = $state('');

  let selectedPattern = $state(null);

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function copyPattern(pattern: string) {
    navigator.clipboard.writeText(pattern);
    copied = pattern;
    setTimeout(() => copied = '', 2000);
  }
  function testPattern(pattern: Pattern) {
    selectedPattern = pattern;
    testInput = pattern.example;
  }
  const isMatch = selectedPattern && testInput
    ? new RegExp(selectedPattern.pattern).test(testInput)
    : null;

</script>


    <div class="space-y-4">
      {#if selectedPattern}
<div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-900 dark:text-white">{t(`regexPatterns.${selectedPattern.name}`)}</span>
            <button
              onclick={() => selectedPattern = null}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <code class="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2 rounded text-sm text-green-600 dark:text-green-400 break-all">
            {selectedPattern.pattern}
          </code>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('regexPatterns.test')}</label>
            <input
              type="text"
              bind:value={testInput}
              class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white"
              placeholder={selectedPattern.example}
            />
          </div>
          {#if testInput}
<div class={`text-sm ${isMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isMatch ? '✅ ' + t('regexPatterns.match') : '❌ ' + t('regexPatterns.noMatch')}
            </div>
{/if}
        </div>
{/if}

      <div class="grid gap-2">
        {#each patterns as p (p.name)}
<div 
            class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-750"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-gray-900 dark:text-white">{t(`regexPatterns.${p.name}`)}</div>
              <code class="text-xs text-gray-500 dark:text-gray-300 truncate block">{p.pattern}</code>
            </div>
            <div class="flex gap-2 ml-2">
              <button
                onclick={() => testPattern(p)}
                class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded"
              >
                {t('regexPatterns.tryIt')}
              </button>
              <button
                onclick={() => copyPattern(p.pattern)}
                class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
              >
                {copied === p.pattern ? '✓' : t('copy')}
              </button>
            </div>
          </div>
{/each}
      </div>
    </div>
  
