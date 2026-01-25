'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface MarkupResult {
  sellingPrice: number;
  profit: number;
  profitMargin: number;
}

function calculateMarkup(cost: number, markupPercentage: number): MarkupResult {
  const sellingPrice = cost * (1 + markupPercentage / 100);
  const profit = sellingPrice - cost;
  const profitMargin = (profit / sellingPrice) * 100;
  
  return {
    sellingPrice,
    profit,
    profitMargin,
  };
}

export default function MarkupCalculator() {
  const t = useTranslations('tools.markup-calculator');
  const tCommon = useTranslations('tools');
  
  const [cost, setCost] = useState<string>('50');
  const [markupPercentage, setMarkupPercentage] = useState<string>('100');
  const [result, setResult] = useState<MarkupResult | null>(null);

  const handleCalculate = useCallback(() => {
    const costNum = parseFloat(cost);
    const markupNum = parseFloat(markupPercentage);
    
    if (isNaN(costNum) || isNaN(markupNum) || costNum <= 0) {
      return;
    }
    
    setResult(calculateMarkup(costNum, markupNum));
  }, [cost, markupPercentage]);

  const clearAll = () => {
    setCost('50');
    setMarkupPercentage('100');
    setResult(null);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Generate comparison table for different markups
  const generateComparisonTable = () => {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0) return [];
    
    const markups = [25, 50, 75, 100, 150, 200, 250, 300];
    return markups.map(markup => {
      const result = calculateMarkup(costNum, markup);
      return {
        markup,
        ...result,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('info')}
        </p>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('cost')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="50"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('markupPercentage')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={markupPercentage}
              onChange={(e) => setMarkupPercentage(e.target.value)}
              placeholder="100"
              step="1"
              className="w-full pr-8 pl-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Quick Markup Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('commonMarkups')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[25, 50, 75, 100, 150, 200, 250, 300].map(markup => (
            <button
              key={markup}
              onClick={() => setMarkupPercentage(String(markup))}
              className={`px-3 py-1 rounded text-sm ${
                markupPercentage === String(markup)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {markup}%
            </button>
          ))}
        </div>
      </div>

      {/* Markup Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('adjustMarkup')}: {markupPercentage}%
        </label>
        <input
          type="range"
          min="0"
          max="500"
          value={markupPercentage}
          onChange={(e) => setMarkupPercentage(e.target.value)}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0%</span>
          <span>100%</span>
          <span>200%</span>
          <span>300%</span>
          <span>400%</span>
          <span>500%</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleCalculate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('calculate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{t('sellingPrice')}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(result.sellingPrice)}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('profit')}</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(result.profit)}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">{t('profitMargin')}</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatPercent(result.profitMargin)}
              </p>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('priceBreakdown')}</h3>
            <div className="h-8 flex rounded overflow-hidden">
              <div 
                className="bg-red-400 dark:bg-red-600 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(parseFloat(cost) / result.sellingPrice) * 100}%` }}
              >
                {t('cost')}
              </div>
              <div 
                className="bg-green-400 dark:bg-green-600 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${(result.profit / result.sellingPrice) * 100}%` }}
              >
                {t('profit')}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatCurrency(parseFloat(cost))} ({((parseFloat(cost) / result.sellingPrice) * 100).toFixed(1)}%)</span>
              <span>{formatCurrency(result.profit)} ({result.profitMargin.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {parseFloat(cost) > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('comparisonTable')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 px-3 text-left text-gray-500 dark:text-gray-400">{t('markup')}</th>
                  <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('sellingPrice')}</th>
                  <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('profit')}</th>
                  <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('profitMargin')}</th>
                </tr>
              </thead>
              <tbody>
                {generateComparisonTable().map((row, index) => (
                  <tr 
                    key={row.markup} 
                    className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : ''} ${
                      markupPercentage === String(row.markup) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{row.markup}%</td>
                    <td className="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.sellingPrice)}</td>
                    <td className="py-2 px-3 text-right text-green-600 dark:text-green-400">{formatCurrency(row.profit)}</td>
                    <td className="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatPercent(row.profitMargin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formula */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('formula')}</h3>
        <code className="text-sm text-gray-600 dark:text-gray-400">
          {t('sellingPrice')} = {t('cost')} × (1 + {t('markup')} ÷ 100)
        </code>
      </div>
    </div>
  );
}
