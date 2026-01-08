'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface RoiResult {
  simpleRoi: number;
  annualizedRoi: number;
  totalGain: number;
  totalReturn: number;
}

export default function RoiCalculator() {
  const t = useTranslations('tools.roi-calculator');
  const tc = useTranslations('tools');

  const [initialInvestment, setInitialInvestment] = useState<string>('10000');
  const [finalValue, setFinalValue] = useState<string>('15000');
  const [timePeriod, setTimePeriod] = useState<string>('3');
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [result, setResult] = useState<RoiResult | null>(null);

  const calculate = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const period = parseFloat(timePeriod);

    if (isNaN(initial) || isNaN(final) || isNaN(period) || initial <= 0 || period <= 0) {
      return;
    }

    // Convert months to years if needed
    const years = timeUnit === 'months' ? period / 12 : period;

    // Simple ROI = ((Final Value - Initial Investment) / Initial Investment) * 100
    const totalGain = final - initial;
    const simpleRoi = (totalGain / initial) * 100;

    // Annualized ROI = ((1 + ROI)^(1/years) - 1) * 100
    const totalReturn = final / initial;
    const annualizedRoi = years > 0 ? (Math.pow(totalReturn, 1 / years) - 1) * 100 : simpleRoi;

    setResult({
      simpleRoi,
      annualizedRoi,
      totalGain,
      totalReturn,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('initialInvestment')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="10000"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('finalValue')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="15000"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('timePeriod')}
          </label>
          <input
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="3"
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('timeUnit')}
          </label>
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value as 'years' | 'months')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="years">{t('years')}</option>
            <option value="months">{t('months')}</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('simpleRoi')}</div>
              <div className={`text-2xl font-bold ${result.simpleRoi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercent(result.simpleRoi)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('annualizedRoi')}</div>
              <div className={`text-2xl font-bold ${result.annualizedRoi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercent(result.annualizedRoi)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalGain')}</div>
              <div className={`text-xl font-semibold ${result.totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.totalGain >= 0 ? '+' : ''}{formatCurrency(result.totalGain)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalReturn')}</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {result.totalReturn.toFixed(2)}x
              </div>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('calculationBreakdown')}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium">{t('simpleRoiFormula')}:</span> ((Final - Initial) / Initial) × 100
              </p>
              <p className="pl-4">
                = (({formatCurrency(parseFloat(finalValue))} - {formatCurrency(parseFloat(initialInvestment))}) / {formatCurrency(parseFloat(initialInvestment))}) × 100
              </p>
              <p className="pl-4 font-medium text-gray-900 dark:text-white">
                = {formatPercent(result.simpleRoi)}
              </p>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <p>
                <span className="font-medium">{t('annualizedRoiFormula')}:</span> ((1 + ROI)^(1/years) - 1) × 100
              </p>
              <p className="pl-4 font-medium text-gray-900 dark:text-white">
                = {formatPercent(result.annualizedRoi)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
