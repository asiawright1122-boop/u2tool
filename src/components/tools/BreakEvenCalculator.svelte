<script lang="ts">
  import { calculateBreakEven } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['break-even-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.break-even-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}

  let fixedCosts = $state('10000');

  let variableCostPerUnit = $state('25');

  let sellingPricePerUnit = $state('50');

  let result = $state(null);

  let error = $state('');

  function handleCalculate() {
    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCostPerUnit);
    const selling = parseFloat(sellingPricePerUnit);
    
    if (isNaN(fixed) || isNaN(variable) || isNaN(selling)) {
      error = t('invalidInput');
      result = null;
      return;
    }
    
    if (selling <= variable) {
      error = t('priceError');
      result = null;
      return;
    }
    
    error = '';
    result = calculateBreakEven(fixed, variable, selling);
  }

  // Functions
  function clearAll() {
    fixedCosts = '10000';
    variableCostPerUnit = '25';
    sellingPricePerUnit = '50';
    result = null;
    error = '';
  }
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.ceil(value));
  }
  function generateProfitTable() {
    if (!result) return [];
    
    const units = [
      0,
      Math.floor(result.breakEvenUnits * 0.5),
      Math.floor(result.breakEvenUnits * 0.75),
      Math.ceil(result.breakEvenUnits),
      Math.ceil(result.breakEvenUnits * 1.25),
      Math.ceil(result.breakEvenUnits * 1.5),
      Math.ceil(result.breakEvenUnits * 2),
    ];
    
    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCostPerUnit);
    const selling = parseFloat(sellingPricePerUnit);
    
    return units.map(unit => ({
      units: unit,
      revenue: unit * selling,
      totalCosts: fixed + (unit * variable),
      profit: (unit * selling) - fixed - (unit * variable),
    }));
  }

</script>


    <div class="space-y-6">
      <!-- Info -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          {t('info')}
        </p>
      </div>

      <!-- Input Form -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="breakeven-fixed-costs" class="tool-label">
            {t('fixedCosts')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="breakeven-fixed-costs"
              name="fixedCosts"
              type="number"
              bind:value={fixedCosts}
              placeholder="10000"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('fixedCostsHint')}</p>
        </div>

        <div>
          <label for="breakeven-variable-cost" class="tool-label">
            {t('variableCostPerUnit')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="breakeven-variable-cost"
              name="variableCostPerUnit"
              type="number"
              bind:value={variableCostPerUnit}
              placeholder="25"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('variableCostHint')}</p>
        </div>

        <div>
          <label for="breakeven-selling-price" class="tool-label">
            {t('sellingPricePerUnit')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="breakeven-selling-price"
              name="sellingPricePerUnit"
              type="number"
              bind:value={sellingPricePerUnit}
              placeholder="50"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Error Message -->
      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
{/if}

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleCalculate}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-white"
        >
          {t('calculate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p class="text-sm text-green-600 dark:text-green-400">{t('breakEvenUnits')}</p>
              <p class="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatNumber(result.breakEvenUnits)}
              </p>
              <p class="text-xs text-green-600 dark:text-green-400">{t('units')}</p>
            </div>
            
            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p class="text-sm text-amber-600 dark:text-amber-400">{t('breakEvenRevenue')}</p>
              <p class="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {formatCurrency(result.breakEvenRevenue)}
              </p>
            </div>
            
            <div class="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-lg">
              <p class="text-sm text-slate-600 dark:text-slate-400">{t('contributionMargin')}</p>
              <p class="text-2xl font-bold text-slate-700 dark:text-slate-300">
                {formatCurrency(result.contributionMargin)}
              </p>
              <p class="text-xs text-slate-600 dark:text-slate-400">{t('perUnit')}</p>
            </div>
            
            <div class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p class="text-sm text-orange-600 dark:text-orange-400">{t('contributionMarginRatio')}</p>
              <p class="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {result.contributionMarginRatio.toFixed(1)}%
              </p>
            </div>
          </div>

          <!-- Profit/Loss Table -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('profitLossTable')}</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="py-2 px-3 text-left text-gray-500 dark:text-gray-400">{t('units')}</th>
                    <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('revenue')}</th>
                    <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('totalCosts')}</th>
                    <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('profitLoss')}</th>
                  </tr>
                </thead>
                <tbody>
                  {#each generateProfitTable() as row, index (row.units)}
<tr  
                      class={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : ''} ${
                        Math.ceil(result.breakEvenUnits) === row.units ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                      }`}
                    >
                      <td class="py-2 px-3 text-gray-900 dark:text-gray-100">
                        {formatNumber(row.units)}
                        {#if Math.ceil(result.breakEvenUnits) === row.units}
<span class="ml-2 text-xs text-yellow-600 dark:text-yellow-400">({t('breakEven')})</span>
{/if}
                      </td>
                      <td class="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.revenue)}</td>
                      <td class="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.totalCosts)}</td>
                      <td class={`py-2 px-3 text-right font-medium ${
                        row.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(row.profit)}
                      </td>
                    </tr>
{/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Formula -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('formula')}</h3>
            <code class="text-sm text-gray-600 dark:text-gray-400">
              {t('breakEvenUnits')} = {t('fixedCosts')} ÷ ({t('sellingPricePerUnit')} - {t('variableCostPerUnit')})
            </code>
          </div>
        </div>
{/if}
    </div>
  
