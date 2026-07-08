<script lang="ts">
  import { rot13 } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['rot13-encoder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.rot13-encoder.${key}`;
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

  let copied = $state(false);

  function handleEncode() {
    output = rot13(input);
  }

  // Functions
  function handleInputChange(value: string) {
    input = value;
    // Auto-encode as user types
    output = rot13(value);
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function clearAll() {
    input = '';
    output = '';
  }
  function swapInputOutput() {
    input = output;
    output = rot13(output);
  }

</script>


    <div class="space-y-6">
      <!-- Info -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          {t('info')}
        </p>
      </div>

      <!-- Input -->
      <div>
        <label class="tool-label">
          {tCommon('input')}
        </label>
        <textarea
          value={input}
          onchange={(e) => handleInputChange(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={6}
          class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleEncode}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-white"
        >
          {t('encode')}
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

      <!-- Character Mapping Table -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('mappingTable')}</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-xs font-mono">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="py-2 px-1 text-left text-gray-500 dark:text-gray-400">{t('original')}</th>
                {#each Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ') as char (char)}
<th  class="py-2 px-1 text-center text-gray-900 dark:text-gray-100">{char}</th>
{/each}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="py-2 px-1 text-gray-500 dark:text-gray-400">{t('encoded')}</td>
                {#each Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ') as char (char)}
<td  class="py-2 px-1 text-center text-amber-600 dark:text-amber-400">{rot13(char)}</td>
{/each}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
