<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['phone-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.phone-formatter.${key}`;
  }

  // Types
  interface CountryFormat {
  code: string;
  name: string;
  dialCode: string;
  format: string;
  example: string;
}

  let phone = $state('');

  let country = $state('US');

  let includeDialCode = $state(true);

  let formatted = $state('');

  // Functions
  function formatPhone() {
    const digits = phone.replace(/\D/g, '');
    const selectedCountry = countryFormats.find(c => c.code === country);

    if (!selectedCountry || !digits) {
      formatted = '';
      return;
    }

    let result = selectedCountry.format;
    let digitIndex = 0;

    for (let i = 0; i < result.length && digitIndex < digits.length; i++) {
      if (result[i] === 'X') {
        result = result.substring(0, i) + digits[digitIndex] + result.substring(i + 1);
        digitIndex++;
      }
    }

    result = result.replace(/X/g, '').trim();

    if (includeDialCode) {
      result = `${selectedCountry.dialCode} ${result}`;
    }

    formatted = result;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(formatted);
  }
  const selectedCountry = countryFormats.find(c => c.code === country);

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('country')}
          </label>
          <select
            bind:value={country}
            class="tool-select font-medium"
          >
            {#each countryFormats as c (c.code)}
<option  value={c.code}>
                {c.name} ({c.dialCode})
              </option>
{/each}
          </select>
        </div>

        <div>
          <label class="tool-label">
            {t('phoneNumber')}
          </label>
          <input
            type="text"
            bind:value={phone}
            placeholder={t('inputPlaceholder')}
            class="tool-input"
          />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="includeDialCode"
          bind:checked={includeDialCode}
          class="w-4 h-4 text-blue-600 rounded"
        />
        <label for="includeDialCode" class="text-sm text-gray-700 dark:text-gray-300">
          {t('includeDialCode')}
        </label>
      </div>

      <button
        onclick={formatPhone}
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('format')}
      </button>

      {#if selectedCountry}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('formatPattern')}: <span class="font-mono">{selectedCountry.format}</span>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {t('example')}: <span class="font-mono">{selectedCountry.dialCode} {selectedCountry.example}</span>
          </div>
        </div>
{/if}

      {#if formatted}
<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('result')}</div>
              <div class="text-2xl font-mono text-gray-900 dark:text-white">{formatted}</div>
            </div>
            <button
              onclick={copyToClipboard}
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('copy')}
            </button>
          </div>
        </div>
{/if}

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-3">{t('allFormats')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {#each countryFormats as c (c.code)}
<div  class="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{c.name}</span>
              <span class="font-mono text-gray-500">{c.dialCode} {c.example}</span>
            </div>
{/each}
        </div>
      </div>
    </div>
  
