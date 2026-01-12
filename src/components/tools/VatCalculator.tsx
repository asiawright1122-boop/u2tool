'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// EU VAT rates (standard rates as of 2024)
const vatRates: Record<string, { name: string; standard: number; reduced: number[]; superReduced?: number }> = {
  AT: { name: 'Austria', standard: 20, reduced: [10, 13] },
  BE: { name: 'Belgium', standard: 21, reduced: [6, 12] },
  BG: { name: 'Bulgaria', standard: 20, reduced: [9] },
  HR: { name: 'Croatia', standard: 25, reduced: [5, 13] },
  CY: { name: 'Cyprus', standard: 19, reduced: [5, 9] },
  CZ: { name: 'Czech Republic', standard: 21, reduced: [12, 15] },
  DK: { name: 'Denmark', standard: 25, reduced: [] },
  EE: { name: 'Estonia', standard: 22, reduced: [9] },
  FI: { name: 'Finland', standard: 24, reduced: [10, 14] },
  FR: { name: 'France', standard: 20, reduced: [5.5, 10], superReduced: 2.1 },
  DE: { name: 'Germany', standard: 19, reduced: [7] },
  GR: { name: 'Greece', standard: 24, reduced: [6, 13] },
  HU: { name: 'Hungary', standard: 27, reduced: [5, 18] },
  IE: { name: 'Ireland', standard: 23, reduced: [9, 13.5], superReduced: 4.8 },
  IT: { name: 'Italy', standard: 22, reduced: [5, 10], superReduced: 4 },
  LV: { name: 'Latvia', standard: 21, reduced: [5, 12] },
  LT: { name: 'Lithuania', standard: 21, reduced: [5, 9] },
  LU: { name: 'Luxembourg', standard: 17, reduced: [8], superReduced: 3 },
  MT: { name: 'Malta', standard: 18, reduced: [5, 7] },
  NL: { name: 'Netherlands', standard: 21, reduced: [9] },
  PL: { name: 'Poland', standard: 23, reduced: [5, 8] },
  PT: { name: 'Portugal', standard: 23, reduced: [6, 13] },
  RO: { name: 'Romania', standard: 19, reduced: [5, 9] },
  SK: { name: 'Slovakia', standard: 20, reduced: [10] },
  SI: { name: 'Slovenia', standard: 22, reduced: [5, 9.5] },
  ES: { name: 'Spain', standard: 21, reduced: [10], superReduced: 4 },
  SE: { name: 'Sweden', standard: 25, reduced: [6, 12] },
  CH: { name: 'Switzerland', standard: 8.1, reduced: [2.6, 3.8] },
  GB: { name: 'United Kingdom', standard: 20, reduced: [5] },
  NO: { name: 'Norway', standard: 25, reduced: [12, 15] },
};

type CalculationMode = 'addVat' | 'removeVat' | 'vatOnly';

export default function VatCalculator() {
  const t = useTranslations('tools.vat-calculator');
  
  const [amount, setAmount] = useState<string>('100');
  const [country, setCountry] = useState<string>('DE');
  const [customRate, setCustomRate] = useState<string>('');
  const [useCustomRate, setUseCustomRate] = useState(false);
  const [mode, setMode] = useState<CalculationMode>('addVat');
  const [selectedRateType, setSelectedRateType] = useState<'standard' | 'reduced' | 'superReduced'>('standard');
  const [reducedIndex, setReducedIndex] = useState(0);
  
  const [result, setResult] = useState<{
    netAmount: number;
    vatAmount: number;
    grossAmount: number;
    vatRate: number;
  } | null>(null);

  const getVatRate = (): number => {
    if (useCustomRate) {
      return parseFloat(customRate) || 0;
    }
    const countryData = vatRates[country];
    if (!countryData) return 0;
    
    if (selectedRateType === 'standard') return countryData.standard;
    if (selectedRateType === 'superReduced' && countryData.superReduced) return countryData.superReduced;
    if (selectedRateType === 'reduced' && countryData.reduced.length > 0) {
      return countryData.reduced[reducedIndex] || countryData.reduced[0];
    }
    return countryData.standard;
  };

  useEffect(() => {
    calculate();
  }, [amount, country, customRate, useCustomRate, mode, selectedRateType, reducedIndex]);

  const calculate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setResult(null);
      return;
    }

    const vatRate = getVatRate();
    const vatMultiplier = vatRate / 100;

    let netAmount: number;
    let vatAmount: number;
    let grossAmount: number;

    switch (mode) {
      case 'addVat':
        netAmount = numAmount;
        vatAmount = numAmount * vatMultiplier;
        grossAmount = numAmount + vatAmount;
        break;
      case 'removeVat':
        grossAmount = numAmount;
        netAmount = numAmount / (1 + vatMultiplier);
        vatAmount = grossAmount - netAmount;
        break;
      case 'vatOnly':
        netAmount = numAmount;
        vatAmount = numAmount * vatMultiplier;
        grossAmount = numAmount + vatAmount;
        break;
      default:
        return;
    }

    setResult({ netAmount, vatAmount, grossAmount, vatRate });
  };

  const countryData = vatRates[country];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('amount')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
              placeholder="100.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('calculationMode')}
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as CalculationMode)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="addVat">{t('addVat')}</option>
            <option value="removeVat">{t('removeVat')}</option>
            <option value="vatOnly">{t('vatOnly')}</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useCustomRate}
              onChange={(e) => setUseCustomRate(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('useCustomRate')}</span>
          </label>
        </div>

        {useCustomRate ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('customRate')}
            </label>
            <div className="relative w-48">
              <input
                type="number"
                value={customRate}
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-full px-4 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="19"
                min="0"
                max="100"
                step="0.1"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('country')}
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setSelectedRateType('standard');
                  setReducedIndex(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {Object.entries(vatRates).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.name} ({data.standard}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rateType')}
              </label>
              <select
                value={selectedRateType === 'reduced' ? `reduced-${reducedIndex}` : selectedRateType}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('reduced-')) {
                    setSelectedRateType('reduced');
                    setReducedIndex(parseInt(value.split('-')[1]));
                  } else {
                    setSelectedRateType(value as 'standard' | 'superReduced');
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="standard">
                  {t('standardRate')} ({countryData?.standard}%)
                </option>
                {countryData?.reduced.map((rate, index) => (
                  <option key={index} value={`reduced-${index}`}>
                    {t('reducedRate')} ({rate}%)
                  </option>
                ))}
                {countryData?.superReduced && (
                  <option value="superReduced">
                    {t('superReducedRate')} ({countryData.superReduced}%)
                  </option>
                )}
              </select>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('netAmount')}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                €{result.netAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('vatAmount')} ({result.vatRate}%)
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                €{result.vatAmount.toFixed(2)}
              </div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('grossAmount')}</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                €{result.grossAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('euVatRates')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left">{t('country')}</th>
                <th className="px-3 py-2 text-center">{t('standardRate')}</th>
                <th className="px-3 py-2 text-center">{t('reducedRates')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(vatRates).slice(0, 10).map(([code, data]) => (
                <tr key={code} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-3 py-2">{data.name}</td>
                  <td className="px-3 py-2 text-center font-medium">{data.standard}%</td>
                  <td className="px-3 py-2 text-center text-gray-500">
                    {data.reduced.length > 0 ? data.reduced.join('%, ') + '%' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
