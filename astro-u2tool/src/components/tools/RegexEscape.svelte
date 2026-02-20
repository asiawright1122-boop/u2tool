<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['regex-escape'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.regex-escape.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let mode = $state('escape');

  function escapeRegex(str: string) {
    return str.replace(/[\\^$.|?*+()[\]{}]/g, '\\$&');
  }

  function unescapeRegex(str: string) {
    return str.replace(/\\([\\^$.|?*+()[\]{}])/g, '$1');
  }

  // Functions
  const specialChars = [
    { char: '\\', desc: 'backslash' },
    { char: '^', desc: 'caret' },
    { char: '$', desc: 'dollar' },
    { char: '.', desc: 'dot' },
    { char: '|', desc: 'pipe' },
    { char: '?', desc: 'question' },
    { char: '*', desc: 'asterisk' },
    { char: '+', desc: 'plus' },
    { char: '(', desc: 'openParen' },
    { char: ')', desc: 'closeParen' },
    { char: '[', desc: 'openBracket' },
    { char: ']', desc: 'closeBracket' },
    { char: '{', desc: 'openBrace' },
    { char: '}', desc: 'closeBrace' },
  ];
  function handleConvert() {
    if (mode === 'escape') {
      output = escapeRegex(input);
    } else {
      output = unescapeRegex(input);
    }
  }
  function handleSwap() {
    mode = mode === 'escape' ? 'unescape' : 'escape';
    input = output;
    output = '';
  }
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }
  function loadSample() {
    input = 'Hello. How are you? (I hope you\'re well!) Price: $100.00 [50% off]';
    output = '';
  }
  function insertChar(char: string) {
    input = input + char;
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onchange={(e) => mode = e.target.value as 'escape' | 'unescape'}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="escape">{t('escape')}</option>
            <option value="unescape">{t('unescape')}</option>
          </select>
        </div>

        <button
          onclick={loadSample}
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            placeholder={mode === 'escape' ? t('inputPlaceholder') : t('escapedPlaceholder')}
            class="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('output')}
            </label>
            {#if output}
<button
                onclick={handleCopy}
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          onclick={handleConvert}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'escape' ? t('escapeBtn') : t('unescapeBtn')}
        </button>
        <button
          onclick={handleSwap}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ⇄ {t('swap')}
        </button>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('specialChars')}</h3>
        <div class="flex flex-wrap gap-2">
          {#each specialChars as { char } (char)}
<button 
              onclick={() => insertChar(char)}
              class="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              title={char}
            >
              {char}
            </button>
{/each}
        </div>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 class="font-medium text-blue-700 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-blue-600 dark:text-blue-200">{t('infoText')}</p>
      </div>
    </div>
  
