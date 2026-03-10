<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['loan-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.loan-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateLoan, type LoanResult } from '@/lib/calculator-utils';

  let principal = $state('100000');

  let interestRate = $state('5');

  let termMonths = $state('360');

  let paymentFrequency = $state('monthly');

  let result = $state(null);

  let showSchedule = $state(false);

  // Functions
  function calculate() {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const m = parseInt(termMonths);

    if (isNaN(p) || isNaN(r) || isNaN(m) || p <= 0 || r < 0 || m <= 0) {
      return;
    }

    const res = calculateLoan({
      principal: p,
      interestRate: r,
      termMonths: m,
      paymentFrequency,
    });
    result = res;
  }
  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="loan-principal" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('principal')}
          </label>
          <input
            id="loan-principal"
            name="principalAmount"
            type="number"
            bind:value={principal}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="100000"
          />
        </div>

        <div>
          <label for="loan-interest-rate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('interestRate')}
          </label>
          <input
            id="loan-interest-rate"
            name="interestRate"
            type="number"
            step="0.1"
            bind:value={interestRate}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="5"
          />
        </div>

        <div>
          <label for="loan-term-months" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('termMonths')}
          </label>
          <input
            id="loan-term-months"
            name="termMonths"
            type="number"
            bind:value={termMonths}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="360"
          />
        </div>

        <div>
          <label for="loan-payment-frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('paymentFrequency')}
          </label>
          <select
            id="loan-payment-frequency"
            name="paymentFrequency"
            value={paymentFrequency}
            onchange={(e) => paymentFrequency = e.target.value as 'monthly' | 'biweekly' | 'weekly'}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="monthly">{t('monthly')}</option>
            <option value="biweekly">{t('biweekly')}</option>
            <option value="weekly">{t('weekly')}</option>
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
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('periodicPayment')}</div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.periodicPayment)}
              </div>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalInterest')}</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalAmount')}</div>
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(result.totalAmount)}
              </div>
            </div>
          </div>

          <button
            onclick={() => showSchedule = !showSchedule}
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showSchedule ? t('hideSchedule') : t('showSchedule')}
          </button>

          {#if showSchedule}
<div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-100 dark:bg-gray-700">
                    <th class="px-3 py-2 text-left">{t('period')}</th>
                    <th class="px-3 py-2 text-right">{t('payment')}</th>
                    <th class="px-3 py-2 text-right">{t('principalPaid')}</th>
                    <th class="px-3 py-2 text-right">{t('interestPaid')}</th>
                    <th class="px-3 py-2 text-right">{t('balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {#each result.amortizationSchedule.slice(0, 24) as entry (entry.period)}
<tr  class="border-b dark:border-gray-700">
                      <td class="px-3 py-2">{entry.period}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.payment)}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.principal)}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.interest)}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.balance)}</td>
                    </tr>
{/each}
                </tbody>
              </table>
              {#if result.amortizationSchedule.length > 24}
<p class="text-sm text-gray-500 mt-2">
                  {t('showingFirst24', { total: result.amortizationSchedule.length })}
                </p>
{/if}
            </div>
{/if}
        </div>
{/if}
    </div>
  
