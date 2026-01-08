'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateBmi, BmiResult } from '@/lib/calculator-utils';

export default function BmiCalculator() {
  const t = useTranslations('tools.bmi-calculator');
  const tc = useTranslations('tools');

  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BmiResult | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return;
    }

    const res = calculateBmi({ weight: w, height: h, unit });
    setResult(res);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'underweight': return 'text-blue-600 dark:text-blue-400';
      case 'normal': return 'text-green-600 dark:text-green-400';
      case 'overweight': return 'text-yellow-600 dark:text-yellow-400';
      case 'obese': return 'text-red-600 dark:text-red-400';
      default: return '';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'underweight': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'normal': return 'bg-green-50 dark:bg-green-900/20';
      case 'overweight': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'obese': return 'bg-red-50 dark:bg-red-900/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setUnit('metric')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            unit === 'metric'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('metric')}
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            unit === 'imperial'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('imperial')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder={unit === 'metric' ? '70' : '154'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('height')} ({unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder={unit === 'metric' ? '170' : '67'}
          />
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
          <div className={`p-6 rounded-lg ${getCategoryBg(result.category)}`}>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{result.bmi.toFixed(1)}</div>
              <div className={`text-xl font-semibold ${getCategoryColor(result.category)}`}>
                {t(result.category)}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">{t('healthyWeightRange')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {result.healthyWeightRange.min.toFixed(1)} - {result.healthyWeightRange.max.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">{t('bmiCategories')}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">{t('underweight')}</span>
                <span>&lt; 18.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">{t('normal')}</span>
                <span>18.5 - 24.9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">{t('overweight')}</span>
                <span>25 - 29.9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">{t('obese')}</span>
                <span>&ge; 30</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
