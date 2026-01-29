'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

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

export default function FinancialForecastCalculator() {
  const t = useTranslations('tools.financial-forecast-calculator');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([
    { period: '2023-Q1', revenue: 100000, expenses: 70000 },
    { period: '2023-Q2', revenue: 110000, expenses: 75000 },
    { period: '2023-Q3', revenue: 105000, expenses: 72000 },
    { period: '2023-Q4', revenue: 125000, expenses: 80000 },
    { period: '2024-Q1', revenue: 115000, expenses: 78000 },
    { period: '2024-Q2', revenue: 130000, expenses: 85000 },
  ]);

  const [settings, setSettings] = useState<ForecastSettings>({
    method: 'linear',
    periods: 4,
    growthRate: 5,
    movingAveragePeriods: 3,
    seasonalAdjustment: false,
  });

  const [currency, setCurrency] = useState('USD');

  const updateHistorical = useCallback((index: number, field: keyof HistoricalData, value: string | number) => {
    setHistoricalData(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
  }, []);

  const addPeriod = useCallback(() => {
    const lastPeriod = historicalData[historicalData.length - 1]?.period || '2024-Q1';
    const [year, quarter] = lastPeriod.split('-Q');
    const nextQuarter = parseInt(quarter) === 4 ? 1 : parseInt(quarter) + 1;
    const nextYear = parseInt(quarter) === 4 ? parseInt(year) + 1 : parseInt(year);
    setHistoricalData(prev => [...prev, { period: `${nextYear}-Q${nextQuarter}`, revenue: 0, expenses: 0 }]);
  }, [historicalData]);

  const removePeriod = useCallback((index: number) => {
    setHistoricalData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const forecast = useMemo(() => {
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
  }, [historicalData, settings]);

  const statistics = useMemo(() => {
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
  }, [historicalData]);

  const currencySymbol = useMemo(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[currency] || '$';
  }, [currency]);

  const formatCurrency = useCallback((amount: number) => {
    return `${currencySymbol}${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }, [currencySymbol]);

  const exportForecast = useCallback(() => {
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
  }, [historicalData, forecast, settings, statistics]);

  const maxValue = useMemo(() => {
    const allValues = [
      ...historicalData.map(d => d.revenue),
      ...historicalData.map(d => d.expenses),
      ...forecast.revenue,
      ...forecast.expenses,
    ];
    return Math.max(...allValues, 1);
  }, [historicalData, forecast]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('forecastMethod')}</label>
          <select
            value={settings.method}
            onChange={(e) => setSettings(prev => ({ ...prev, method: e.target.value as ForecastSettings['method'] }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="linear">{t('linearRegression')}</option>
            <option value="exponential">{t('exponentialGrowth')}</option>
            <option value="moving-average">{t('movingAverage')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('forecastPeriods')}</label>
          <input
            type="number"
            value={settings.periods}
            onChange={(e) => setSettings(prev => ({ ...prev, periods: parseInt(e.target.value) || 1 }))}
            min="1"
            max="12"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        {settings.method === 'exponential' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('growthRate')}</label>
            <input
              type="number"
              value={settings.growthRate}
              onChange={(e) => setSettings(prev => ({ ...prev, growthRate: parseFloat(e.target.value) || 0 }))}
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        )}
        {settings.method === 'moving-average' && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('maPeriods')}</label>
            <input
              type="number"
              value={settings.movingAveragePeriods}
              onChange={(e) => setSettings(prev => ({ ...prev, movingAveragePeriods: parseInt(e.target.value) || 2 }))}
              min="2"
              max={historicalData.length}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {['USD', 'EUR', 'GBP', 'CNY', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={addPeriod} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {t('addPeriod')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">{t('avgRevenue')}</p>
          <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(statistics.avgRevenue)}</p>
          <p className={`text-xs ${statistics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {statistics.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(statistics.revenueGrowth).toFixed(1)}% {t('growth')}
          </p>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-red-600 dark:text-red-400">{t('avgExpenses')}</p>
          <p className="text-xl font-bold text-red-700 dark:text-red-300">{formatCurrency(statistics.avgExpenses)}</p>
          <p className={`text-xs ${statistics.expenseGrowth <= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {statistics.expenseGrowth >= 0 ? '↑' : '↓'} {Math.abs(statistics.expenseGrowth).toFixed(1)}% {t('change')}
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-400">{t('avgProfit')}</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatCurrency(statistics.avgProfit)}</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs text-purple-600 dark:text-purple-400">{t('profitMargin')}</p>
          <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{statistics.profitMargin.toFixed(1)}%</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">{t('historicalData')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">{t('period')}</th>
                <th className="text-right py-2 px-2">{t('revenue')}</th>
                <th className="text-right py-2 px-2">{t('expenses')}</th>
                <th className="text-right py-2 px-2">{t('profit')}</th>
                <th className="text-right py-2 px-2">{t('margin')}</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {historicalData.map((data, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={data.period}
                      onChange={(e) => updateHistorical(index, 'period', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={data.revenue}
                      onChange={(e) => updateHistorical(index, 'revenue', parseFloat(e.target.value) || 0)}
                      className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      value={data.expenses}
                      onChange={(e) => updateHistorical(index, 'expenses', parseFloat(e.target.value) || 0)}
                      className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                    />
                  </td>
                  <td className={`py-2 px-2 text-right font-medium ${data.revenue - data.expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.revenue - data.expenses)}
                  </td>
                  <td className="py-2 px-2 text-right text-gray-600 dark:text-gray-400">
                    {data.revenue > 0 ? ((data.revenue - data.expenses) / data.revenue * 100).toFixed(1) : 0}%
                  </td>
                  <td className="py-2 px-2">
                    <button onClick={() => removePeriod(index)} className="text-red-500 hover:text-red-700">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="font-medium mb-4 text-gray-900 dark:text-white">{t('forecastVisualization')}</h3>
        <div className="space-y-3">
          {[...historicalData, ...forecast.periods.map((p, i) => ({
            period: p,
            revenue: forecast.revenue[i],
            expenses: forecast.expenses[i],
            isForecast: true,
          }))].map((item, index) => {
            const isForecast = 'isForecast' in item;
            const revenue = isForecast ? (item as { revenue: number }).revenue : (item as HistoricalData).revenue;
            const expenses = isForecast ? (item as { expenses: number }).expenses : (item as HistoricalData).expenses;
            const profit = revenue - expenses;
            
            return (
              <div key={index} className={`${isForecast ? 'opacity-70' : ''}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-20 text-xs text-gray-600 dark:text-gray-400">{item.period}</span>
                  {isForecast && <span className="text-xs px-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">{t('forecast')}</span>}
                </div>
                <div className="flex gap-1 h-6">
                  <div
                    className="bg-blue-500 rounded-l"
                    style={{ width: `${(revenue / maxValue) * 100}%` }}
                    title={`${t('revenue')}: ${formatCurrency(revenue)}`}
                  />
                  <div
                    className="bg-red-400"
                    style={{ width: `${(expenses / maxValue) * 100}%` }}
                    title={`${t('expenses')}: ${formatCurrency(expenses)}`}
                  />
                  <div
                    className={`rounded-r ${profit >= 0 ? 'bg-green-500' : 'bg-red-600'}`}
                    style={{ width: `${(Math.abs(profit) / maxValue) * 100}%` }}
                    title={`${t('profit')}: ${formatCurrency(profit)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> {t('revenue')}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded"></span> {t('expenses')}</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> {t('profit')}</span>
        </div>
      </div>

      {forecast.periods.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-3">{t('forecastSummary')} ({settings.method})</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-yellow-700 dark:text-yellow-300">{t('projectedRevenue')}</p>
              <p className="font-bold text-yellow-800 dark:text-yellow-200">
                {formatCurrency(forecast.revenue.reduce((a, b) => a + b, 0))}
              </p>
              <p className="text-xs text-yellow-600">{t('overPeriods', { periods: settings.periods })}</p>
            </div>
            <div>
              <p className="text-yellow-700 dark:text-yellow-300">{t('projectedExpenses')}</p>
              <p className="font-bold text-yellow-800 dark:text-yellow-200">
                {formatCurrency(forecast.expenses.reduce((a, b) => a + b, 0))}
              </p>
            </div>
            <div>
              <p className="text-yellow-700 dark:text-yellow-300">{t('projectedProfit')}</p>
              <p className={`font-bold ${forecast.profit.reduce((a, b) => a + b, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(forecast.profit.reduce((a, b) => a + b, 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      <button onClick={exportForecast} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {t('exportForecastReport')}
      </button>
    </div>
  );
}
