<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['financial-forecast-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.financial-forecast-calculator.${key}`;
  }

  // Types
  interface HistoricalData {
  period: string;
  revenue: number;
  expenses: number;
}
  interface ForecastSettings {
  method: 'linear' | 'exponential' | 'moving-average';
  periods: number;
  growthRate: number;
  movingAveragePeriods: number;
  seasonalAdjustment: boolean;
}

  let historicalData = $state([
    { period: '2023-Q1', revenue: 100000, expenses: 70000 },
    { period: '2023-Q2', revenue: 110000, expenses: 75000 },
    { period: '2023-Q3', revenue: 105000, expenses: 72000 },
    { period: '2023-Q4', revenue: 125000, expenses: 80000 },
    { period: '2024-Q1', revenue: 115000, expenses: 78000 },
    { period: '2024-Q2', revenue: 130000, expenses: 85000 },
  ]);

  let settings = $state({
    method: 'linear',
    periods: 4,
    growthRate: 5,
    movingAveragePeriods: 3,
    seasonalAdjustment: false,
  });

  let currency = $state('USD');

  function updateHistorical(index: number, field: keyof HistoricalData, value: string | number) {
    historicalData = historicalData.map((d, i) => i === index ? { ...d, [field]: value } : d);
  }

  function addPeriod() {
    const lastPeriod = historicalData[historicalData.length - 1]?.period || '2024-Q1';
    const [year, quarter] = lastPeriod.split('-Q');
    const nextQuarter = parseInt(quarter) === 4 ? 1 : parseInt(quarter) + 1;
    const nextYear = parseInt(quarter) === 4 ? parseInt(year) + 1 : parseInt(year);
    historicalData = [...historicalData, { period: `${nextYear}-Q${nextQuarter}`, revenue: 0, expenses: 0 }];
  }

  function removePeriod(index: number) {
    historicalData = historicalData.filter((_, i) => i !== index);
  }

  let forecast = $derived.by(() => {
    if (historicalData.length < 2) return { periods: [] as string[], revenue: [] as number[], expenses: [] as number[], profit: [] as number[] };

    const revenues = historicalData.map(d => d.revenue);
    const expenses = historicalData.map(d => d.expenses);
    const n = revenues.length;

    const forecastValues = (values: number[]): number[] => {
      const result: number[] = [];
      
      if (settings.method === 'linear') {
        // Linear regression
        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denominator = 0;
        values.forEach((y, x) => {
          numerator += (x - xMean) * (y - yMean);
          denominator += (x - xMean) ** 2;
        });
        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = yMean - slope * xMean;
        
        for (let i = 0; i < settings.periods; i++) {
          result.push(Math.max(0, intercept + slope * (n + i)));
        }
      } else if (settings.method === 'exponential') {
        const lastValue = values[values.length - 1];
        const growthMultiplier = 1 + settings.growthRate / 100;
        for (let i = 0; i < settings.periods; i++) {
          result.push(lastValue * Math.pow(growthMultiplier, i + 1));
        }
      } else if (settings.method === 'moving-average') {
        const maPeriods = Math.min(settings.movingAveragePeriods, n);
        const recentValues = values.slice(-maPeriods);
        const average = recentValues.reduce((a, b) => a + b, 0) / maPeriods;
        for (let i = 0; i < settings.periods; i++) {
          result.push(average);
        }
      }
      
      return result;
    };

    const forecastedRevenue = forecastValues(revenues);
    const forecastedExpenses = forecastValues(expenses);
    const forecastedProfit = forecastedRevenue.map((r, i) => r - forecastedExpenses[i]);

    // Generate period labels
    const lastPeriod = historicalData[historicalData.length - 1].period;
    const [year, quarter] = lastPeriod.split('-Q');
    const periods: string[] = [];
    let currentYear = parseInt(year);
    let currentQuarter = parseInt(quarter);
    
    for (let i = 0; i < settings.periods; i++) {
      currentQuarter++;
      if (currentQuarter > 4) {
        currentQuarter = 1;
        currentYear++;
      }
      periods.push(`${currentYear}-Q${currentQuarter}`);
    }

    return {
      periods,
      revenue: forecastedRevenue,
      expenses: forecastedExpenses,
      profit: forecastedProfit,
    };
  });

  let statistics = $derived.by(() => {
    const revenues = historicalData.map(d => d.revenue);
    const expenses = historicalData.map(d => d.expenses);
    const profits = historicalData.map(d => d.revenue - d.expenses);

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const growth = (arr: number[]) => arr.length > 1 ? ((arr[arr.length - 1] - arr[0]) / arr[0]) * 100 : 0;

    return {
      avgRevenue: avg(revenues),
      avgExpenses: avg(expenses),
      avgProfit: avg(profits),
      revenueGrowth: growth(revenues),
      expenseGrowth: growth(expenses),
      profitMargin: avg(revenues) > 0 ? (avg(profits) / avg(revenues)) * 100 : 0,
    };
  });

  let currencySymbol = $derived.by(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[currency] || '$';
  });

  function formatCurrency(amount: number) {
    return `${currencySymbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  function exportForecast() {
    const data = {
      historical: historicalData,
      forecast: {
        periods: forecast.periods,
        revenue: forecast.revenue,
        expenses: forecast.expenses,
        profit: forecast.profit,
      },
      settings,
      statistics,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-forecast.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  let maxValue = $derived.by(() => {
    const allValues = [
      ...historicalData.map(d => d.revenue),
      ...historicalData.map(d => d.expenses),
      ...forecast.revenue,
      ...forecast.expenses,
    ];
    return Math.max(...allValues, 1);
  });

</script>

<div class="space-y-6">
  <!-- Settings -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('forecastMethod')}</label>
      <select bind:value={settings.method} class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
        <option value="linear">{t('linearRegression')}</option>
        <option value="exponential">{t('exponentialGrowth')}</option>
        <option value="moving-average">{t('movingAverage')}</option>
      </select>
    </div>
    <div>
      <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('forecastPeriods')}</label>
      <input type="number" bind:value={settings.periods} min={1} max={12} class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white" />
    </div>
    <div>
      <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('currency')}</label>
      <select bind:value={currency} class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
        <option value="CNY">CNY (¥)</option>
        <option value="JPY">JPY (¥)</option>
      </select>
    </div>
  </div>

  {#if settings.method === 'exponential'}
    <div>
      <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('growthRate')} (%)</label>
      <input type="number" bind:value={settings.growthRate} step={0.5} class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white" />
    </div>
  {/if}

  <!-- Historical Data -->
  <div>
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('historicalData')}</h3>
      <button onclick={addPeriod} class="px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">+ {t('addPeriod')}</button>
    </div>
    <div class="space-y-2">
      {#each historicalData as item, i}
        <div class="flex gap-2 items-center">
          <input type="text" value={item.period} oninput={(e) => { historicalData[i] = { ...historicalData[i], period: (e.currentTarget as HTMLInputElement).value }; historicalData = [...historicalData]; }} class="w-28 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white" />
          <input type="number" value={item.revenue} oninput={(e) => { historicalData[i] = { ...historicalData[i], revenue: Number((e.currentTarget as HTMLInputElement).value) || 0 }; historicalData = [...historicalData]; }} class="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white" placeholder={t('revenue')} />
          <input type="number" value={item.expenses} oninput={(e) => { historicalData[i] = { ...historicalData[i], expenses: Number((e.currentTarget as HTMLInputElement).value) || 0 }; historicalData = [...historicalData]; }} class="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-900 dark:text-white" placeholder={t('expenses')} />
          <button onclick={() => removePeriod(i)} class="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
        </div>
      {/each}
    </div>
  </div>

  <!-- Chart -->
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('forecastVisualization')}</h3>
    <div class="space-y-2">
      {#each historicalData as item}
        {@const revenue = item.revenue}
        {@const expenses = item.expenses}
        {@const profit = revenue - expenses}
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-20 text-xs text-gray-600 dark:text-gray-400">{item.period}</span>
          </div>
          <div class="flex gap-1 h-6">
            <div class="bg-amber-500 rounded-l" style="width: {(revenue / maxValue) * 100}%" title={`${t('revenue')}: ${formatCurrency(revenue)}`}></div>
            <div class="bg-red-400" style="width: {(expenses / maxValue) * 100}%" title={`${t('expenses')}: ${formatCurrency(expenses)}`}></div>
            <div class={`rounded-r ${profit >= 0 ? 'bg-green-500' : 'bg-rose-500'}`} style="width: {(Math.abs(profit) / maxValue) * 100}%" title={`${t('profit')}: ${formatCurrency(profit)}`}></div>
          </div>
        </div>
      {/each}
      {#each forecast.periods as period, i}
        {@const revenue = forecast.revenue[i]}
        {@const expenses = forecast.expenses[i]}
        {@const profit = forecast.profit[i]}
        <div class="opacity-70">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-20 text-xs text-gray-600 dark:text-gray-400">{period}</span>
            <span class="text-xs px-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">{t('forecast')}</span>
          </div>
          <div class="flex gap-1 h-6">
            <div class="bg-amber-500 rounded-l" style="width: {(revenue / maxValue) * 100}%" title={`${t('revenue')}: ${formatCurrency(revenue)}`}></div>
            <div class="bg-red-400" style="width: {(expenses / maxValue) * 100}%" title={`${t('expenses')}: ${formatCurrency(expenses)}`}></div>
            <div class={`rounded-r ${profit >= 0 ? 'bg-green-500' : 'bg-rose-500'}`} style="width: {(Math.abs(profit) / maxValue) * 100}%" title={`${t('profit')}: ${formatCurrency(profit)}`}></div>
          </div>
        </div>
      {/each}
    </div>
    <div class="flex gap-4 mt-2 text-xs text-gray-500">
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-amber-500 rounded inline-block"></span> {t('revenue')}</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-400 rounded inline-block"></span> {t('expenses')}</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-500 rounded inline-block"></span> {t('profit')}</span>
    </div>
  </div>

  <!-- Statistics -->
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('avgRevenue')}</div>
      <div class="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(statistics.avgRevenue)}</div>
    </div>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('avgExpenses')}</div>
      <div class="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(statistics.avgExpenses)}</div>
    </div>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('avgProfit')}</div>
      <div class="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(statistics.avgProfit)}</div>
    </div>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('growth')}</div>
      <div class="text-lg font-bold text-gray-900 dark:text-white">{statistics.revenueGrowth.toFixed(1)}%</div>
    </div>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('change')}</div>
      <div class="text-lg font-bold text-gray-900 dark:text-white">{statistics.expenseGrowth.toFixed(1)}%</div>
    </div>
    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('profitMargin')}</div>
      <div class="text-lg font-bold text-gray-900 dark:text-white">{statistics.profitMargin.toFixed(1)}%</div>
    </div>
  </div>

  <!-- Export -->
  <div class="flex justify-end">
    <button onclick={exportForecast} class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-emerald-500">{t('exportForecastReport')}</button>
  </div>
</div>
            
