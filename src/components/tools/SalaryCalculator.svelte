<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type PayFrequency = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual';
  interface Currency {
  code: string;
  symbol: string;
  name: string;
}

  let amount = $state(50000);

  let frequency = $state('annual');

  let currency = $state('USD');

  let hoursPerWeek = $state(40);

  let taxRate = $state(25);

  let calculations = $derived.by(() => {
    if (!amount || amount <= 0) return null;

    // Convert to annual first
    let annual: number;
    const weeksPerYear = 52;
    const monthsPerYear = 12;
    const workDaysPerWeek = 5;

    switch (frequency) {
      case 'hourly':
        annual = amount * hoursPerWeek * weeksPerYear;
        break;
      case 'daily':
        annual = amount * workDaysPerWeek * weeksPerYear;
        break;
      case 'weekly':
        annual = amount * weeksPerYear;
        break;
      case 'biweekly':
        annual = amount * (weeksPerYear / 2);
        break;
      case 'monthly':
        annual = amount * monthsPerYear;
        break;
      case 'annual':
      default:
        annual = amount;
        break;
    }

    const hourly = annual / (hoursPerWeek * weeksPerYear);
    const daily = annual / (workDaysPerWeek * weeksPerYear);
    const weekly = annual / weeksPerYear;
    const biweekly = annual / (weeksPerYear / 2);
    const monthly = annual / monthsPerYear;

    const taxMultiplier = 1 - (taxRate / 100);

    return {
      beforeTax: {
        hourly,
        daily,
        weekly,
        biweekly,
        monthly,
        annual,
      },
      afterTax: {
        hourly: hourly * taxMultiplier,
        daily: daily * taxMultiplier,
        weekly: weekly * taxMultiplier,
        biweekly: biweekly * taxMultiplier,
        monthly: monthly * taxMultiplier,
        annual: annual * taxMultiplier,
      },
    };
  });

  // Functions
  const _currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  const frequencies: { value: PayFrequency; label: string }[] = [
    { value: 'hourly', label: t('salary.hourly') },
    { value: 'daily', label: t('salary.daily') },
    { value: 'weekly', label: t('salary.weekly') },
    { value: 'biweekly', label: t('salary.biweekly') },
    { value: 'monthly', label: t('salary.monthly') },
    { value: 'annual', label: t('salary.annual') },
  ];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.amount')}
            </label>
            <div class="flex gap-2">
              <select
                bind:value={currency}
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {#each CURRENCIES as c (c.code)}
<option  value={c.code}>
                    {c.symbol} {c.code}
                  </option>
{/each}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onchange={(e) => amount = parseFloat(e.target.value) || 0}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.payFrequency')}
            </label>
            <select
              value={frequency}
              onchange={(e) => frequency = e.target.value as PayFrequency}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {#each frequencies as f (f.value)}
<option  value={f.value}>
                  {f.label}
                </option>
{/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.hoursPerWeek')}
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={hoursPerWeek}
              onchange={(e) => hoursPerWeek = parseInt(e.target.value) || 40}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.taxRate')} (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onchange={(e) => taxRate = parseFloat(e.target.value) || 0}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="range"
              min="0"
              max="60"
              step="1"
              value={taxRate}
              onchange={(e) => taxRate = parseFloat(e.target.value)}
              class="w-full mt-2"
            />
          </div>
        </div>

        <!-- Results Section -->
        <div class="space-y-4">
          {#if calculations}
<div>

              <!-- Before Tax -->
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-3">
                  {t('salary.beforeTax')}
                </h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.hourly')}</div>
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.hourly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.daily')}</div>
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.daily)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.weekly')}</div>
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.weekly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.biweekly')}</div>
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.biweekly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.monthly')}</div>
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.monthly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.annual')}</div>
                    <div class="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.annual)}
                    </div>
                  </div>
                </div>
              </div>

              <!-- After Tax -->
              <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 class="font-medium text-green-800 dark:text-green-300 mb-3">
                  {t('salary.afterTax')} ({taxRate}% {t('salary.taxRate')})
                </h3>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.hourly')}</div>
                    <div class="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.hourly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.daily')}</div>
                    <div class="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.daily)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.weekly')}</div>
                    <div class="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.weekly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.biweekly')}</div>
                    <div class="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.biweekly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.monthly')}</div>
                    <div class="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.monthly)}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 p-3 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">{t('salary.annual')}</div>
                    <div class="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.annual)}
                    </div>
                  </div>
                </div>
              </div>
            
</div>
{/if}
        </div>
      </div>
    </div>
  
