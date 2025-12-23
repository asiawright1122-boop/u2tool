'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type ConversionMode = 'octToDec' | 'decToOct' | 'octToBin' | 'binToOct' | 'octToHex' | 'hexToOct';

export default function OctalConverter() {
  const t = useTranslations('tools.octal-converter');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ConversionMode>('octToDec');
  const [error, setError] = useState('');

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
        case 'octToDec': {
          if (!/^[0-7]+$/.test(cleanInput)) {
            setError(t('errorInvalidOctal'));
            return;
          }
          result = parseInt(cleanInput, 8).toString(10);
          break;
        }
        case 'decToOct': {
          const num = parseInt(cleanInput, 10);
          if (isNaN(num) || num < 0) {
            setError(t('errorInvalidDecimal'));
            return;
          }
          result = num.toString(8);
          break;
        }
        case 'octToBin': {
          if (!/^[0-7]+$/.test(cleanInput)) {
            setError(t('errorInvalidOctal'));
            return;
          }
          const dec = parseInt(cleanInput, 8);
          result = dec.toString(2);
          break;
        }
        case 'binToOct': {
          if (!/^[01]+$/.test(cleanInput)) {
            setError(t('errorInvalidBinary'));
            return;
          }
          const dec = parseInt(cleanInput, 2);
          result = dec.toString(8);
          break;
        }
        case 'octToHex': {
          if (!/^[0-7]+$/.test(cleanInput)) {
            setError(t('errorInvalidOctal'));
            return;
          }
          const dec = parseInt(cleanInput, 8);
          result = dec.toString(16).toUpperCase();
          break;
        }
        case 'hexToOct': {
          if (!/^[0-9A-Fa-f]+$/.test(cleanInput)) {
            setError(t('errorInvalidHex'));
            return;
          }
          const dec = parseInt(cleanInput, 16);
          result = dec.toString(8);
          break;
        }
      }
      setOutput(result);
    } catch {
      setError(t('errorConversion'));
    }
  }, [input, mode, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    switch (mode) {
      case 'octToDec':
        setInput('755');
        break;
      case 'decToOct':
        setInput('493');
        break;
      case 'octToBin':
        setInput('777');
        break;
      case 'binToOct':
        setInput('111111111');
        break;
      case 'octToHex':
        setInput('755');
        break;
      case 'hexToOct':
        setInput('1ED');
        break;
    }
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as ConversionMode); setOutput(''); setError(''); }}
            className="p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value="octToDec">{t('octToDec')}</option>
            <option value="decToOct">{t('decToOct')}</option>
            <option value="octToBin">{t('octToBin')}</option>
            <option value="binToOct">{t('binToOct')}</option>
            <option value="octToHex">{t('octToHex')}</option>
            <option value="hexToOct">{t('hexToOct')}</option>
          </select>
        </div>

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full h-32 p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">
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
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-32 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
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

      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-700">{t('infoText')}</p>
      </div>
    </div>
  );
}
