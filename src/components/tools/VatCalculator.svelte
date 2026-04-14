<script lang="ts">
  import { vatRates } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['vat-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.vat-calculator.${key}`;
  }

  // Types
  type CalculationMode = 'addVat' | 'removeVat' | 'vatOnly';

  let amount = $state('100');

  let country = $state('DE');

  let customRate = $state('');

  let useCustomRate = $state(false);

  let mode = $state('addVat');

  let selectedRateType = $state('standard');

  let reducedIndex = $state(0);

  let result = $state(null);

  $effect(() => {
    calculate();
  });

  // Functions
  function getVatRate(): number {
    if (useCustomRate) {
      return parseFloat(customRate) || 0;
    }
    const countryData = vatRates[country];
    if (!countryData) return 0;

    if (selectedRateType === 'standard') return countryData.standard;
    if (selectedRateType === 'superReduced' && countryData.superReduced) return countryData.superReduced;
    if (selectedRateType === 'reduced' && countryData.reduced.length > 0) {
      return countryData.reduced[reducedIndex] || countryData.reduced[0];
    }
    return countryData.standard;
  }
  function calculate() {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      result = null;
      return;
    }

    const vatRate = getVatRate();
    const vatMultiplier = vatRate / 100;

    let netAmount: number;
    let vatAmount: number;
    let grossAmount: number;

    switch (mode) {
      case 'addVat':
        netAmount = numAmount;
        vatAmount = numAmount * vatMultiplier;
        grossAmount = numAmount + vatAmount;
        break;
      case 'removeVat':
        grossAmount = numAmount;
        netAmount = numAmount / (1 + vatMultiplier);
        vatAmount = grossAmount - netAmount;
        break;
      case 'vatOnly':
        netAmount = numAmount;
        vatAmount = numAmount * vatMultiplier;
        grossAmount = numAmount + vatAmount;
        break;
      default:
        return;
    }

    result = { netAmount, vatAmount, grossAmount, vatRate };
  }
  const countryData = vatRates[country];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('amount')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
            <input
              type="number"
              bind:value={amount}
              class="tool-input pl-8 text-lg"
              placeholder="100.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label class="tool-label">
            {t('calculationMode')}
          </label>
          <select
            value={mode}
            onchange={(e) => mode = e.target.value as CalculationMode}
            class="tool-select"
          >
            <option value="addVat">{t('addVat')}</option>
            <option value="removeVat">{t('removeVat')}</option>
            <option value="vatOnly">{t('vatOnly')}</option>
          </select>
        </div>
      </div>

      <div class="tool-card space-y-4">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              bind:checked={useCustomRate}
              class="w-4 h-4 rounded"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">{t('useCustomRate')}</span>
          </label>
        </div>

        {#if useCustomRate}
<div>
            <label class="tool-label">
              {t('customRate')}
            </label>
            <div class="relative w-48">
              <input
                type="number"
                bind:value={customRate}
                class="tool-input pr-8"
                placeholder="19"
                min="0"
                max="100"
                step="0.1"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
{:else}
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="tool-label">
                {t('country')}
              </label>
              <select
                value={country}
                onchange={(e) => {
                  country = e.target.value;
                  selectedRateType = 'standard';
                  reducedIndex = 0;
                }}
                class="tool-select"
              >
                {#each Object.entries(vatRates) as [code, data] (code)}
<option  value={code}>
                    {data.name} ({data.standard}%)
                  </option>
{/each}
              </select>
            </div>

            <div>
              <label class="tool-label">
                {t('rateType')}
              </label>
              <select
                value={selectedRateType === 'reduced' ? `reduced-${reducedIndex}` : selectedRateType}
                onchange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('reduced-')) {
                    selectedRateType = 'reduced';
                    reducedIndex = parseInt(value.split('-')[1]);
                  } else {
                    selectedRateType = value as 'standard' | 'superReduced';
                  }
                }}
                class="tool-select"
              >
                <option value="standard">
                  {t('standardRate')} ({countryData?.standard}%)
                </option>
                {#each countryData?.reduced as rate, index (index)}
<option  value={`reduced-${index}`}>
                    {t('reducedRate')} ({rate}%)
                  </option>
{/each}
                {#if countryData?.superReduced}
<option value="superReduced">
                    {t('superReducedRate')} ({countryData.superReduced}%)
                  </option>
{/if}
              </select>
            </div>
          </div>
{/if}
      </div>

      {#if result}
<div class="p-6 bg-gradient-to-r from-amber-50 to-slate-50 dark:from-amber-900/20 dark:to-slate-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('netAmount')}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                €{result.netAmount.toFixed(2)}
              </div>
            </div>
            <div class="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('vatAmount')} ({result.vatRate}%)
              </div>
              <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                €{result.vatAmount.toFixed(2)}
              </div>
            </div>
            <div class="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm">
              <div class="text-sm text-gray-500 dark:text-gray-400">{t('grossAmount')}</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                €{result.grossAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
{/if}

      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('euVatRates')}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700">
                <th class="px-3 py-2 text-left">{t('country')}</th>
                <th class="px-3 py-2 text-center">{t('standardRate')}</th>
                <th class="px-3 py-2 text-center">{t('reducedRates')}</th>
              </tr>
            </thead>
            <tbody>
              {#each Object.entries(vatRates).slice(0, 10) as [code, data] (code)}
<tr  class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-3 py-2">{data.name}</td>
                  <td class="px-3 py-2 text-center font-medium">{data.standard}%</td>
                  <td class="px-3 py-2 text-center text-gray-500">
                    {data.reduced.length > 0 ? data.reduced.join('%, ') + '%' : '-'}
                  </td>
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
