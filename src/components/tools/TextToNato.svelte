<script lang="ts">
  import { NATO_ALPHABET } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-to-nato'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-to-nato.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let separator = $state('newline');

  let showOriginal = $state(true);

  function textToNato(text: string) {
    const chars = text.toUpperCase().split('');
    const results: string[] = [];

    for (const char of chars) {
      if (NATO_ALPHABET[char]) {
        if (showOriginal) {
          results.push(`${char} - ${NATO_ALPHABET[char]}`);
        } else {
          results.push(NATO_ALPHABET[char]);
        }
      } else if (char.trim()) {
        results.push(showOriginal ? `${char} - [${t('unknown')}]` : `[${char}]`);
      }
    }

    const sep = separator === 'newline' ? '\n' : separator === 'dash' ? ' - ' : ' ';
    return results.join(sep);
  }

  // Functions
  function handleConvert() {
    output = textToNato(input);
  }
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }
  function loadSample() {
    input = t('sampleText');
    output = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('separator')}:</label>
          <select
            value={separator}
            onchange={(e) => separator = e.target.value as 'newline' | 'dash' | 'space'}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="newline">{t('sepNewline')}</option>
            <option value="dash">{t('sepDash')}</option>
            <option value="space">{t('sepSpace')}</option>
          </select>
        </div>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={showOriginal}
            class="w-4 h-4 text-amber-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('showOriginal')}</span>
        </label>

        <button
          onclick={loadSample}
          class="text-sm text-amber-600 hover:text-amber-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('textInput')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('textPlaceholder')}
            class="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('natoOutput')}
            </label>
            {#if output}
<button
                onclick={handleCopy}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('natoPlaceholder')}
            class="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"></textarea>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          onclick={handleConvert}
          class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {t('convert')}
        </button>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('alphabet')}</h3>
        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 text-sm">
          {#each Object.entries(NATO_ALPHABET).slice(0, 26) as [letter, word] (letter)}
<div  class="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-center">
              <div class="font-bold text-amber-600">{letter}</div>
              <div class="text-gray-600 dark:text-gray-300 text-xs">{word}</div>
            </div>
{/each}
        </div>
      </div>
    </div>
  
