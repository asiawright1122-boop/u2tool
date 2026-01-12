'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// IBAN country specifications
const ibanSpecs: Record<string, { length: number; name: string; example: string }> = {
  AL: { length: 28, name: 'Albania', example: 'AL35202111090000000001234567' },
  AD: { length: 24, name: 'Andorra', example: 'AD1400080001001234567890' },
  AT: { length: 20, name: 'Austria', example: 'AT483200000012345864' },
  BE: { length: 16, name: 'Belgium', example: 'BE71096123456769' },
  BA: { length: 20, name: 'Bosnia and Herzegovina', example: 'BA393385804800211234' },
  BG: { length: 22, name: 'Bulgaria', example: 'BG18RZBB91550123456789' },
  HR: { length: 21, name: 'Croatia', example: 'HR1723600001101234565' },
  CY: { length: 28, name: 'Cyprus', example: 'CY21002001950000357001234567' },
  CZ: { length: 24, name: 'Czech Republic', example: 'CZ5508000000001234567899' },
  DK: { length: 18, name: 'Denmark', example: 'DK9520000123456789' },
  EE: { length: 20, name: 'Estonia', example: 'EE471000001020145685' },
  FI: { length: 18, name: 'Finland', example: 'FI1410093000123458' },
  FR: { length: 27, name: 'France', example: 'FR7630006000011234567890189' },
  DE: { length: 22, name: 'Germany', example: 'DE75512108001245126199' },
  GR: { length: 27, name: 'Greece', example: 'GR9608100010000001234567890' },
  HU: { length: 28, name: 'Hungary', example: 'HU93116000060000000012345676' },
  IS: { length: 26, name: 'Iceland', example: 'IS750001121234563108962099' },
  IE: { length: 22, name: 'Ireland', example: 'IE64IRCE92050112345678' },
  IT: { length: 27, name: 'Italy', example: 'IT60X0542811101000000123456' },
  LV: { length: 21, name: 'Latvia', example: 'LV97HABA0012345678910' },
  LI: { length: 21, name: 'Liechtenstein', example: 'LI7408806123456789012' },
  LT: { length: 20, name: 'Lithuania', example: 'LT601010012345678901' },
  LU: { length: 20, name: 'Luxembourg', example: 'LU120010001234567891' },
  MT: { length: 31, name: 'Malta', example: 'MT31MALT01100000000000000000123' },
  MC: { length: 27, name: 'Monaco', example: 'MC5810096180790123456789085' },
  ME: { length: 22, name: 'Montenegro', example: 'ME25505000012345678951' },
  NL: { length: 18, name: 'Netherlands', example: 'NL02ABNA0123456789' },
  MK: { length: 19, name: 'North Macedonia', example: 'MK07200002785123453' },
  NO: { length: 15, name: 'Norway', example: 'NO8330001234567' },
  PL: { length: 28, name: 'Poland', example: 'PL10105000997603123456789123' },
  PT: { length: 25, name: 'Portugal', example: 'PT50002700000001234567833' },
  RO: { length: 24, name: 'Romania', example: 'RO09BCYP0000001234567890' },
  SM: { length: 27, name: 'San Marino', example: 'SM76P0854009812123456789123' },
  RS: { length: 22, name: 'Serbia', example: 'RS35105008123123123173' },
  SK: { length: 24, name: 'Slovakia', example: 'SK8975000000000012345671' },
  SI: { length: 19, name: 'Slovenia', example: 'SI56192001234567892' },
  ES: { length: 24, name: 'Spain', example: 'ES7921000813610123456789' },
  SE: { length: 24, name: 'Sweden', example: 'SE7280000810340009783242' },
  CH: { length: 21, name: 'Switzerland', example: 'CH5604835012345678009' },
  GB: { length: 22, name: 'United Kingdom', example: 'GB33BUKB20201555555555' },
};

export default function IbanValidator() {
  const t = useTranslations('tools.iban-validator');
  const [iban, setIban] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    country?: string;
    countryCode?: string;
    checkDigits?: string;
    bban?: string;
    bankCode?: string;
    formattedIban?: string;
    error?: string;
  } | null>(null);

  const formatIban = (value: string): string => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  };

  const validateMod97 = (iban: string): boolean => {
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numericIban = rearranged.replace(/[A-Z]/g, (char) => 
      (char.charCodeAt(0) - 55).toString()
    );
    
    let remainder = '';
    for (const digit of numericIban) {
      remainder = ((parseInt(remainder + digit, 10)) % 97).toString();
    }
    return parseInt(remainder, 10) === 1;
  };

  const validate = () => {
    const cleaned = iban.replace(/\s/g, '').toUpperCase();
    
    if (!cleaned) {
      setResult({ valid: false, error: t('errors.empty') });
      return;
    }

    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleaned)) {
      setResult({ valid: false, error: t('errors.invalidFormat') });
      return;
    }

    const countryCode = cleaned.slice(0, 2);
    const spec = ibanSpecs[countryCode];

    if (!spec) {
      setResult({ valid: false, error: t('errors.unknownCountry') });
      return;
    }

    if (cleaned.length !== spec.length) {
      setResult({ 
        valid: false, 
        error: t('errors.invalidLength', { expected: spec.length, actual: cleaned.length })
      });
      return;
    }

    if (!validateMod97(cleaned)) {
      setResult({ valid: false, error: t('errors.invalidChecksum') });
      return;
    }

    setResult({
      valid: true,
      country: spec.name,
      countryCode,
      checkDigits: cleaned.slice(2, 4),
      bban: cleaned.slice(4),
      bankCode: cleaned.slice(4, 8),
      formattedIban: formatIban(cleaned),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setIban(value);
    setResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={iban}
            onChange={handleInputChange}
            placeholder={t('placeholder')}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg"
          />
          <button
            onClick={validate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('validate')}
          </button>
        </div>
      </div>

      {result && (
        <div className={`p-6 rounded-xl ${
          result.valid 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-3xl ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
              {result.valid ? '✓' : '✗'}
            </span>
            <span className={`text-xl font-semibold ${
              result.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {result.valid ? t('valid') : t('invalid')}
            </span>
          </div>

          {result.error && (
            <p className="text-red-600 dark:text-red-400">{result.error}</p>
          )}

          {result.valid && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('country')}</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {result.country} ({result.countryCode})
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('checkDigits')}</div>
                  <div className="font-medium text-gray-900 dark:text-white font-mono">
                    {result.checkDigits}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('bankCode')}</div>
                  <div className="font-medium text-gray-900 dark:text-white font-mono">
                    {result.bankCode}
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t('bban')}</div>
                  <div className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                    {result.bban}
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('formatted')}</div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg text-gray-900 dark:text-white">
                    {result.formattedIban}
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.formattedIban || '')}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {t('copy')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('exampleIbans')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {Object.entries(ibanSpecs).slice(0, 12).map(([code, spec]) => (
            <button
              key={code}
              onClick={() => {
                setIban(spec.example);
                setResult(null);
              }}
              className="p-2 text-left bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">{spec.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">
                {formatIban(spec.example)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
