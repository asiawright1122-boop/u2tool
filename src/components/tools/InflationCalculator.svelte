<script lang="ts">
  import { calculateInflation } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['inflation-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.inflation-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface InflationResult {
  adjustedValue: number;
  totalInflation: number;
  purchasingPowerLoss: number;
  yearlyBreakdown: { year: number; value: number; inflation: number }[];
}

  let amount = $state('1000');

  let startYear = $state(String(new Date().getFullYear() - 10));

  let endYear = $state(String(new Date().getFullYear()));

  let annualRate = $state('3');

  let result = $state(null);

  function handleCalculate() {
    const amountNum = parseFloat(amount);
    const startYearNum = parseInt(startYear);
    const endYearNum = parseInt(endYear);
    const rateNum = parseFloat(annualRate);
    
    if (isNaN(amountNum) || isNaN(startYearNum) || isNaN(endYearNum) || isNaN(rateNum)) {
      return;
    }
    
    if (startYearNum >= endYearNum) {
      return;
    }
    
    result = calculateInflation(amountNum, startYearNum, endYearNum, rateNum);
  }

  // Functions
  function clearAll() {
    amount = '1000';
    startYear = String(new Date().getFullYear() - 10);
    endYear = String(new Date().getFullYear());
    annualRate = '3';
    result = null;
  }
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  function formatPercent(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('amount')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              bind:value={amount}
              placeholder="1000"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="tool-label">
            {t('annualRate')}
          </label>
          <div class="relative">
            <input
              type="number"
              bind:value={annualRate}
              placeholder="3"
              step="0.1"
              class="w-full pr-8 pl-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>

        <div>
          <label class="tool-label">
            {t('startYear')}
          </label>
          <input
            type="number"
            bind:value={startYear}
            placeholder="2014"
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="tool-label">
            {t('endYear')}
          </label>
          <input
            type="number"
            bind:value={endYear}
            placeholder="2024"
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Quick Rate Buttons -->
      <div>
        <label class="tool-label">
          {t('commonRates')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each [2, 2.5, 3, 3.5, 4, 5, 6, 7, 8] as rate (rate)}
<button 
              onclick={() => annualRate = String(rate)}
              class={`px-3 py-1 rounded text-sm ${
                annualRate === String(rate)
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {rate}%
            </button>
{/each}
        </div>
      </div>

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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p class="text-sm text-green-600 dark:text-green-400">{t('adjustedValue')}</p>
              <p class="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(result.adjustedValue)}
              </p>
            </div>
            
            <div class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p class="text-sm text-orange-600 dark:text-orange-400">{t('totalInflation')}</p>
              <p class="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatPercent(result.totalInflation)}
              </p>
            </div>
            
            <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-600 dark:text-red-400">{t('purchasingPowerLoss')}</p>
              <p class="text-2xl font-bold text-red-700 dark:text-red-300">
                -{result.purchasingPowerLoss.toFixed(2)}%
              </p>
            </div>
          </div>

          <!-- Yearly Breakdown -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('yearlyBreakdown')}</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="py-2 px-3 text-left text-gray-500 dark:text-gray-400">{t('year')}</th>
                    <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('value')}</th>
                    <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('cumulativeInflation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {#each result.yearlyBreakdown as row, index (row.year)}
<tr  class={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : ''}>
                      <td class="py-2 px-3 text-gray-900 dark:text-gray-100">{row.year}</td>
                      <td class="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.value)}</td>
                      <td class="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatPercent(row.inflation)}</td>
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
              FV = PV × (1 + r)^n
            </code>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('formulaExplanation')}
            </p>
          </div>
        </div>
{/if}
    </div>
  
