<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['caesar-cipher'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.caesar-cipher.${key}`;
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

  let shift = $state(3);

  let mode = $state('encrypt');

  let copied = $state(false);

  function handleProcess() {
    output = caesarCipher(input, shift, mode === 'decrypt');
  }

  // Functions
  function handleInputChange(value: string) {
    input = value;
    // Auto-process as user types
    output = caesarCipher(value, shift, mode === 'decrypt');
  }
  function handleShiftChange(newShift: number) {
    shift = newShift;
    if (input) {
      output = caesarCipher(input, newShift, mode === 'decrypt');
    }
  }
  function handleModeChange(newMode: 'encrypt' | 'decrypt') {
    mode = newMode;
    if (input) {
      output = caesarCipher(input, shift, newMode === 'decrypt');
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
  }
  function swapInputOutput() {
    input = output;
    // When swapping, we need to reverse the operation
    mode = mode === 'encrypt' ? 'decrypt' : 'encrypt';
    output = caesarCipher(output, shift, mode === 'encrypt');
  }

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

      <!-- Shift Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('shift')}: {shift}
        </label>
        <input
          type="range"
          min="1"
          max="25"
          value={shift}
          onchange={(e) => handleShiftChange(parseInt(e.target.value))}
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1</span>
          <span>13</span>
          <span>25</span>
        </div>
      </div>

      <!-- Quick Shift Buttons -->
      <div class="flex flex-wrap justify-center gap-2">
        {#each [1, 3, 5, 7, 13, 19, 23] as s (s)}
<button 
            onclick={() => handleShiftChange(s)}
            class={`px-3 py-1 rounded text-sm ${
              shift === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {s}
          </button>
{/each}
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
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
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

      <!-- Character Mapping Preview -->
      {#if shift > 0}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('mappingPreview')} ({t('shift')} = {shift})
          </h3>
          <div class="overflow-x-auto">
            <div class="flex gap-1 text-xs font-mono">
              {#each Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ') as char (char)}
<div  class="flex flex-col items-center">
                  <span class="text-gray-900 dark:text-gray-100">{char}</span>
                  <span class="text-gray-400">↓</span>
                  <span class="text-blue-600 dark:text-blue-400">{caesarCipher(char, shift)}</span>
                </div>
{/each}
            </div>
          </div>
        </div>
{/if}
    </div>
  
