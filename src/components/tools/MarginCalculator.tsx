'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface MarginResult {
  profit: number;
  profitMargin: number;
  markup: number;
  grossProfit: number;
}

function calculateMargin(cost: number, sellingPrice: number): MarginResult {
  const profit = sellingPrice - cost;
  const profitMargin = (profit / sellingPrice) * 100;
  const markup = (profit / cost) * 100;
  const grossProfit = profit;
  
  return {
    profit,
    profitMargin,
    markup,
    grossProfit,
  };
}

export default function MarginCalculator() {
  const t = useTranslations('tools.margin-calculator');
  const tCommon = useTranslations('tools');
  
  const [cost, setCost] = useState<string>('50');
  const [sellingPrice, setSellingPrice] = useState<string>('100');
  const [result, setResult] = useState<MarginResult | null>(null);

  const handleCalculate = useCallback(() => {
    const costNum = parseFloat(cost);
    const priceNum = parseFloat(sellingPrice);
    
    if (isNaN(costNum) || isNaN(priceNum) || costNum <= 0 || priceNum <= 0) {
      return;
    }
    
    setResult(calculateMargin(costNum, priceNum));
  }, [cost, sellingPrice]);

  const clearAll = () => {
    setCost('50');
    setSellingPrice('100');
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

  // Calculate reverse: given margin, what should be the selling price?
  const calculateFromMargin = (targetMargin: number) => {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0 || targetMargin >= 100) return;
    
    const newPrice = costNum / (1 - targetMargin / 100);
    setSellingPrice(newPrice.toFixed(2));
    setResult(calculateMargin(costNum, newPrice));
  };

  // Calculate reverse: given markup, what should be the selling price?
  const calculateFromMarkup = (targetMarkup: number) => {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0) return;
    
    const newPrice = costNum * (1 + targetMarkup / 100);
    setSellingPrice(newPrice.toFixed(2));
    setResult(calculateMargin(costNum, newPrice));
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
            {t('sellingPrice')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="100"
              step="0.01"
              className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Quick Margin Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('targetMargin')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[10, 20, 25, 30, 40, 50].map(margin => (
            <button
              key={margin}
              onClick={() => calculateFromMargin(margin)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm"
            >
              {margin}%
            </button>
          ))}
        </div>
      </div>

      {/* Quick Markup Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('targetMarkup')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[25, 50, 75, 100, 150, 200].map(markup => (
            <button
              key={markup}
              onClick={() => calculateFromMarkup(markup)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm"
            >
              {markup}%
            </button>
          ))}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{t('profit')}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(result.profit)}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('profitMargin')}</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatPercent(result.profitMargin)}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">{t('markup')}</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatPercent(result.markup)}
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-600 dark:text-orange-400">{t('grossProfit')}</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatCurrency(result.grossProfit)}
              </p>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('breakdown')}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{t('cost')}</div>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div 
                    className="h-full bg-red-400 dark:bg-red-600"
                    style={{ width: `${(parseFloat(cost) / parseFloat(sellingPrice)) * 100}%` }}
                  />
                </div>
                <div className="w-24 text-right text-sm text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(cost))}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{t('profit')}</div>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div 
                    className="h-full bg-green-400 dark:bg-green-600"
                    style={{ width: `${result.profitMargin}%` }}
                  />
                </div>
                <div className="w-24 text-right text-sm text-gray-900 dark:text-gray-100">{formatCurrency(result.profit)}</div>
              </div>
            </div>
          </div>

          {/* Formulas */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('formulas')}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>{t('profitMargin')}:</strong> ({t('sellingPrice')} - {t('cost')}) ÷ {t('sellingPrice')} × 100</p>
              <p><strong>{t('markup')}:</strong> ({t('sellingPrice')} - {t('cost')}) ÷ {t('cost')} × 100</p>
            </div>
          </div>

          {/* Margin vs Markup Comparison */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">{t('marginVsMarkup')}</h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              {t('marginVsMarkupExplanation')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
