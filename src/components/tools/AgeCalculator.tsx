'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateAge, AgeResult } from '@/lib/calculator-utils';

export default function AgeCalculator() {
  const t = useTranslations('tools.age-calculator');
  const tc = useTranslations('tools');

  const [birthDate, setBirthDate] = useState<string>('');
  const [referenceDate, setReferenceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [result, setResult] = useState<AgeResult | null>(null);

  const calculate = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const reference = referenceDate ? new Date(referenceDate) : new Date();

    if (isNaN(birth.getTime()) || birth > reference) {
      return;
    }

    const res = calculateAge({ birthDate: birth, referenceDate: reference });
    setResult(res);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('birthDate')}
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('referenceDate')}
          </label>
          <input
            type="date"
            value={referenceDate}
            onChange={(e) => setReferenceDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
          <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-center">
            <div className="text-5xl font-bold mb-2">
              {result.years} <span className="text-2xl">{t('years')}</span>
            </div>
            <div className="text-xl">
              {result.months} {t('months')}, {result.days} {t('days')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalDays')}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalWeeks')}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(result.totalDays / 7).toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalMonths')}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(result.years * 12 + result.months).toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalHours')}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(result.totalDays * 24).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎂</span>
              <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                {t('nextBirthday')}
              </span>
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              {formatDate(result.nextBirthday)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('daysUntilBirthday', { days: result.daysUntilBirthday })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
