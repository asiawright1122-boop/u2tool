'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type ConversionMode = 'binToDec' | 'decToBin' | 'binToHex' | 'hexToBin';

export default function BinaryToDecimal() {
  const t = useTranslations('tools.binary-to-decimal');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('binToDec');
  const [error, setError] = useState('');
  const [bitLength, setBitLength] = useState<8 | 16 | 32 | 64>(32);

  const convert = useCallback(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      let result = '';
      const cleanInput = input.trim().replace(/\s+/g, '');

      switch (mode) {
        case 'binToDec': {
          if (!/^[01]+$/.test(cleanInput)) {
            setError(t('errorInvalidBinary'));
            return;
          }
          result = parseInt(cleanInput, 2).toString(10);
          break;
        }
        case 'decToBin': {
          const num = parseInt(cleanInput, 10);
          if (isNaN(num) || num < 0) {
            setError(t('errorInvalidDecimal'));
            return;
          }
          result = num.toString(2).padStart(bitLength, '0');
          break;
        }
        case 'binToHex': {
          if (!/^[01]+$/.test(cleanInput)) {
            setError(t('errorInvalidBinary'));
            return;
          }
          const dec = parseInt(cleanInput, 2);
          result = dec.toString(16).toUpperCase();
          break;
        }
        case 'hexToBin': {
          if (!/^[0-9A-Fa-f]+$/.test(cleanInput)) {
            setError(t('errorInvalidHex'));
            return;
          }
          const decimal = parseInt(cleanInput, 16);
          result = decimal.toString(2).padStart(bitLength, '0');
          break;
        }
      }
      setOutput(result);
    } catch {
      setError(t('errorConversion'));
    }
  }, [input, mode, bitLength, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const formatBinary = (bin: string): string => {
    return bin.replace(/(.{4})/g, '$1 ').trim();
  };

  const loadSample = () => {
    switch (mode) {
      case 'binToDec':
        setInput('11111111');
        break;
      case 'decToBin':
        setInput('255');
        break;
      case 'binToHex':
        setInput('11111111');
        break;
      case 'hexToBin':
        setInput('FF');
        break;
    }
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as ConversionMode); setOutput(''); setError(''); }}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="binToDec">{t('binToDec')}</option>
            <option value="decToBin">{t('decToBin')}</option>
            <option value="binToHex">{t('binToHex')}</option>
            <option value="hexToBin">{t('hexToBin')}</option>
          </select>
        </div>

        {(mode === 'decToBin' || mode === 'hexToBin') && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">{t('bitLength')}:</label>
            <select
              value={bitLength}
              onChange={(e) => setBitLength(parseInt(e.target.value) as 8 | 16 | 32 | 64)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="8">{t('bit8')}</option>
              <option value="16">{t('bit16')}</option>
              <option value="32">{t('bit32')}</option>
              <option value="64">{t('bit64')}</option>
            </select>
          </div>
        )}

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('output')}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={mode === 'decToBin' || mode === 'hexToBin' ? formatBinary(output) : output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={convert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('convert')}
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('quickRef')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700 dark:text-blue-400">
          <div>0 = 0000</div>
          <div>1 = 0001</div>
          <div>2 = 0010</div>
          <div>3 = 0011</div>
          <div>4 = 0100</div>
          <div>5 = 0101</div>
          <div>6 = 0110</div>
          <div>7 = 0111</div>
          <div>8 = 1000</div>
          <div>9 = 1001</div>
          <div>A = 1010</div>
          <div>B = 1011</div>
          <div>C = 1100</div>
          <div>D = 1101</div>
          <div>E = 1110</div>
          <div>F = 1111</div>
        </div>
      </div>
    </div>
  );
}
