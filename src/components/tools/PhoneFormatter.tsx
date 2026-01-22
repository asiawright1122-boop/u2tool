'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CountryFormat {
  code: string;
  name: string;
  dialCode: string;
  format: string;
  example: string;
}

const countryFormats: CountryFormat[] = [
  { code: 'US', name: 'United States', dialCode: '+1', format: '(XXX) XXX-XXXX', example: '(555) 123-4567' },
  { code: 'CN', name: 'China', dialCode: '+86', format: 'XXX XXXX XXXX', example: '138 1234 5678' },
  { code: 'JP', name: 'Japan', dialCode: '+81', format: 'XX-XXXX-XXXX', example: '90-1234-5678' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', format: 'XXX-XXXX-XXXX', example: '010-1234-5678' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', format: 'XXXX XXXXXX', example: '7911 123456' },
  { code: 'DE', name: 'Germany', dialCode: '+49', format: 'XXXX XXXXXXX', example: '1512 3456789' },
  { code: 'FR', name: 'France', dialCode: '+33', format: 'X XX XX XX XX', example: '6 12 34 56 78' },
  { code: 'ES', name: 'Spain', dialCode: '+34', format: 'XXX XX XX XX', example: '612 34 56 78' },
  { code: 'IT', name: 'Italy', dialCode: '+39', format: 'XXX XXX XXXX', example: '312 345 6789' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', format: '(XX) XXXXX-XXXX', example: '(11) 91234-5678' },
  { code: 'RU', name: 'Russia', dialCode: '+7', format: '(XXX) XXX-XX-XX', example: '(912) 345-67-89' },
  { code: 'IN', name: 'India', dialCode: '+91', format: 'XXXXX XXXXX', example: '98765 43210' },
  { code: 'AU', name: 'Australia', dialCode: '+61', format: 'XXXX XXX XXX', example: '0412 345 678' },
  { code: 'CA', name: 'Canada', dialCode: '+1', format: '(XXX) XXX-XXXX', example: '(416) 123-4567' },
];

export default function PhoneFormatter() {
  const t = useTranslations('tools.phone-formatter');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('US');
  const [includeDialCode, setIncludeDialCode] = useState(true);
  const [formatted, setFormatted] = useState('');

  const formatPhone = () => {
    const digits = phone.replace(/\D/g, '');
    const selectedCountry = countryFormats.find(c => c.code === country);

    if (!selectedCountry || !digits) {
      setFormatted('');
      return;
    }

    let result = selectedCountry.format;
    let digitIndex = 0;

    for (let i = 0; i < result.length && digitIndex < digits.length; i++) {
      if (result[i] === 'X') {
        result = result.substring(0, i) + digits[digitIndex] + result.substring(i + 1);
        digitIndex++;
      }
    }

    result = result.replace(/X/g, '').trim();

    if (includeDialCode) {
      result = `${selectedCountry.dialCode} ${result}`;
    }

    setFormatted(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
  };

  const selectedCountry = countryFormats.find(c => c.code === country);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="tool-label">
            {t('country')}
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="tool-select font-medium"
          >
            {countryFormats.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.dialCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="tool-label">
            {t('phoneNumber')}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="tool-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="includeDialCode"
          checked={includeDialCode}
          onChange={(e) => setIncludeDialCode(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor="includeDialCode" className="text-sm text-gray-700 dark:text-gray-300">
          {t('includeDialCode')}
        </label>
      </div>

      <button
        onClick={formatPhone}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('format')}
      </button>

      {selectedCountry && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('formatPattern')}: <span className="font-mono">{selectedCountry.format}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('example')}: <span className="font-mono">{selectedCountry.dialCode} {selectedCountry.example}</span>
          </div>
        </div>
      )}

      {formatted && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('result')}</div>
              <div className="text-2xl font-mono text-gray-900 dark:text-white">{formatted}</div>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('copy')}
            </button>
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3">{t('allFormats')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {countryFormats.map((c) => (
            <div key={c.code} className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>{c.name}</span>
              <span className="font-mono text-gray-500">{c.dialCode} {c.example}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
