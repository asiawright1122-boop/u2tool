<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['currency-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.currency-converter.${key}`;
  }

  // Imports
  import { currencies, convertCurrency } from '@/lib/data/currencies';

  let amount = $state('100');

  let fromCurrency = $state('USD');

  let toCurrency = $state('EUR');

  let result = $state(null);

  let exchangeRate = $state(null);

  $effect(() => {
    calculate();
  });

  // Functions
  function calculate() {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      result = null;
      exchangeRate = null;
      return;
    }

    try {
      const converted = convertCurrency(numAmount, fromCurrency, toCurrency);
      const rate = convertCurrency(1, fromCurrency, toCurrency);
      result = converted;
      exchangeRate = rate;
    } catch {
      result = null;
      exchangeRate = null;
    }
  }
  function handleSwap() {
    fromCurrency = toCurrency;
    toCurrency = fromCurrency;
  }
  function getCurrencyInfo(code: string) {
    return currencies.find(c => c.code === code);
  }
  function formatResult(value: number, currencyCode: string) {
    const currency = getCurrencyInfo(currencyCode);
    if (!currency) return value.toFixed(2);
    const decimals = ['BTC', 'ETH'].includes(currencyCode) ? 8 : 2;
    return `${currency.symbol}${value.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    })}`;
  }
  const currencyGroups = {
    major: currencies.filter(c => ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD'].includes(c.code)),
    asian: currencies.filter(c => ['KRW', 'SGD', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'INR', 'PKR', 'HKD', 'NZD'].includes(c.code)),
    european: currencies.filter(c => ['SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'TRY', 'RUB', 'UAH'].includes(c.code)),
    americas: currencies.filter(c => ['MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN'].includes(c.code)),
    middleEast: currencies.filter(c => ['AED', 'SAR', 'ILS', 'EGP', 'ZAR', 'NGN', 'KES'].includes(c.code)),
    crypto: currencies.filter(c => ['BTC', 'ETH'].includes(c.code)),
  };

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('amount')}
        </label>
        <input
          type="number"
          bind:value={amount}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          placeholder="100"
          min="0"
          step="any"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('from')}
          </label>
          <select
            bind:value={fromCurrency}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('majorCurrencies')}>
              {#each currencyGroups.major as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('asianCurrencies')}>
              {#each currencyGroups.asian as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('europeanCurrencies')}>
              {#each currencyGroups.european as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('americasCurrencies')}>
              {#each currencyGroups.americas as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('middleEastCurrencies')}>
              {#each currencyGroups.middleEast as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('crypto')}>
              {#each currencyGroups.crypto as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
          </select>
        </div>

        <button
          onclick={handleSwap}
          class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors self-end mb-0.5"
          title={t('swap')}
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
        </button>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('to')}
          </label>
          <select
            bind:value={toCurrency}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('majorCurrencies')}>
              {#each currencyGroups.major as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('asianCurrencies')}>
              {#each currencyGroups.asian as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('europeanCurrencies')}>
              {#each currencyGroups.european as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('americasCurrencies')}>
              {#each currencyGroups.americas as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('middleEastCurrencies')}>
              {#each currencyGroups.middleEast as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
            <optgroup label={t('crypto')}>
              {#each currencyGroups.crypto as c (c.code)}
<option  value={c.code}>{c.code} - {c.name}</option>
{/each}
            </optgroup>
          </select>
        </div>
      </div>

      {#if result !== null}
<div class="space-y-4">
          <div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
            <div class="text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {formatResult(parseFloat(amount) || 0, fromCurrency)} =
              </div>
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatResult(result, toCurrency)}
              </div>
            </div>
          </div>

          {#if exchangeRate !== null}
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('exchangeRate')}</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                  1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                </div>
              </div>
              <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('inverseRate')}</div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white">
                  1 {toCurrency} = {(1 / exchangeRate).toFixed(6)} {fromCurrency}
                </div>
              </div>
            </div>
{/if}
        </div>
{/if}

      <div class="mt-6">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('quickConversions')}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700">
                <th class="px-3 py-2 text-left">{fromCurrency}</th>
                <th class="px-3 py-2 text-right">{toCurrency}</th>
              </tr>
            </thead>
            <tbody>
              {#each [1, 5, 10, 50, 100, 500, 1000] as val (val)}
<tr  class="border-b dark:border-gray-700">
                  <td class="px-3 py-2">{formatResult(val, fromCurrency)}</td>
                  <td class="px-3 py-2 text-right">
                    {formatResult(convertCurrency(val, fromCurrency, toCurrency), toCurrency)}
                  </td>
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400 mt-4">
        {t('disclaimer')}
      </p>
    </div>
  
