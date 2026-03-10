<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['palindrome-checker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.palindrome-checker.${key}`;
  }

  let input = $state('');

  let ignoreSpaces = $state(true);

  let ignoreCase = $state(true);

  let ignorePunctuation = $state(true);

  let result = $derived.by(() => {
    if (!input.trim()) return null;

    let processed = input;
    if (ignoreCase) processed = processed.toLowerCase();
    if (ignoreSpaces) processed = processed.replace(/\s/g, '');
    if (ignorePunctuation) processed = processed.replace(/[^\w\s]|_/g, '');

    const reversed = processed.split('').reverse().join('');
    const isPalindrome = processed === reversed;

    return {
      original: input,
      processed,
      reversed,
      isPalindrome,
      length: processed.length,
    };
  });

  // Functions
  const examples = [
    { text: 'A man a plan a canal Panama', type: 'phrase' },
    { text: 'Was it a car or a cat I saw', type: 'phrase' },
    { text: 'Never odd or even', type: 'phrase' },
    { text: 'racecar', type: 'word' },
    { text: 'level', type: 'word' },
    { text: 'radar', type: 'word' },
    { text: 'madam', type: 'word' },
    { text: '12321', type: 'number' },
  ];

</script>


    <div class="space-y-6">
      <div>
        <label for="palindrome-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          id="palindrome-input"
          name="palindromeInput"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"></textarea>
      </div>

      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="palindrome-ignore-case"
            name="palindromeIgnoreCase"
            bind:checked={ignoreCase}
            class="w-4 h-4 rounded"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('ignoreCase')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="palindrome-ignore-spaces"
            name="palindromeIgnoreSpaces"
            bind:checked={ignoreSpaces}
            class="w-4 h-4 rounded"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('ignoreSpaces')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id="palindrome-ignore-punctuation"
            name="palindromeIgnorePunctuation"
            bind:checked={ignorePunctuation}
            class="w-4 h-4 rounded"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('ignorePunctuation')}</span>
        </label>
      </div>

      {#if result}
<div class={`p-6 rounded-xl text-center ${
          result.isPalindrome
            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
            : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
        }`}>
          <div class="text-6xl mb-4">
            {result.isPalindrome ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'}
          </div>
          <h3 class={`text-2xl font-bold mb-2 ${
            result.isPalindrome
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            {result.isPalindrome ? t('isPalindrome') : t('notPalindrome')}
          </h3>
          <p class={`text-sm ${
            result.isPalindrome
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {t('processedText')}: &quot;{result.processed}&quot;
          </p>
        </div>
{/if}

      {#if result}
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('forward')}</h4>
            <p class="font-mono text-lg text-gray-900 dark:text-white break-all">{result.processed}</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('backward')}</h4>
            <p class="font-mono text-lg text-gray-900 dark:text-white break-all">{result.reversed}</p>
          </div>
        </div>
{/if}

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-3">{t('examples')}</h3>
        <div class="flex flex-wrap gap-2">
          {#each examples as example, i (i)}
<button 
              onclick={() => input = example.text}
              class="px-3 py-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {example.text}
            </button>
{/each}
        </div>
      </div>
    </div>
  
