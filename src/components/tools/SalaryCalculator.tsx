'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type PayFrequency = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export default function SalaryCalculator() {
  const t = useTranslations('tools');
  
  const [amount, setAmount] = useState<number>(50000);
  const [frequency, setFrequency] = useState<PayFrequency>('annual');
  const [currency, setCurrency] = useState<string>('USD');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [taxRate, setTaxRate] = useState<number>(25);

  const _currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  const calculations = useMemo(() => {
    if (!amount || amount <= 0) return null;

    // Convert to annual first
    let annual: number;
    const weeksPerYear = 52;
    const monthsPerYear = 12;
    const workDaysPerWeek = 5;

    switch (frequency) {
      case 'hourly':
        annual = amount * hoursPerWeek * weeksPerYear;
        break;
      case 'daily':
        annual = amount * workDaysPerWeek * weeksPerYear;
        break;
      case 'weekly':
        annual = amount * weeksPerYear;
        break;
      case 'biweekly':
        annual = amount * (weeksPerYear / 2);
        break;
      case 'monthly':
        annual = amount * monthsPerYear;
        break;
      case 'annual':
      default:
        annual = amount;
        break;
    }

    const hourly = annual / (hoursPerWeek * weeksPerYear);
    const daily = annual / (workDaysPerWeek * weeksPerYear);
    const weekly = annual / weeksPerYear;
    const biweekly = annual / (weeksPerYear / 2);
    const monthly = annual / monthsPerYear;

    const taxMultiplier = 1 - (taxRate / 100);

    return {
      beforeTax: {
        hourly,
        daily,
        weekly,
        biweekly,
        monthly,
        annual,
      },
      afterTax: {
        hourly: hourly * taxMultiplier,
        daily: daily * taxMultiplier,
        weekly: weekly * taxMultiplier,
        biweekly: biweekly * taxMultiplier,
        monthly: monthly * taxMultiplier,
        annual: annual * taxMultiplier,
      },
    };
  }, [amount, frequency, hoursPerWeek, taxRate]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const frequencies: { value: PayFrequency; label: string }[] = [
    { value: 'hourly', label: t('salary.hourly') },
    { value: 'daily', label: t('salary.daily') },
    { value: 'weekly', label: t('salary.weekly') },
    { value: 'biweekly', label: t('salary.biweekly') },
    { value: 'monthly', label: t('salary.monthly') },
    { value: 'annual', label: t('salary.annual') },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.amount')}
            </label>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.payFrequency')}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as PayFrequency)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {frequencies.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.hoursPerWeek')}
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 40)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('salary.taxRate')} (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <input
              type="range"
              min="0"
              max="60"
              step="1"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {calculations && (
            <>
              {/* Before Tax */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
                  {t('salary.beforeTax')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.hourly')}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.hourly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.daily')}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.daily)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.weekly')}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.weekly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.biweekly')}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.biweekly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.monthly')}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.monthly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.annual')}</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(calculations.beforeTax.annual)}
                    </div>
                  </div>
                </div>
              </div>

              {/* After Tax */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h3 className="font-medium text-green-800 dark:text-green-300 mb-3">
                  {t('salary.afterTax')} ({taxRate}% {t('salary.taxRate')})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.hourly')}</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.hourly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.daily')}</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.daily)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.weekly')}</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.weekly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.biweekly')}</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.biweekly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.monthly')}</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.monthly)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t('salary.annual')}</div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculations.afterTax.annual)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
