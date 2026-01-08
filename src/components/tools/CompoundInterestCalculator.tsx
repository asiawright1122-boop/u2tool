'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateCompoundInterest, CompoundInterestResult } from '@/lib/calculator-utils';

export default function CompoundInterestCalculator() {
  const t = useTranslations('tools.compound-interest-calculator');
  const tc = useTranslations('tools');

  const [principal, setPrincipal] = useState<string>('10000');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [compoundingFrequency, setCompoundingFrequency] = useState<'daily' | 'monthly' | 'quarterly' | 'annually'>('monthly');
  const [regularContribution, setRegularContribution] = useState<string>('0');
  const [contributionFrequency, setContributionFrequency] = useState<'monthly' | 'annually'>('monthly');
  const [result, setResult] = useState<CompoundInterestResult | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(annualRate);
    const y = parseInt(years);
    const c = parseFloat(regularContribution) || 0;

    if (isNaN(p) || isNaN(r) || isNaN(y) || p < 0 || r < 0 || y <= 0) {
      return;
    }

    const res = calculateCompoundInterest({
      principal: p,
      annualRate: r,
      years: y,
      compoundingFrequency,
      regularContribution: c,
      contributionFrequency,
    });
    setResult(res);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('annualRate')}
          </label>
          <input
            type="number"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="7"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('years')}
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('compoundingFrequency')}
          </label>
          <select
            value={compoundingFrequency}
            onChange={(e) => setCompoundingFrequency(e.target.value as typeof compoundingFrequency)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="daily">{t('daily')}</option>
            <option value="monthly">{t('monthly')}</option>
            <option value="quarterly">{t('quarterly')}</option>
            <option value="annually">{t('annually')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('regularContribution')}
          </label>
          <input
            type="number"
            value={regularContribution}
            onChange={(e) => setRegularContribution(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('contributionFrequency')}
          </label>
          <select
            value={contributionFrequency}
            onChange={(e) => setContributionFrequency(e.target.value as 'monthly' | 'annually')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="monthly">{t('monthly')}</option>
            <option value="annually">{t('annually')}</option>
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
          <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
            <div className="text-sm opacity-80">{t('finalAmount')}</div>
            <div className="text-4xl font-bold">{formatCurrency(result.finalAmount)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('initialInvestment')}</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(parseFloat(principal))}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalContributions')}</div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(result.totalContributions)}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalInterest')}</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalInterest)}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-3">{t('growthOverTime')}</h3>
            <div className="space-y-2">
              {result.growthData.filter((_, i) => i % Math.ceil(result.growthData.length / 5) === 0 || i === result.growthData.length - 1).map((data) => (
                <div key={data.year} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('year')} {data.year}</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(data.balance / result.finalAmount) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium">{formatCurrency(data.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
