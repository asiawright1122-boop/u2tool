'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface InflationResult {
  adjustedValue: number;
  totalInflation: number;
  purchasingPowerLoss: number;
  yearlyBreakdown: { year: number; value: number; inflation: number }[];
}

function calculateInflation(
  amount: number,
  startYear: number,
  endYear: number,
  annualRate: number
): InflationResult {
  const years = endYear - startYear;
  const rate = annualRate / 100;
  
  // Formula: adjustedValue = amount * (1 + rate)^years
  const adjustedValue = amount * Math.pow(1 + rate, years);
  const totalInflation = ((adjustedValue - amount) / amount) * 100;
  const purchasingPowerLoss = ((amount - (amount * Math.pow(1 / (1 + rate), years))) / amount) * 100;
  
  // Generate yearly breakdown
  const yearlyBreakdown: { year: number; value: number; inflation: number }[] = [];
  let currentValue = amount;
  
  for (let i = 0; i <= years; i++) {
    yearlyBreakdown.push({
      year: startYear + i,
      value: currentValue,
      inflation: i === 0 ? 0 : ((currentValue - amount) / amount) * 100,
    });
    currentValue *= (1 + rate);
  }
  
  return {
    adjustedValue,
    totalInflation,
    purchasingPowerLoss,
    yearlyBreakdown,
  };
}

export default function InflationCalculator() {
  const t = useTranslations('tools.inflation-calculator');
  const tCommon = useTranslations('tools');
  
  const [amount, setAmount] = useState<string>('1000');
  const [startYear, setStartYear] = useState<string>(String(new Date().getFullYear() - 10));
  const [endYear, setEndYear] = useState<string>(String(new Date().getFullYear()));
  const [annualRate, setAnnualRate] = useState<string>('3');
  const [result, setResult] = useState<InflationResult | null>(null);

  const handleCalculate = useCallback(() => {
    const amountNum = parseFloat(amount);
    const startYearNum = parseInt(startYear);
    const endYearNum = parseInt(endYear);
    const rateNum = parseFloat(annualRate);
    
    if (isNaN(amountNum) || isNaN(startYearNum) || isNaN(endYearNum) || isNaN(rateNum)) {
      return;
    }
    
    if (startYearNum >= endYearNum) {
      return;
    }
    
    setResult(calculateInflation(amountNum, startYearNum, endYearNum, rateNum));
  }, [amount, startYear, endYear, annualRate]);

  const clearAll = () => {
    setAmount('1000');
    setStartYear(String(new Date().getFullYear() - 10));
    setEndYear(String(new Date().getFullYear()));
    setAnnualRate('3');
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
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
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
            {t('amount')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('annualRate')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="3"
              step="0.1"
              className="w-full pr-8 pl-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('startYear')}
          </label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            placeholder="2014"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('endYear')}
          </label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            placeholder="2024"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Rate Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('commonRates')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map(rate => (
            <button
              key={rate}
              onClick={() => setAnnualRate(String(rate))}
              className={`px-3 py-1 rounded text-sm ${
                annualRate === String(rate)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {rate}%
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{t('adjustedValue')}</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(result.adjustedValue)}
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="text-sm text-orange-600 dark:text-orange-400">{t('totalInflation')}</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatPercent(result.totalInflation)}
              </p>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{t('purchasingPowerLoss')}</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                -{result.purchasingPowerLoss.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Yearly Breakdown */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('yearlyBreakdown')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 px-3 text-left text-gray-500 dark:text-gray-400">{t('year')}</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('value')}</th>
                    <th className="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('cumulativeInflation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.yearlyBreakdown.map((row, index) => (
                    <tr key={row.year} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : ''}>
                      <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{row.year}</td>
                      <td className="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.value)}</td>
                      <td className="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatPercent(row.inflation)}</td>
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
              FV = PV × (1 + r)^n
            </code>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('formulaExplanation')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
