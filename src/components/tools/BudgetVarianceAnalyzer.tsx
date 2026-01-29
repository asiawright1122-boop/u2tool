'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useMemo } from 'react';

interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  notes: string;
}

interface AnalysisData {
  title: string;
  period: string;
  items: BudgetItem[];
  currency: string;
}

const DEFAULT_CATEGORIES = [
  'Revenue', 'Cost of Goods Sold', 'Marketing', 'Salaries', 'Rent',
  'Utilities', 'Software', 'Travel', 'Training', 'Miscellaneous'
];

export default function BudgetVarianceAnalyzer() {
  const t = useTranslations('tools.budget-variance-analyzer');
  const tCommon = useTranslations('tools');
  const [data, setData] = useState<AnalysisData>({
    title: 'Q1 Budget Analysis',
    period: 'January - March 2024',
    items: [
      { id: '1', category: 'Revenue', budgeted: 100000, actual: 95000, notes: '' },
      { id: '2', category: 'Cost of Goods Sold', budgeted: 40000, actual: 42000, notes: '' },
      { id: '3', category: 'Marketing', budgeted: 15000, actual: 18000, notes: 'Additional campaign' },
      { id: '4', category: 'Salaries', budgeted: 30000, actual: 30000, notes: '' },
      { id: '5', category: 'Rent', budgeted: 5000, actual: 5000, notes: '' },
      { id: '6', category: 'Utilities', budgeted: 2000, actual: 1800, notes: '' },
    ],
    currency: 'USD',
  });

  const updateData = useCallback(<K extends keyof AnalysisData>(key: K, value: AnalysisData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const addItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), category: '', budgeted: 0, actual: 0, notes: '' }],
    }));
  }, []);

  const updateItem = useCallback((id: string, field: keyof BudgetItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  }, []);

  const analysis = useMemo(() => {
    const items = data.items.map(item => {
      const variance = item.actual - item.budgeted;
      const variancePercent = item.budgeted !== 0 ? (variance / item.budgeted) * 100 : 0;
      const isRevenue = item.category.toLowerCase().includes('revenue');
      const isFavorable = isRevenue ? variance >= 0 : variance <= 0;
      return { ...item, variance, variancePercent, isFavorable };
    });

    const totalBudgeted = items.reduce((sum, i) => sum + i.budgeted, 0);
    const totalActual = items.reduce((sum, i) => sum + i.actual, 0);
    const totalVariance = totalActual - totalBudgeted;
    const totalVariancePercent = totalBudgeted !== 0 ? (totalVariance / totalBudgeted) * 100 : 0;

    const favorable = items.filter(i => i.isFavorable);
    const unfavorable = items.filter(i => !i.isFavorable);
    const largestVariance = [...items].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))[0];

    return {
      items,
      totalBudgeted,
      totalActual,
      totalVariance,
      totalVariancePercent,
      favorable,
      unfavorable,
      largestVariance,
    };
  }, [data.items]);

  const currencySymbol = useMemo(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[data.currency] || '$';
  }, [data.currency]);

  const formatCurrency = useCallback((amount: number) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currencySymbol}${Math.abs(amount).toLocaleString()}`;
  }, [currencySymbol]);

  const exportReport = useCallback(() => {
    const report = {
      ...data,
      analysis: {
        totalBudgeted: analysis.totalBudgeted,
        totalActual: analysis.totalActual,
        totalVariance: analysis.totalVariance,
        totalVariancePercent: analysis.totalVariancePercent,
        favorableCount: analysis.favorable.length,
        unfavorableCount: analysis.unfavorable.length,
      },
      items: analysis.items,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-variance-${data.period.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, analysis]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('reportTitle')}</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('period')}</label>
          <input
            type="text"
            value={data.period}
            onChange={(e) => updateData('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            value={data.currency}
            onChange={(e) => updateData('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {['USD', 'EUR', 'GBP', 'CNY', 'JPY'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={addItem} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {t('addItem')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500">{t('totalBudgeted')}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(analysis.totalBudgeted)}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-500">{t('totalActual')}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(analysis.totalActual)}</p>
        </div>
        <div className={`p-4 rounded-lg ${analysis.totalVariance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p className="text-xs text-gray-500">{t('totalVariance')}</p>
          <p className={`text-xl font-bold ${analysis.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(analysis.totalVariance)}
          </p>
          <p className={`text-xs ${analysis.totalVariance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {analysis.totalVariancePercent >= 0 ? '+' : ''}{analysis.totalVariancePercent.toFixed(1)}%
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs text-gray-500">{t('status')}</p>
          <p className="text-lg font-bold text-purple-600">
            {analysis.favorable.length} / {analysis.items.length}
          </p>
          <p className="text-xs text-purple-500">{t('favorableItems')}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2">{t('category')}</th>
              <th className="text-right py-3 px-2">{t('budgeted')}</th>
              <th className="text-right py-3 px-2">{t('actual')}</th>
              <th className="text-right py-3 px-2">{t('variance')}</th>
              <th className="text-right py-3 px-2">%</th>
              <th className="text-center py-3 px-2">{t('status')}</th>
              <th className="text-left py-3 px-2">{t('notes')}</th>
              <th className="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {analysis.items.map(item => (
              <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    list="categories"
                    placeholder={t("categoryPlaceholder")}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={item.budgeted}
                    onChange={(e) => updateItem(item.id, 'budgeted', parseFloat(e.target.value) || 0)}
                    className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={item.actual}
                    onChange={(e) => updateItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                    className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                  />
                </td>
                <td className={`py-2 px-2 text-right font-medium ${item.isFavorable ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(item.variance)}
                </td>
                <td className={`py-2 px-2 text-right ${item.isFavorable ? 'text-green-600' : 'text-red-600'}`}>
                  {item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                </td>
                <td className="py-2 px-2 text-center">
                  <span className={`px-2 py-0.5 text-xs rounded ${item.isFavorable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {item.isFavorable ? t('favorable') : t('unfavorable')}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder={t("notesPlaceholder")}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="py-2 px-2">
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <datalist id="categories">
          {DEFAULT_CATEGORIES.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      {analysis.largestVariance && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ {t('largestVarianceAlert')}</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>{analysis.largestVariance.category}</strong> has the largest variance of{' '}
            <strong>{formatCurrency(analysis.largestVariance.variance)}</strong>{' '}
            ({analysis.largestVariance.variancePercent >= 0 ? '+' : ''}{analysis.largestVariance.variancePercent.toFixed(1)}%)
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-3 text-green-600">{t('favorableVariances')}</h4>
          {analysis.favorable.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {analysis.favorable.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                  <span className="text-green-600">{formatCurrency(Math.abs(item.variance))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t('noFavorableVariances')}</p>
          )}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-3 text-red-600">{t('unfavorableVariances')}</h4>
          {analysis.unfavorable.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {analysis.unfavorable.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{item.category}</span>
                  <span className="text-red-600">{formatCurrency(Math.abs(item.variance))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t('noUnfavorableVariances')}</p>
          )}
        </div>
      </div>

      <button onClick={exportReport} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {t('exportReport')}
      </button>
    </div>
  );
}
