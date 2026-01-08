'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { currencies, convertCurrency } from '@/lib/data/currencies';

export default function CurrencyConverter() {
  const t = useTranslations('tools.currency-converter');

  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    calculate();
  }, [amount, fromCurrency, toCurrency]);

  const calculate = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setResult(null);
      setExchangeRate(null);
      return;
    }

    try {
      const converted = convertCurrency(numAmount, fromCurrency, toCurrency);
      const rate = convertCurrency(1, fromCurrency, toCurrency);
      setResult(converted);
      setExchangeRate(rate);
    } catch {
      setResult(null);
      setExchangeRate(null);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code);
  };

  const formatResult = (value: number, currencyCode: string) => {
    const currency = getCurrencyInfo(currencyCode);
    if (!currency) return value.toFixed(2);
    const decimals = ['BTC', 'ETH'].includes(currencyCode) ? 8 : 2;
    return `${currency.symbol}${value.toLocaleString('en-US', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals 
    })}`;
  };

  const currencyGroups = {
    major: currencies.filter(c => ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD'].includes(c.code)),
    asian: currencies.filter(c => ['KRW', 'SGD', 'TWD', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'INR', 'PKR', 'HKD', 'NZD'].includes(c.code)),
    european: currencies.filter(c => ['SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'TRY', 'RUB', 'UAH'].includes(c.code)),
    americas: currencies.filter(c => ['MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN'].includes(c.code)),
    middleEast: currencies.filter(c => ['AED', 'SAR', 'ILS', 'EGP', 'ZAR', 'NGN', 'KES'].includes(c.code)),
    crypto: currencies.filter(c => ['BTC', 'ETH'].includes(c.code)),
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('amount')}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          placeholder="100"
          min="0"
          step="any"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('from')}
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('majorCurrencies')}>
              {currencyGroups.major.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('asianCurrencies')}>
              {currencyGroups.asian.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('europeanCurrencies')}>
              {currencyGroups.european.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('americasCurrencies')}>
              {currencyGroups.americas.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('middleEastCurrencies')}>
              {currencyGroups.middleEast.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('crypto')}>
              {currencyGroups.crypto.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors self-end mb-0.5"
          title={t('swap')}
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('to')}
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('majorCurrencies')}>
              {currencyGroups.major.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('asianCurrencies')}>
              {currencyGroups.asian.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('europeanCurrencies')}>
              {currencyGroups.european.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('americasCurrencies')}>
              {currencyGroups.americas.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('middleEastCurrencies')}>
              {currencyGroups.middleEast.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
            <optgroup label={t('crypto')}>
              {currencyGroups.crypto.map(c => (
                <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {result !== null && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {formatResult(parseFloat(amount) || 0, fromCurrency)} =
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatResult(result, toCurrency)}
              </div>
            </div>
          </div>

          {exchangeRate !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('exchangeRate')}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('inverseRate')}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  1 {toCurrency} = {(1 / exchangeRate).toFixed(6)} {fromCurrency}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t('quickConversions')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left">{fromCurrency}</th>
                <th className="px-3 py-2 text-right">{toCurrency}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 5, 10, 50, 100, 500, 1000].map((val) => (
                <tr key={val} className="border-b dark:border-gray-700">
                  <td className="px-3 py-2">{formatResult(val, fromCurrency)}</td>
                  <td className="px-3 py-2 text-right">
                    {formatResult(convertCurrency(val, fromCurrency, toCurrency), toCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        {t('disclaimer')}
      </p>
    </div>
  );
}
