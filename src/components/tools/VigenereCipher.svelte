<script lang="ts">
  import { vigenereCipher } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['vigenere-cipher'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.vigenere-cipher.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let keyword = $state('');

  let mode = $state('encrypt');

  let copied = $state(false);

  function handleProcess() {
    output = vigenereCipher(input, keyword, mode === 'decrypt');
  }

  // Functions
  function handleInputChange(value: string) {
    input = value;
    if (keyword) {
      output = vigenereCipher(value, keyword, mode === 'decrypt');
    }
  }
  function handleKeywordChange(value: string) {
    keyword = value;
    if (input) {
      output = vigenereCipher(input, value, mode === 'decrypt');
    }
  }
  function handleModeChange(newMode: 'encrypt' | 'decrypt') {
    mode = newMode;
    if (input && keyword) {
      output = vigenereCipher(input, keyword, newMode === 'decrypt');
    }
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function clearAll() {
    input = '';
    output = '';
    keyword = '';
  }
  function swapInputOutput() {
    input = output;
    mode = mode === 'encrypt' ? 'decrypt' : 'encrypt';
    output = vigenereCipher(output, keyword, mode === 'encrypt');
  }
  function generateTable() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map((_, rowIndex) => {
      return alphabet.split('').map((_, colIndex) => {
        return alphabet[(rowIndex + colIndex) % 26];
      });
    });
  }
  const table = generateTable();

</script>


    <div class="space-y-6">
      <!-- Info -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          {t('info')}
        </p>
      </div>

      <!-- Mode Selection -->
      <div class="flex justify-center gap-4">
        <button
          onclick={() => handleModeChange('encrypt')}
          class={`px-6 py-2 rounded-lg font-medium ${
            mode === 'encrypt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('encrypt')}
        </button>
        <button
          onclick={() => handleModeChange('decrypt')}
          class={`px-6 py-2 rounded-lg font-medium ${
            mode === 'decrypt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('decrypt')}
        </button>
      </div>

      <!-- Keyword -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('keyword')}
        </label>
        <input
          type="text"
          value={keyword}
          onchange={(e) => handleKeywordChange(e.target.value)}
          placeholder={t('keywordPlaceholder')}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {#if keyword}
<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('effectiveKey')}: {keyword.toUpperCase().replace(/[^A-Z]/g, '') || t('none')}
          </p>
{/if}
      </div>

      <!-- Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tCommon('input')}
        </label>
        <textarea
          value={input}
          onchange={(e) => handleInputChange(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleProcess}
          disabled={!keyword}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium text-white"
        >
          {mode === 'encrypt' ? t('encrypt') : t('decrypt')}
        </button>
        <button
          onclick={swapInputOutput}
          disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          ↕ {t('swap')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tCommon('output')}
          </label>
          {#if output}
<button
              onclick={copyToClipboard}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
{/if}
        </div>
        <textarea
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono resize-none"></textarea>
      </div>

      <!-- Vigenère Table (Collapsible) -->
      <details class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <summary class="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          {t('showTable')}
        </summary>
        <div class="mt-4 overflow-x-auto">
          <table class="text-xs font-mono">
            <thead>
              <tr>
                <th class="p-1 text-gray-500 dark:text-gray-400"></th>
                {#each 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as char (char)}
<th  class="p-1 text-blue-600 dark:text-blue-400">{char}</th>
{/each}
              </tr>
            </thead>
            <tbody>
              {#each table as row, rowIndex (rowIndex)}
<tr >
                  <td class="p-1 text-blue-600 dark:text-blue-400 font-bold">
                    {String.fromCharCode(65 + rowIndex)}
                  </td>
                  {#each row as cell, colIndex (colIndex)}
<td  
                      class="p-1 text-center text-gray-700 dark:text-gray-300"
                    >
                      {cell}
                    </td>
{/each}
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  
