'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateLoan, LoanResult } from '@/lib/calculator-utils';

export default function LoanCalculator() {
  const t = useTranslations('tools.loan-calculator');
  const tc = useTranslations('tools');

  const [principal, setPrincipal] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('5');
  const [termMonths, setTermMonths] = useState<string>('360');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(interestRate);
    const m = parseInt(termMonths);

    if (isNaN(p) || isNaN(r) || isNaN(m) || p <= 0 || r < 0 || m <= 0) {
      return;
    }

    const res = calculateLoan({
      principal: p,
      interestRate: r,
      termMonths: m,
      paymentFrequency,
    });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('principal')}
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="100000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('interestRate')}
          </label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('termMonths')}
          </label>
          <input
            type="number"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="360"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('paymentFrequency')}
          </label>
          <select
            value={paymentFrequency}
            onChange={(e) => setPaymentFrequency(e.target.value as 'monthly' | 'biweekly' | 'weekly')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="monthly">{t('monthly')}</option>
            <option value="biweekly">{t('biweekly')}</option>
            <option value="weekly">{t('weekly')}</option>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('periodicPayment')}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.periodicPayment)}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalInterest')}</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalAmount')}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(result.totalAmount)}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showSchedule ? t('hideSchedule') : t('showSchedule')}
          </button>

          {showSchedule && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-3 py-2 text-left">{t('period')}</th>
                    <th className="px-3 py-2 text-right">{t('payment')}</th>
                    <th className="px-3 py-2 text-right">{t('principalPaid')}</th>
                    <th className="px-3 py-2 text-right">{t('interestPaid')}</th>
                    <th className="px-3 py-2 text-right">{t('balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amortizationSchedule.slice(0, 24).map((entry) => (
                    <tr key={entry.period} className="border-b dark:border-gray-700">
                      <td className="px-3 py-2">{entry.period}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.payment)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.principal)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.interest)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.amortizationSchedule.length > 24 && (
                <p className="text-sm text-gray-500 mt-2">
                  {t('showingFirst24', { total: result.amortizationSchedule.length })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
