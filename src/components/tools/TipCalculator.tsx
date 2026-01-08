'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateTip, TipResult } from '@/lib/calculator-utils';

export default function TipCalculator() {
  const t = useTranslations('tools.tip-calculator');
  const tc = useTranslations('tools');

  const [billAmount, setBillAmount] = useState<string>('50');
  const [tipPercentage, setTipPercentage] = useState<string>('15');
  const [splitCount, setSplitCount] = useState<string>('1');
  const [result, setResult] = useState<TipResult | null>(null);

  const presetTips = [10, 15, 18, 20, 25];

  const calculate = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const split = parseInt(splitCount);

    if (isNaN(bill) || isNaN(tip) || isNaN(split) || bill <= 0 || tip < 0 || split < 1) {
      return;
    }

    const res = calculateTip({ billAmount: bill, tipPercentage: tip, splitCount: split });
    setResult(res);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('billAmount')}
        </label>
        <input
          type="number"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          placeholder="50.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tipPercentage')}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetTips.map((tip) => (
            <button
              key={tip}
              onClick={() => setTipPercentage(tip.toString())}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tipPercentage === tip.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tip}%
            </button>
          ))}
        </div>
        <input
          type="number"
          value={tipPercentage}
          onChange={(e) => setTipPercentage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="15"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('splitCount')}
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplitCount(Math.max(1, parseInt(splitCount) - 1).toString())}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            -
          </button>
          <input
            type="number"
            value={splitCount}
            onChange={(e) => setSplitCount(e.target.value)}
            className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
            min="1"
          />
          <button
            onClick={() => setSplitCount((parseInt(splitCount) + 1).toString())}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            +
          </button>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('tipAmount')}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.tipAmount)}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalAmount')}</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalAmount)}
              </div>
            </div>
          </div>

          {parseInt(splitCount) > 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('perPersonTip')}</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(result.perPersonTip)}
                </div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('perPersonTotal')}</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(result.perPersonAmount)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
