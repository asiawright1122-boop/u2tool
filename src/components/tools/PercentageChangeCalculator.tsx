'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function PercentageChangeCalculator() {
  const t = useTranslations('tools.percentage-change-calculator');
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [result, setResult] = useState<{ change: number; isIncrease: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const old = parseFloat(oldValue);
    const current = parseFloat(newValue);
    if (isNaN(old) || isNaN(current) || old === 0) {
      setResult(null);
      return;
    }
    const change = ((current - old) / Math.abs(old)) * 100;
    setResult({ change, isIncrease: change >= 0 });
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.change >= 0 ? '+' : ''}${result.change.toFixed(2)}%`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swap = () => {
    setOldValue(newValue);
    setNewValue(oldValue);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('oldValue')}
          </label>
          <input
            type="number"
            value={oldValue}
            onChange={(e) => setOldValue(e.target.value)}
            placeholder={t('oldValuePlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('newValue')}
          </label>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={t('newValuePlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xl"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={calculate}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('calculate')}
        </button>
        <button
          onClick={swap}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          🔄 {t('swap')}
        </button>
      </div>

      {result && (
        <div className={`p-6 rounded-lg ${result.isIncrease ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('percentageChange')}</div>
            <div className={`text-5xl font-bold ${result.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.isIncrease ? '↑' : '↓'} {Math.abs(result.change).toFixed(2)}%
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              {result.isIncrease ? t('increase') : t('decrease')}
            </div>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t('difference')}: {(parseFloat(newValue) - parseFloat(oldValue)).toFixed(2)}
            </div>
            <button
              onClick={copyResult}
              className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('formula')}</h3>
        <div className="text-center font-mono text-lg text-gray-700 dark:text-gray-300">
          {t('formulaText')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-2xl mb-1">📈</div>
          <div className="font-medium text-gray-900 dark:text-white">{t('example1Title')}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('example1')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-2xl mb-1">💰</div>
          <div className="font-medium text-gray-900 dark:text-white">{t('example2Title')}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('example2')}</div>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="font-medium text-gray-900 dark:text-white">{t('example3Title')}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('example3')}</div>
        </div>
      </div>
    </div>
  );
}
