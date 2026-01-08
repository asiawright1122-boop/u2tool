'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { TAX_REGIMES, getDefaultCountryForLocale } from '@/lib/data/tax-regimes';
import type { TaxResult } from '@/lib/data/tax-regimes';
import { calculateTax } from '@/lib/tax-calculator';
import { formatCurrency } from '@/lib/currency-formatter';
import { savePreferences, loadPreferences } from '@/lib/preferences';

// Example income values for each country (in local currency)
const EXAMPLE_INCOMES: Record<string, number> = {
  US: 75000,
  CN: 200000,
  JP: 5000000,
  KR: 50000000,
  ES: 40000,
  BR: 80000,
  FR: 45000,
  DE: 50000,
  RU: 1000000,
  SA: 200000,
};

export default function TaxCalculator() {
  const t = useTranslations('tools.tax-calculator');
  const tc = useTranslations('tools');
  const tCountries = useTranslations('countries');
  const tTax = useTranslations('tax');
  const locale = useLocale();

  // State
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [filingStatus, setFilingStatus] = useState<string>('');
  const [additionalDeductions, setAdditionalDeductions] = useState<Record<string, number>>({});
  const [useStandardDeduction, setUseStandardDeduction] = useState(true);
  const [customDeduction, setCustomDeduction] = useState<string>('');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [inputError, setInputError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Get current regime
  const regime = useMemo(() => TAX_REGIMES[selectedCountry], [selectedCountry]);

  // Initialize country from localStorage or locale
  useEffect(() => {
    if (isInitialized) return;
    
    const prefs = loadPreferences();
    if (prefs && TAX_REGIMES[prefs.selectedCountry]) {
      setSelectedCountry(prefs.selectedCountry);
    } else {
      setSelectedCountry(getDefaultCountryForLocale(locale));
    }
    setIsInitialized(true);
  }, [locale, isInitialized]);

  // Update filing status when country changes
  useEffect(() => {
    if (regime && regime.filingStatuses.length > 0) {
      setFilingStatus(regime.filingStatuses[0].id);
    }
    // Clear result when country changes
    setResult(null);
    setAdditionalDeductions({});
    setGrossIncome('');
    setCustomDeduction('');
    setInputError('');
  }, [regime]);

  // Save country preference
  useEffect(() => {
    if (isInitialized && selectedCountry) {
      savePreferences(selectedCountry);
    }
  }, [selectedCountry, isInitialized]);

  // Get current filing status object
  const currentFilingStatus = useMemo(() => {
    return regime?.filingStatuses.find(s => s.id === filingStatus);
  }, [regime, filingStatus]);

  // Validate input
  const validateInput = (value: string): boolean => {
    if (!value) {
      setInputError('');
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      setInputError(t('errorInvalidNumber'));
      return false;
    }
    if (num < 0) {
      setInputError(t('errorNegativeNumber'));
      return false;
    }
    setInputError('');
    return true;
  };

  // Handle income change
  const handleIncomeChange = (value: string) => {
    setGrossIncome(value);
    validateInput(value);
    setResult(null);
  };

  // Handle country change
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  // Handle custom deduction amount change
  const handleDeductionAmountChange = (deductionId: string, value: string) => {
    const deduction = regime?.additionalDeductions.find(d => d.id === deductionId);
    if (deduction) {
      let amount = parseFloat(value) || 0;
      // Clamp to min/max if defined
      if (deduction.minAmount !== undefined) {
        amount = Math.max(amount, deduction.minAmount);
      }
      if (deduction.maxAmount !== undefined) {
        amount = Math.min(amount, deduction.maxAmount);
      }
      setAdditionalDeductions(prev => ({
        ...prev,
        [deductionId]: amount,
      }));
    }
  };

  // Calculate tax
  const calculate = () => {
    if (!regime || !currentFilingStatus) return;
    
    const income = parseFloat(grossIncome);
    if (isNaN(income) || income < 0) return;

    // Prepare deductions
    const deductions = useStandardDeduction 
      ? additionalDeductions 
      : { ...additionalDeductions, _custom: parseFloat(customDeduction) || 0 };

    try {
      const taxResult = calculateTax(regime, income, filingStatus, deductions);
      setResult(taxResult);
    } catch (error) {
      console.error('Tax calculation error:', error);
    }
  };

  // Use example income
  const useExampleIncome = () => {
    const example = EXAMPLE_INCOMES[selectedCountry] || 50000;
    setGrossIncome(example.toString());
    setInputError('');
  };

  // Check if calculate button should be disabled
  const isCalculateDisabled = !grossIncome || !!inputError || !filingStatus;

  // Check if this is Saudi Arabia (no income tax)
  const isNoTaxCountry = regime?.specialRules?.some(r => r.type === 'noIncomeTax');

  // Format currency for display
  const formatAmount = (value: number) => {
    if (!regime) return value.toString();
    return formatCurrency(value, regime);
  };

  // Get country name
  const getCountryName = (code: string) => {
    const nameKey = TAX_REGIMES[code]?.countryNameKey;
    if (!nameKey) return code;
    const key = nameKey.replace('countries.', '');
    try {
      return tCountries(key);
    } catch {
      return code;
    }
  };

  // Get filing status name
  const getFilingStatusName = (statusId: string) => {
    const status = regime?.filingStatuses.find(s => s.id === statusId);
    if (!status) return statusId;
    const key = status.nameKey.replace('tax.filingStatus.', '');
    try {
      return tTax(`filingStatus.${key}`);
    } catch {
      return statusId;
    }
  };

  // Get deduction name
  const getDeductionName = (deductionId: string) => {
    const deduction = regime?.additionalDeductions.find(d => d.id === deductionId);
    if (!deduction) return deductionId;
    const key = deduction.nameKey.replace('tax.deductions.', '');
    try {
      return tTax(`deductions.${key}`);
    } catch {
      return deductionId;
    }
  };

  return (
    <div className="space-y-6">
      {/* Country Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('selectCountry')}
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {Object.keys(TAX_REGIMES).map(code => (
            <option key={code} value={code}>
              {getCountryName(code)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('dataYear')}: {regime?.year}
        </p>
      </div>

      {/* Saudi Arabia Special Message */}
      {isNoTaxCountry ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
            {t('noIncomeTaxTitle')}
          </h3>
          <p className="text-green-700 dark:text-green-300">
            {t('noIncomeTaxDescription')}
          </p>
        </div>
      ) : (
        <>
          {/* Income Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('grossIncome')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {regime?.currencySymbol}
                </span>
                <input
                  type="number"
                  value={grossIncome}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                    inputError 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={EXAMPLE_INCOMES[selectedCountry]?.toString() || '50000'}
                />
              </div>
              {inputError && (
                <p className="mt-1 text-xs text-red-500">{inputError}</p>
              )}
              <button
                onClick={useExampleIncome}
                className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('useExample')}
              </button>
            </div>

            {/* Filing Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('filingStatus')}
              </label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {regime?.filingStatuses.map(status => (
                  <option key={status.id} value={status.id}>
                    {getFilingStatusName(status.id)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Deduction Options */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useStandardDeduction}
                  onChange={() => setUseStandardDeduction(true)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('standardDeduction')} ({currentFilingStatus ? formatAmount(currentFilingStatus.standardDeduction) : ''})
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useStandardDeduction}
                  onChange={() => setUseStandardDeduction(false)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {t('itemizedDeductions')}
                </span>
              </label>
            </div>
            
            {!useStandardDeduction && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {regime?.currencySymbol}
                </span>
                <input
                  type="number"
                  value={customDeduction}
                  onChange={(e) => setCustomDeduction(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('enterDeductions')}
                />
              </div>
            )}
          </div>

          {/* Additional Deductions (China) */}
          {regime?.additionalDeductions && regime.additionalDeductions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('additionalDeductions')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {regime.additionalDeductions.map(deduction => (
                  <div 
                    key={deduction.id} 
                    className={`p-3 rounded-lg border transition-colors ${
                      additionalDeductions[deduction.id] 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!additionalDeductions[deduction.id]}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleDeductionAmountChange(deduction.id, deduction.amount.toString());
                          } else {
                            handleDeductionAmountChange(deduction.id, '0');
                          }
                        }}
                        className="mt-1 text-blue-600 rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {getDeductionName(deduction.id)}
                        </div>
                        {deduction.maxAmount && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {t('max')}: {formatAmount(deduction.maxAmount)}/{t('year')}
                          </div>
                        )}
                        {deduction.customizable && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-gray-500 text-sm">{regime.currencySymbol}</span>
                            <input
                              type="number"
                              value={additionalDeductions[deduction.id] || ''}
                              onChange={(e) => handleDeductionAmountChange(deduction.id, e.target.value)}
                              min={deduction.minAmount || 0}
                              max={deduction.maxAmount}
                              className={`flex-1 px-2 py-1.5 text-sm border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                additionalDeductions[deduction.id]
                                  ? 'border-blue-300 dark:border-blue-600'
                                  : 'border-gray-300 dark:border-gray-600'
                              }`}
                              placeholder="0"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                {t('deductionNote')}
              </p>
            </div>
          )}

          {/* Calculate Button */}
          <button
            onClick={calculate}
            disabled={isCalculateDisabled}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              isCalculateDisabled
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {tc('calculate')}
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('estimatedTax')}</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {formatAmount(result.totalTax)}
                  </div>
                  {result.localTax !== undefined && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      + {t('localTax')}: {formatAmount(result.localTax)}
                    </div>
                  )}
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('takeHomePay')}</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(result.takeHomePay)}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('effectiveRate')}</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.effectiveRate.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Income Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('incomeSummary')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('grossIncome')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatAmount(result.grossIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('deductions')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      -{formatAmount(result.deductions)}
                    </span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('taxableIncome')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatAmount(result.taxableIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Tax Bracket Breakdown */}
              {result.bracketBreakdown.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('taxBracketBreakdown')}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600 dark:text-gray-400">
                          <th className="pb-2">{t('bracket')}</th>
                          <th className="pb-2 text-right">{t('rate')}</th>
                          <th className="pb-2 text-right">{t('taxableAmount')}</th>
                          <th className="pb-2 text-right">{t('tax')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.bracketBreakdown.map((item, index) => (
                          <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="py-2">
                              {formatAmount(item.bracket.min)} - {item.bracket.max === Infinity ? '∞' : formatAmount(item.bracket.max)}
                            </td>
                            <td className="py-2 text-right">{item.bracket.rate}%</td>
                            <td className="py-2 text-right">{formatAmount(item.taxableInBracket)}</td>
                            <td className="py-2 text-right">{formatAmount(item.taxInBracket)}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-300 dark:border-gray-600 font-medium">
                          <td className="py-2" colSpan={3}>{t('totalTax')}</td>
                          <td className="py-2 text-right">{formatAmount(result.totalTax)}</td>
                        </tr>
                        {result.localTax !== undefined && (
                          <tr className="border-t border-gray-200 dark:border-gray-700">
                            <td className="py-2" colSpan={3}>{t('localTax')} ({regime?.localTaxRate}%)</td>
                            <td className="py-2 text-right">{formatAmount(result.localTax)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('disclaimer')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
