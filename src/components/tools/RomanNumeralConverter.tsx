'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function RomanNumeralConverter() {
  const t = useTranslations('tools.roman-numeral-converter');
  const [arabic, setArabic] = useState('');
  const [roman, setRoman] = useState('');
  const [mode, setMode] = useState<'toRoman' | 'toArabic'>('toRoman');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];

  const arabicToRoman = (num: number): string => {
    if (num < 1 || num > 3999) throw new Error('Range 1-3999');
    let result = '';
    for (const [value, symbol] of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  };

  const romanToArabic = (str: string): number => {
    const romanMap: Record<string, number> = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    const upper = str.toUpperCase().replace(/[^IVXLCDM]/g, '');
    if (!upper) throw new Error('Invalid');
    let result = 0;
    for (let i = 0; i < upper.length; i++) {
      const current = romanMap[upper[i]];
      const next = romanMap[upper[i + 1]];
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  };

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'toRoman') {
        const num = parseInt(arabic);
        if (isNaN(num)) throw new Error('Invalid number');
        setRoman(arabicToRoman(num));
      } else {
        setArabic(romanToArabic(roman).toString());
      }
    } catch {
      setError(t('invalidInput'));
    }
  };

  const copyResult = () => {
    const result = mode === 'toRoman' ? roman : arabic;
    navigator.clipboard.writeText(result);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <button
            onClick={() => setMode('toRoman')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toRoman' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('arabicToRoman')}
          </button>
          <button
            onClick={() => setMode('toArabic')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toArabic' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('romanToArabic')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toRoman' ? t('arabicNumber') : t('romanNumeral')}
          </label>
          <input
            type="text"
            value={mode === 'toRoman' ? arabic : roman}
            onChange={(e) => mode === 'toRoman' ? setArabic(e.target.value) : setRoman(e.target.value)}
            placeholder={mode === 'toRoman' ? t('arabicPlaceholder') : t('romanPlaceholder')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-2xl text-center font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toRoman' ? t('romanNumeral') : t('arabicNumber')}
          </label>
          <input
            type="text"
            value={mode === 'toRoman' ? roman : arabic}
            readOnly
            placeholder={t('result')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-2xl text-center font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button onClick={handleConvert} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          {t('convert')}
        </button>
        <button onClick={copyResult} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          {copied ? t('copied') : t('copy')}
        </button>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('referenceTitle')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-center text-sm">
          {[['I', '1'], ['V', '5'], ['X', '10'], ['L', '50'], ['C', '100'], ['D', '500'], ['M', '1000']].map(([r, a]) => (
            <div key={r} className="p-2 bg-white dark:bg-gray-700 rounded">
              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{r}</div>
              <div className="text-gray-600 dark:text-gray-400">{a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
