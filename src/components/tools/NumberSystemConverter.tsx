'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type Base = 2 | 8 | 10 | 16;

export default function NumberSystemConverter() {
  const t = useTranslations('tools.number-system-converter');
  const tCommon = useTranslations('tools');
  const [inputValue, setInputValue] = useState('255');
  const [inputBase, setInputBase] = useState<Base>(10);
  const [error, setError] = useState('');

  const baseNames: Record<Base, string> = { 2: t('binary'), 8: t('octal'), 10: t('decimal'), 16: t('hexadecimal') };
  const basePrefixes: Record<Base, string> = { 2: '0b', 8: '0o', 10: '', 16: '0x' };

  const validateInput = useCallback((value: string, base: Base): boolean => {
    if (!value.trim()) return true;
    const patterns: Record<Base, RegExp> = {
      2: /^[01]+$/i, 8: /^[0-7]+$/i, 10: /^[0-9]+$/i, 16: /^[0-9a-f]+$/i
    };
    return patterns[base].test(value.trim());
  }, []);

  const convert = useCallback((value: string, fromBase: Base, toBase: Base): string => {
    if (!value.trim()) return '';
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return '';
      return decimal.toString(toBase).toUpperCase();
    } catch { return ''; }
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!validateInput(value, inputBase)) {
      setError(t('invalidInput', { base: baseNames[inputBase] }));
    } else {
      setError('');
    }
  };

  const handleBaseChange = (base: Base) => {
    setInputBase(base);
    if (!validateInput(inputValue, base)) {
      setError(t('invalidInput', { base: baseNames[base] }));
    } else {
      setError('');
    }
  };

  const bases: Base[] = [2, 8, 10, 16];
  const isValid = !error && inputValue.trim();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('inputBase')}</label>
            <div className="flex gap-2 flex-wrap">
              {bases.map(base => (
                <button key={base} onClick={() => handleBaseChange(base)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    inputBase === base ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                  {baseNames[base]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tCommon('input')}</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-mono">{basePrefixes[inputBase]}</span>
              <input type="text" value={inputValue} onChange={(e) => handleInputChange(e.target.value)}
                className={`flex-1 p-3 border rounded-lg font-mono text-lg dark:bg-gray-700 dark:border-gray-600 ${error ? 'border-red-500' : ''}`}
                placeholder={tCommon('inputPlaceholder')} />
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('results')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bases.map(base => (
            <div key={base} className={`p-4 rounded-lg ${inputBase === base ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' : 'bg-gray-50 dark:bg-gray-700'}`}>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{baseNames[base]}</div>
              <div className="font-mono text-lg text-gray-900 dark:text-white break-all">
                {isValid ? (
                  <><span className="text-gray-400">{basePrefixes[base]}</span>{convert(inputValue, inputBase, base)}</>
                ) : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isValid && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('bitRepresentation')}</h3>
          <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
            {convert(inputValue, inputBase, 2).padStart(Math.ceil(convert(inputValue, inputBase, 2).length / 8) * 8, '0').match(/.{1,4}/g)?.join(' ')}
          </div>
        </div>
      )}
    </div>
  );
}
