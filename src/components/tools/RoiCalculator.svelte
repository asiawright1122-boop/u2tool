<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['roi-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.roi-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface RoiResult {
  simpleRoi: number;
  annualizedRoi: number;
  totalGain: number;
  totalReturn: number;
}

  let initialInvestment = $state('10000');

  let finalValue = $state('15000');

  let timePeriod = $state('3');

  let timeUnit = $state('years');

  let result = $state(null);

  // Functions
  function calculate() {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const period = parseFloat(timePeriod);

    if (isNaN(initial) || isNaN(final) || isNaN(period) || initial <= 0 || period <= 0) {
      return;
    }

    // Convert months to years if needed
    const years = timeUnit === 'months' ? period / 12 : period;

    // Simple ROI = ((Final Value - Initial Investment) / Initial Investment) * 100
    const totalGain = final - initial;
    const simpleRoi = (totalGain / initial) * 100;

    // Annualized ROI = ((1 + ROI)^(1/years) - 1) * 100
    const totalReturn = final / initial;
    const annualizedRoi = years > 0 ? (Math.pow(totalReturn, 1 / years) - 1) * 100 : simpleRoi;

    result = {
      simpleRoi,
      annualizedRoi,
      totalGain,
      totalReturn,
    };
  }
  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }
  function formatPercent(value: number) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="roi-initial" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('initialInvestment')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="roi-initial"
              name="initialInvestment"
              type="number"
              bind:value={initialInvestment}
              class="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="10000"
              min="0"
            />
          </div>
        </div>

        <div>
          <label for="roi-final" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('finalValue')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="roi-final"
              name="finalValue"
              type="number"
              bind:value={finalValue}
              class="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="15000"
              min="0"
            />
          </div>
        </div>

        <div>
          <label for="roi-period" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('timePeriod')}
          </label>
          <input
            id="roi-period"
            name="timePeriod"
            type="number"
            bind:value={timePeriod}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="3"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('timeUnit')}
          </label>
          <select
            value={timeUnit}
            onchange={(e) => timeUnit = e.target.value as 'years' | 'months'}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="years">{t('years')}</option>
            <option value="months">{t('months')}</option>
          </select>
        </div>
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if result}
<div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('simpleRoi')}</div>
              <div class={`text-2xl font-bold ${result.simpleRoi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercent(result.simpleRoi)}
              </div>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('annualizedRoi')}</div>
              <div class={`text-2xl font-bold ${result.annualizedRoi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercent(result.annualizedRoi)}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalGain')}</div>
              <div class={`text-xl font-semibold ${result.totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.totalGain >= 0 ? '+' : ''}{formatCurrency(result.totalGain)}
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalReturn')}</div>
              <div class="text-xl font-semibold text-gray-900 dark:text-white">
                {result.totalReturn.toFixed(2)}x
              </div>
            </div>
          </div>

          <!-- Calculation Breakdown -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('calculationBreakdown')}
            </h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span class="font-medium">{t('simpleRoiFormula')}:</span> ((Final - Initial) / Initial) × 100
              </p>
              <p class="pl-4">
                = (({formatCurrency(parseFloat(finalValue))} - {formatCurrency(parseFloat(initialInvestment))}) / {formatCurrency(parseFloat(initialInvestment))}) × 100
              </p>
              <p class="pl-4 font-medium text-gray-900 dark:text-white">
                = {formatPercent(result.simpleRoi)}
              </p>
              <hr class="my-2 border-gray-200 dark:border-gray-700" />
              <p>
                <span class="font-medium">{t('annualizedRoiFormula')}:</span> ((1 + ROI)^(1/years) - 1) × 100
              </p>
              <p class="pl-4 font-medium text-gray-900 dark:text-white">
                = {formatPercent(result.annualizedRoi)}
              </p>
            </div>
          </div>
        </div>
{/if}
    </div>
  
