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


              <div class={`${isForecast ? 'opacity-70' : ''}`}>
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-20 text-xs text-gray-600 dark:text-gray-400">{item.period}</span>
                  {#if isForecast}
<span class="text-xs px-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">{t('forecast')}</span>
{/if}
                </div>
                <div class="flex gap-1 h-6">
                  <div
                    class="bg-blue-500 rounded-l"
                    style="width: {(revenue / maxValue) * 100}%"
                    title={`${t('revenue')}: ${formatCurrency(revenue)}`}></div>
                  <div
                    class="bg-red-400"
                    style="width: {(expenses / maxValue) * 100}%"
                    title={`${t('expenses')}: ${formatCurrency(expenses)}`}></div>
                  <div
                    class={`rounded-r ${profit >= 0 ? 'bg-green-500' : 'bg-red-600'}`}
                    style="width: {(Math.abs(profit) / maxValue) * 100}%"
                    title={`${t('profit')}: ${formatCurrency(profit)}`}
                  />
                </div>
              </div>
            
