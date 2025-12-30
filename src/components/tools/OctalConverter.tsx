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
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onChange={(e) => { setMode(e.target.value as ConversionMode); setOutput(''); setError(''); }}
            className="tool-input w-auto"
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
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="tool-label">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="tool-textarea h-32"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="tool-label mb-0">
              {t('output')}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="tool-textarea h-32"
          />
        </div>
      </div>

      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={convert}
          className="btn-primary"
        >
          {t('convert')}
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  );
}
