<script lang="ts">
  import { ibanSpecs } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string, params: Record<string, string | number> = {}): string {
    const scope = translations['tools']['iban-validator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    const text = typeof value === 'string' ? value : `MISSING: tools.iban-validator.${key}`;
    return Object.entries(params).reduce(
      (current, [name, replacement]) => current.replace(new RegExp(`\\{${name}\\}`, 'g'), String(replacement)),
      text
    );
  }

  let iban = $state('');

  let result = $state(null);

  // Functions
  function formatIban(value: string): string {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }
  function validateMod97(iban: string): boolean {
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numericIban = rearranged.replace(/[A-Z]/g, (char) => 
      (char.charCodeAt(0) - 55).toString()
    );
    
    let remainder = '';
    for (const digit of numericIban) {
      remainder = ((parseInt(remainder + digit, 10)) % 97).toString();
    }
    return parseInt(remainder, 10) === 1;
  }
  function validate() {
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    
    if (!cleaned) {
      result = { valid: false, error: t('errors.empty') };
      return;
    }

    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
      result = { valid: false, error: t('errors.invalidFormat') };
      return;
    }

    const countryCode = cleaned.slice(0, 2);
    const spec = ibanSpecs[countryCode];

    if (!spec) {
      result = { valid: false, error: t('errors.unknownCountry') };
      return;
    }

    if (cleaned.length !== spec.length) {
      result = { 
        valid: false, 
        error: t('errors.invalidLength', { expected: spec.length, actual: cleaned.length })
      };
      return;
    }

    if (!validateMod97(cleaned)) {
      result = { valid: false, error: t('errors.invalidChecksum') };
      return;
    }

    result = {
      valid: true,
      country: spec.name,
      countryCode,
      checkDigits: cleaned.slice(2, 4),
      bban: cleaned.slice(4),
      bankCode: cleaned.slice(4, 8),
      formattedIban: formatIban(cleaned),
    };
  }
  function handleInputChange(e: Event) {
    const value = e.target.value.toUpperCase();
    iban = value;
    result = null;
  }
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

</script>


    <div class="space-y-6">
      <div>
        <label for="iban-validator-field-2" class="tool-label">
          {t('inputLabel')}
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            value={iban}
            oninput={handleInputChange}
            placeholder={t('placeholder')}
            class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg" id="iban-validator-field-2" />
          <button
            onclick={validate}
            class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {t('validate')}
          </button>
        </div>
      </div>

      {#if result}
<div class={`p-6 rounded-xl ${
          result.valid 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div class="flex items-center gap-3 mb-4">
            <span class={`text-3xl ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
              {result.valid ? '✓' : '✗'}
            </span>
            <span class={`text-xl font-semibold ${
              result.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {result.valid ? t('valid') : t('invalid')}
            </span>
          </div>

          {#if result.error}
<p class="text-red-600 dark:text-red-400">{result.error}</p>
{/if}

          {#if result.valid}
<div class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('country')}</div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {result.country} ({result.countryCode})
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('checkDigits')}</div>
                  <div class="font-medium text-gray-900 dark:text-white font-mono">
                    {result.checkDigits}
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('bankCode')}</div>
                  <div class="font-medium text-gray-900 dark:text-white font-mono">
                    {result.bankCode}
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('bban')}</div>
                  <div class="font-medium text-gray-900 dark:text-white font-mono text-sm">
                    {result.bban}
                  </div>
                </div>
              </div>
              
              <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('formatted')}</div>
                <div class="flex items-center justify-between">
                  <span class="font-mono text-lg text-gray-900 dark:text-white">
                    {result.formattedIban}
                  </span>
                  <button
                    onclick={() => copyToClipboard(result.formattedIban || '')}
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {t('copy')}
                  </button>
                </div>
              </div>
            </div>
{/if}
        </div>
{/if}

      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('exampleIbans')}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {#each Object.entries(ibanSpecs).slice(0, 12) as [code, spec] (code)}
<button 
              onclick={() => {
                iban = spec.example;
                result = null;
              }}
              class="p-2 text-left bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="text-sm font-medium text-gray-900 dark:text-white">{spec.name}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                {formatIban(spec.example)}
              </div>
            </button>
{/each}
        </div>
      </div>
    </div>
  
