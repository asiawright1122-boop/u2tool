'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}

function calculateBreakEven(
  fixedCosts: number,
  variableCostPerUnit: number,
  sellingPricePerUnit: number
): BreakEvenResult | null {
  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  
  if (contributionMargin <= 0) {
    return null; // Cannot break even if contribution margin is zero or negative
  }
  
  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * sellingPricePerUnit;
  const contributionMarginRatio = (contributionMargin / sellingPricePerUnit) * 100;
  
  return {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMargin,
    contributionMarginRatio,
  };
}

export default function BreakEvenCalculator() {
  const t = useTranslations('tools.break-even-calculator');
  const tCommon = useTranslations('tools');
  
  const [fixedCosts, setFixedCosts] = useState<string>('10000');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<string>('25');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState<string>('50');
  const [result, setResult] = useState<BreakEvenResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = useCallback(() => {
    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCostPerUnit);
    const selling = parseFloat(sellingPricePerUnit);
    
    if (isNaN(fixed) || isNaN(variable) || isNaN(selling)) {
      setError(t('invalidInput'));
      setResult(null);
      return;
    }
    
    if (selling <= variable) {
      setError(t('priceError'));
      setResult(null);
      return;
    }
    
    setError('');
    setResult(calculateBreakEven(fixed, variable, selling));
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit, t]);

  const clearAll = () => {
    setFixedCosts('10000');
    setVariableCostPerUnit('25');
    setSellingPricePerUnit('50');
    setResult(null);
    setError('');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.ceil(value));
  };

  // Generate profit/loss table
  const generateProfitTable = () => {
    if (!result) return [];
    
    const units = [
      0,
      Math.floor(result.breakEvenUnits * 0.5),
      Math.floor(result.breakEvenUnits * 0.75),
      Math.ceil(result.breakEvenUnits),
      Math.ceil(result.breakEvenUnits * 1.25),
      Math.ceil(result.breakEvenUnits * 1.5),
      Math.ceil(result.breakEvenUnits * 2),
    ];
    
    const fixed = parseFloat(fixedCosts);
    const variable = parseFloat(variableCostPerUnit);
    const selling = parseFloat(sellingPricePerUnit);
    
    return units.map(unit => ({
      units: unit,
      revenue: unit * selling,
      totalCosts: fixed + (unit * variable),
      profit: (unit * selling) - fixed - (unit * variable),
    }));
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('fixedCosts')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
              placeholder="10000"
              className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('fixedCostsHint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('variableCostPerUnit')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={variableCostPerUnit}
              onChange={(e) => setVariableCostPerUnit(e.target.value)}
              placeholder="25"
              className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('variableCostHint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sellingPricePerUnit')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={sellingPricePerUnit}
              onChange={(e) => setSellingPricePerUnit(e.target.value)}
              placeholder="50"
              className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

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
              <p className="text-sm text-green-600 dark:text-green-400">{t('breakEvenUnits')}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatNumber(result.breakEvenUnits)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">{t('units')}</p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('breakEvenRevenue')}</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(result.breakEvenRevenue)}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">{t('contributionMargin')}</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(result.contributionMargin)}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">{t('perUnit')}</p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-600 dark:text-orange-400">{t('contributionMarginRatio')}</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {result.contributionMarginRatio.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Profit/Loss Table */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('profitLossTable')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-3 text-left text-gray-500 dark:text-gray-400">{t('units')}</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('revenue')}</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('totalCosts')}</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('profitLoss')}</th>
                  </tr>
                </thead>
                <tbody>
                  {generateProfitTable().map((row, index) => (
                    <tr 
                      key={row.units} 
                      className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : ''} ${
                        Math.ceil(result.breakEvenUnits) === row.units ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-gray-900 dark:text-gray-100">
                        {formatNumber(row.units)}
                        {Math.ceil(result.breakEvenUnits) === row.units && (
                          <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">({t('breakEven')})</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.revenue)}</td>
                      <td className="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.totalCosts)}</td>
                      <td className={`py-2 px-3 text-right font-medium ${
                        row.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(row.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('formula')}</h3>
            <code className="text-sm text-gray-600 dark:text-gray-400">
              {t('breakEvenUnits')} = {t('fixedCosts')} ÷ ({t('sellingPricePerUnit')} - {t('variableCostPerUnit')})
            </code>
          </div>
        </div>
      )}
    </div>
  );
}
