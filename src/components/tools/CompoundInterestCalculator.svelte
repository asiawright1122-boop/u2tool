<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['compound-interest-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.compound-interest-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateCompoundInterest, type CompoundInterestResult } from '@/lib/calculator-utils';

  let principal = $state('10000');

  let annualRate = $state('7');

  let years = $state('10');

  let compoundingFrequency = $state('monthly');

  let regularContribution = $state('0');

  let contributionFrequency = $state('monthly');

  let result = $state(null);

  // Functions
  function calculate() {
    const p = parseFloat(principal);
    const r = parseFloat(annualRate);
    const y = parseInt(years);
    const c = parseFloat(regularContribution) || 0;

    if (isNaN(p) || isNaN(r) || isNaN(y) || p < 0 || r < 0 || y <= 0) {
      return;
    }

    const res = calculateCompoundInterest({
      principal: p,
      annualRate: r,
      years: y,
      compoundingFrequency,
      regularContribution: c,
      contributionFrequency,
    });
    result = res;
  }
  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="compound-principal" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('principal')}
          </label>
          <input
            id="compound-principal"
            name="principalAmount"
            type="number"
            bind:value={principal}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="10000"
          />
        </div>

        <div>
          <label for="compound-rate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('annualRate')}
          </label>
          <input
            id="compound-rate"
            name="annualRate"
            type="number"
            step="0.1"
            bind:value={annualRate}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="7"
          />
        </div>

        <div>
          <label for="compound-years" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('years')}
          </label>
          <input
            id="compound-years"
            name="yearsValue"
            type="number"
            bind:value={years}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="10"
          />
        </div>

        <div>
          <label for="compound-frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('compoundingFrequency')}
          </label>
          <select
            id="compound-frequency"
            name="compoundingFrequency"
            value={compoundingFrequency}
            onchange={(e) => compoundingFrequency = e.target.value as typeof compoundingFrequency}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="daily">{t('daily')}</option>
            <option value="monthly">{t('monthly')}</option>
            <option value="quarterly">{t('quarterly')}</option>
            <option value="annually">{t('annually')}</option>
          </select>
        </div>

        <div>
          <label for="compound-contribution" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('regularContribution')}
          </label>
          <input
            id="compound-contribution"
            name="regularContribution"
            type="number"
            bind:value={regularContribution}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="0"
          />
        </div>

        <div>
          <label for="compound-contrib-freq" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('contributionFrequency')}
          </label>
          <select
            id="compound-contrib-freq"
            name="contributionFrequency"
            value={contributionFrequency}
            onchange={(e) => contributionFrequency = e.target.value as 'monthly' | 'annually'}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="monthly">{t('monthly')}</option>
            <option value="annually">{t('annually')}</option>
          </select>
        </div>
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if result}
<div class="space-y-4">
          <div class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
            <div class="text-sm opacity-80">{t('finalAmount')}</div>
            <div class="text-4xl font-bold">{formatCurrency(result.finalAmount)}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('initialInvestment')}</div>
              <div class="text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(parseFloat(principal))}
              </div>
            </div>
            <div class="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalContributions')}</div>
              <div class="text-xl font-bold text-slate-600 dark:text-slate-400">
                {formatCurrency(result.totalContributions)}
              </div>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalInterest')}</div>
              <div class="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="font-semibold mb-3">{t('growthOverTime')}</h3>
            <div class="space-y-2">
              {#each result.growthData.filter((_, i) => i % Math.ceil(result.growthData.length / 5) === 0 || i === result.growthData.length - 1) as data (data.year)}
<div  class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">{t('year')} {data.year}</span>
                  <div class="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-green-500 rounded-full"
                      style="width: {(data.balance / result.finalAmount) * 100}%"></div>
                  </div>
                  <span class="font-medium">{formatCurrency(data.balance)}</span>
                </div>
{/each}
            </div>
          </div>
        </div>
{/if}
    </div>
  
