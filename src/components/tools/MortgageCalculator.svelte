<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['mortgage-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.mortgage-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}
  interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationEntry[];
}

  let loanAmount = $state('300000');

  let interestRate = $state('6.5');

  let loanTerm = $state('30');

  let downPayment = $state('60000');

  let extraPayment = $state('0');

  let result = $state(null);

  let showSchedule = $state(false);

  // Functions
  function calculate() {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment || '0');
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
    const months = parseFloat(loanTerm) * 12;
    const extra = parseFloat(extraPayment || '0');

    if (isNaN(principal) || isNaN(rate) || isNaN(months) || principal <= 0 || rate < 0 || months <= 0) {
      return;
    }

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = rate > 0
      ? principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      : principal / months;

    // Generate amortization schedule
    const schedule: AmortizationEntry[] = [];
    let balance = principal;
    let totalInterest = 0;

    for (let month = 1; month <= months && balance > 0; month++) {
      const interestPayment = balance * rate;
      let principalPayment = monthlyPayment - interestPayment + extra;
      
      // Ensure we don't overpay
      if (principalPayment > balance) {
        principalPayment = balance;
      }

      totalInterest += interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment + extra,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest,
      });

      if (balance <= 0) break;
    }

    result = {
      monthlyPayment,
      totalPayment: schedule.reduce((sum, entry) => sum + entry.payment, 0),
      totalInterest,
      amortizationSchedule: schedule,
    };
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('homePrice')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              bind:value={loanAmount}
              class="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="300000"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('downPayment')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              bind:value={downPayment}
              class="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="60000"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {t('downPaymentPercent', { percent: ((parseFloat(downPayment || '0') / parseFloat(loanAmount || '1')) * 100).toFixed(1) })}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('interestRate')}
          </label>
          <div class="relative">
            <input
              type="number"
              step="0.1"
              bind:value={interestRate}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="6.5"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('loanTerm')}
          </label>
          <select
            bind:value={loanTerm}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="10">10 {t('years')}</option>
            <option value="15">15 {t('years')}</option>
            <option value="20">20 {t('years')}</option>
            <option value="25">25 {t('years')}</option>
            <option value="30">30 {t('years')}</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('extraMonthlyPayment')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              bind:value={extraPayment}
              class="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>
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
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('monthlyPayment')}</div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.monthlyPayment + parseFloat(extraPayment || '0'))}
              </div>
              {#if parseFloat(extraPayment || '0') > 0}
<div class="text-xs text-gray-500">
                  ({formatCurrency(result.monthlyPayment)} + {formatCurrency(parseFloat(extraPayment))} {t('extra')})
                </div>
{/if}
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalInterest')}</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalPayment')}</div>
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(result.totalPayment)}
              </div>
            </div>
          </div>

          <!-- Loan Summary -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('loanSummary')}
            </h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600 dark:text-gray-400">{t('loanAmount')}:</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">
                  {formatCurrency(parseFloat(loanAmount) - parseFloat(downPayment || '0'))}
                </span>
              </div>
              <div>
                <span class="text-gray-600 dark:text-gray-400">{t('payoffTime')}:</span>
                <span class="ml-2 font-medium text-gray-900 dark:text-white">
                  {Math.ceil(result.amortizationSchedule.length / 12)} {t('years')} {result.amortizationSchedule.length % 12} {t('monthsShort')}
                </span>
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
                    <th class="px-3 py-2 text-left">{t('month')}</th>
                    <th class="px-3 py-2 text-right">{t('payment')}</th>
                    <th class="px-3 py-2 text-right">{t('principal')}</th>
                    <th class="px-3 py-2 text-right">{t('interest')}</th>
                    <th class="px-3 py-2 text-right">{t('balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {#each result.amortizationSchedule.slice(0, 36) as entry (entry.month)}
<tr  class="border-b dark:border-gray-700">
                      <td class="px-3 py-2">{entry.month}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.payment)}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.principal)}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.interest)}</td>
                      <td class="px-3 py-2 text-right">{formatCurrency(entry.balance)}</td>
                    </tr>
{/each}
                </tbody>
              </table>
              {#if result.amortizationSchedule.length > 36}
<p class="text-sm text-gray-500 mt-2">
                  {t('showingFirst36', { total: result.amortizationSchedule.length })}
                </p>
{/if}
            </div>
{/if}
        </div>
{/if}
    </div>
  
