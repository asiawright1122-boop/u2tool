'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function DateCalculator() {
  const t = useTranslations('tools.dateCalc');
  const [date1, setDate1] = useState(new Date().toISOString().split('T')[0]);
  const [date2, setDate2] = useState(new Date().toISOString().split('T')[0]);
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(0);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  const diff = useMemo(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    return { days: diffDays, weeks: diffWeeks, months: diffMonths, years: diffYears };
  }, [date1, date2]);

  const resultDate = useMemo(() => {
    const base = new Date(baseDate);
    const offset = operation === 'add' ? days : -days;
    base.setDate(base.getDate() + offset);
    return base.toISOString().split('T')[0];
  }, [baseDate, days, operation]);

  return (
    <div className="space-y-6">
      {/* Date Difference */}
      <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{t('dateDiff')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('startDate')}</label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('endDate')}</label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{diff.days}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('days')}</div>
          </div>
          <div className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{diff.weeks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('weeks')}</div>
          </div>
          <div className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{diff.months}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('months')}</div>
          </div>
          <div className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{diff.years}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('years')}</div>
          </div>
        </div>
      </div>

      {/* Add/Subtract Days */}
      <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{t('addSubtract')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('baseDate')}</label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('operation')}</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as 'add' | 'subtract')}
              className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="add">{t('add')}</option>
              <option value="subtract">{t('subtract')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('days')}</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-4 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('result')}</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{resultDate}</div>
        </div>
      </div>
    </div>
  );
}
