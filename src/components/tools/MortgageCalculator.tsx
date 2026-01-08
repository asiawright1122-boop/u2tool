'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationEntry[];
}

export default function MortgageCalculator() {
  const t = useTranslations('tools.mortgage-calculator');
  const tc = useTranslations('tools');

  const [loanAmount, setLoanAmount] = useState<string>('300000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [downPayment, setDownPayment] = useState<string>('60000');
  const [extraPayment, setExtraPayment] = useState<string>('0');
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = () => {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment || '0');
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
    const months = parseFloat(loanTerm) * 12;
    const extra = parseFloat(extraPayment || '0');

    if (isNaN(principal) || isNaN(rate) || isNaN(months) || principal <= 0 || rate < 0 || months <= 0) {
      return;
    }

    // Monthly payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = rate > 0
      ? principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
      : principal / months;

    // Generate amortization schedule
    const schedule: AmortizationEntry[] = [];
    let balance = principal;
    let totalInterest = 0;

    for (let month = 1; month <= months && balance > 0; month++) {
      const interestPayment = balance * rate;
      let principalPayment = monthlyPayment - interestPayment + extra;
      
      // Ensure we don't overpay
      if (principalPayment > balance) {
        principalPayment = balance;
      }

      totalInterest += interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPayment + extra,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest,
      });

      if (balance <= 0) break;
    }

    setResult({
      monthlyPayment,
      totalPayment: schedule.reduce((sum, entry) => sum + entry.payment, 0),
      totalInterest,
      amortizationSchedule: schedule,
    });
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
            {t('homePrice')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="300000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('downPayment')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="60000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t('downPaymentPercent', { percent: ((parseFloat(downPayment || '0') / parseFloat(loanAmount || '1')) * 100).toFixed(1) })}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('interestRate')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="6.5"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('loanTerm')}
          </label>
          <select
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="10">10 {t('years')}</option>
            <option value="15">15 {t('years')}</option>
            <option value="20">20 {t('years')}</option>
            <option value="25">25 {t('years')}</option>
            <option value="30">30 {t('years')}</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('extraMonthlyPayment')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="0"
            />
          </div>
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
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('monthlyPayment')}</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.monthlyPayment + parseFloat(extraPayment || '0'))}
              </div>
              {parseFloat(extraPayment || '0') > 0 && (
                <div className="text-xs text-gray-500">
                  ({formatCurrency(result.monthlyPayment)} + {formatCurrency(parseFloat(extraPayment))} {t('extra')})
                </div>
              )}
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalInterest')}</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalPayment')}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(result.totalPayment)}
              </div>
            </div>
          </div>

          {/* Loan Summary */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('loanSummary')}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('loanAmount')}:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {formatCurrency(parseFloat(loanAmount) - parseFloat(downPayment || '0'))}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">{t('payoffTime')}:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {Math.ceil(result.amortizationSchedule.length / 12)} {t('years')} {result.amortizationSchedule.length % 12} {t('monthsShort')}
                </span>
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
                    <th className="px-3 py-2 text-left">{t('month')}</th>
                    <th className="px-3 py-2 text-right">{t('payment')}</th>
                    <th className="px-3 py-2 text-right">{t('principal')}</th>
                    <th className="px-3 py-2 text-right">{t('interest')}</th>
                    <th className="px-3 py-2 text-right">{t('balance')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amortizationSchedule.slice(0, 36).map((entry) => (
                    <tr key={entry.month} className="border-b dark:border-gray-700">
                      <td className="px-3 py-2">{entry.month}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.payment)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.principal)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.interest)}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.amortizationSchedule.length > 36 && (
                <p className="text-sm text-gray-500 mt-2">
                  {t('showingFirst36', { total: result.amortizationSchedule.length })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
