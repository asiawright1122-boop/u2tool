<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['number-system-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.number-system-converter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Base = 2 | 8 | 10 | 16;

  let inputValue = $state('255');

  let inputBase = $state(10);

  let error = $state('');

  function validateInput(value: string, base: Base) {
    if (!value.trim()) return true;
    const patterns: Record<Base, RegExp> = {
      2: /^[01]+$/i, 8: /^[0-7]+$/i, 10: /^[0-9]+$/i, 16: /^[0-9a-f]+$/i
    };
    return patterns[base].test(value.trim());
  }

  function convert(value: string, fromBase: Base, toBase: Base) {
    if (!value.trim()) return '';
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return '';
      return decimal.toString(toBase).toUpperCase();
    } catch { return ''; }
  }

  // Functions
  const baseNames: Record<Base, string> = { 2: t('binary'), 8: t('octal'), 10: t('decimal'), 16: t('hexadecimal') };
  const basePrefixes: Record<Base, string> = { 2: '0b', 8: '0o', 10: '', 16: '0x' };
  function handleInputChange(value: string) {
    inputValue = value;
    if (!validateInput(value, inputBase)) {
      error = t('invalidInput', { base: baseNames[inputBase] });
    } else {
      error = '';
    }
  }
  function handleBaseChange(base: Base) {
    inputBase = base;
    if (!validateInput(inputValue, base)) {
      error = t('invalidInput', { base: baseNames[base] });
    } else {
      error = '';
    }
  }
  const bases: Base[] = [2, 8, 10, 16];
  const isValid = !error && inputValue.trim();

</script>


    <div class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
        <div class="space-y-4">
          <div>
            <div class="tool-label">{t('inputBase')}</div>
            <div class="flex gap-2 flex-wrap">
              {#each bases as base (base)}
<button  onclick={() => handleBaseChange(base)}
                  class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    inputBase === base ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                  {baseNames[base]}
                </button>
{/each}
            </div>
          </div>
          <div>
            <label for="number-system-converter-field-3" class="tool-label">{tCommon('input')}</label>
            <div class="flex items-center gap-2">
              <span class="text-gray-500 font-mono">{basePrefixes[inputBase]}</span>
              <input type="text" bind:value={inputValue}
                class={`flex-1 p-3 border rounded-lg font-mono text-lg dark:bg-gray-700 dark:border-gray-600 ${error ? 'border-red-500' : ''}`}
                placeholder={tCommon('inputPlaceholder')} id="number-system-converter-field-3" />
            </div>
            {#if error}
<p class="mt-1 text-sm text-red-500">{error}</p>
{/if}
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('results')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each bases as base (base)}
<div  class={`p-4 rounded-lg ${inputBase === base ? 'bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{baseNames[base]}</div>
              <div class="font-mono text-lg text-gray-900 dark:text-white break-all">
                {#if isValid}
<span class="text-gray-400">{basePrefixes[base]}</span>{convert(inputValue, inputBase, base)}
{:else}
{'-'}
{/if}
              </div>
            </div>
{/each}
        </div>
      </div>

      {#if isValid}
<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('bitRepresentation')}</h3>
          <div class="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
            {convert(inputValue, inputBase, 2).padStart(Math.ceil(convert(inputValue, inputBase, 2).length / 8) * 8, '0').match(/.{1,4}/g)?.join(' ')}
          </div>
        </div>
{/if}
    </div>
  
