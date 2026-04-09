<script lang="ts">
  import { bicDatabase, countryNames } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['bic-swift-lookup'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.bic-swift-lookup.${key}`;
  }

  let bicCode = $state('');

  let result = $state(null);

  // Functions
  function validateBic(bic: string): boolean {
    // BIC format: 4 letters (bank) + 2 letters (country) + 2 alphanumeric (location) + optional 3 alphanumeric (branch)
    const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    return bicRegex.test(bic);
  }
  function lookup() {
    const cleaned = bicCode.replace(/\s/g, '').toUpperCase();

    if (!cleaned) {
      result = { valid: false, error: t('errors.empty') };
      return;
    }

    if (!validateBic(cleaned)) {
      result = { valid: false, error: t('errors.invalidFormat') };
      return;
    }

    const bankCode = cleaned.slice(0, 4);
    const countryCode = cleaned.slice(4, 6);
    const locationCode = cleaned.slice(6, 8);
    const branchCode = cleaned.length === 11 ? cleaned.slice(8, 11) : undefined;

    const countryName = countryNames[countryCode];
    if (!countryName) {
      result = { valid: false, error: t('errors.unknownCountry') };
      return;
    }

    // Look up in database (try with and without branch code)
    const bankInfo = bicDatabase[cleaned] || bicDatabase[cleaned.slice(0, 8)];

    result = {
      valid: true,
      bankCode,
      countryCode,
      countryName,
      locationCode,
      branchCode,
      bankInfo,
    };
  }
  function handleInputChange(e: Event) {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    bicCode = value;
    result = null;
  }
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
  const banksByCountry = Object.entries(bicDatabase).reduce((acc, [bic, info]) => {
    if (!acc[info.country]) acc[info.country] = [];
    if (!acc[info.country].find(b => b.bic.slice(0, 8) === bic.slice(0, 8))) {
      acc[info.country].push({ bic, ...info });
    }
    return acc;
  }, {} as Record<string, Array<{ bic: string; bankName: string; city: string; country: string }>>);

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            value={bicCode}
            onchange={handleInputChange}
            placeholder={t('placeholder')}
            maxLength={11}
            class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg tracking-wider"
          />
          <button
            onclick={lookup}
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('lookup')}
          </button>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t('formatHint')}
        </p>
      </div>

      {#if result}
<div class={`p-6 rounded-xl ${
          result.valid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {#if result.error}
<div class="flex items-center gap-3">
              <span class="text-3xl text-red-500">✗</span>
              <span class="text-red-700 dark:text-red-300">{result.error}</span>
            </div>
{:else}
<div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="text-3xl text-green-500">✓</span>
                <span class="text-xl font-semibold text-green-700 dark:text-green-300">
                  {t('validBic')}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('bankCode')}</div>
                  <div class="font-mono font-medium text-gray-900 dark:text-white">
                    {result.bankCode}
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('country')}</div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {result.countryName} ({result.countryCode})
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('locationCode')}</div>
                  <div class="font-mono font-medium text-gray-900 dark:text-white">
                    {result.locationCode}
                  </div>
                </div>
                <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{t('branchCode')}</div>
                  <div class="font-mono font-medium text-gray-900 dark:text-white">
                    {result.branchCode || 'XXX'} ({result.branchCode ? t('specificBranch') : t('headOffice')})
                  </div>
                </div>
              </div>

              {#if result.bankInfo}
<div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 class="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    {t('bankInformation')}
                  </h4>
                  <div class="space-y-1 text-gray-700 dark:text-gray-300">
                    <p><strong>{t('bankName')}:</strong> {result.bankInfo.bankName}</p>
                    <p><strong>{t('city')}:</strong> {result.bankInfo.city}</p>
                    <p><strong>{t('country')}:</strong> {result.bankInfo.country}</p>
                    {#if result.bankInfo.branch}
<p><strong>{t('branch')}:</strong> {result.bankInfo.branch}</p>
{/if}
                  </div>
                </div>
{/if}

              <div class="flex gap-2">
                <button
                  onclick={() => copyToClipboard(bicCode.toUpperCase())}
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                >
                  {t('copyBic')}
                </button>
              </div>
            </div>
{/if}
        </div>
{/if}

      <!-- BIC Structure Explanation -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('bicStructure')}
        </h3>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
            <div class="font-mono font-bold text-blue-700 dark:text-blue-300">AAAA</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{t('structure.bank')}</div>
          </div>
          <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded">
            <div class="font-mono font-bold text-green-700 dark:text-green-300">BB</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{t('structure.country')}</div>
          </div>
          <div class="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
            <div class="font-mono font-bold text-yellow-700 dark:text-yellow-300">CC</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{t('structure.location')}</div>
          </div>
          <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded">
            <div class="font-mono font-bold text-purple-700 dark:text-purple-300">DDD</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">{t('structure.branch')}</div>
          </div>
        </div>
      </div>

      <!-- Sample BIC Codes -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('sampleCodes')}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {#each Object.entries(banksByCountry).slice(0, 6) as [country, banks]}
            {#each banks.slice(0, 2) as bank}
              <button
                onclick={() => {
                  bicCode = bank.bic;
                  result = null;
                }}
                class="p-2 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {bank.bic}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {bank.bankName}
                </div>
              </button>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  
