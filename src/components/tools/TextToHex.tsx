'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type Encoding = 'utf8' | 'ascii' | 'utf16';
type Separator = 'space' | 'none' | 'comma' | '0x';

export default function TextToHex() {
  const t = useTranslations('tools.text-to-hex');
  const [text, setText] = useState('');
  const [hex, setHex] = useState('');
  const [encoding, setEncoding] = useState<Encoding>('utf8');
  const [separator, setSeparator] = useState<Separator>('space');
  const [uppercase, setUppercase] = useState(true);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const getSeparatorChar = (sep: Separator): string => {
    switch (sep) {
      case 'space': return ' ';
      case 'comma': return ', ';
      case '0x': return ' 0x';
      default: return '';
    }
  };

  const textToHex = useCallback((input: string): string => {
    if (!input) return '';
    
    let bytes: number[] = [];
    
    if (encoding === 'utf8') {
      const encoder = new TextEncoder();
      bytes = Array.from(encoder.encode(input));
    } else if (encoding === 'ascii') {
      bytes = input.split('').map(c => c.charCodeAt(0) & 0xFF);
    } else if (encoding === 'utf16') {
      for (let i = 0; i < input.length; i++) {
        const code = input.charCodeAt(i);
        bytes.push((code >> 8) & 0xFF);
        bytes.push(code & 0xFF);
      }
    }

    const sep = getSeparatorChar(separator);
    
    let result = bytes.map(b => {
      const hexStr = b.toString(16).padStart(2, '0');
      return uppercase ? hexStr.toUpperCase() : hexStr;
    }).join(sep);

    if (separator === '0x' && result) {
      result = '0x' + result;
    }

    return result;
  }, [encoding, separator, uppercase]);

  const hexToText = useCallback((input: string): string => {
    if (!input) return '';
    
    // Clean the input - remove 0x prefixes, spaces, commas
    const cleaned = input.replace(/0x/gi, '').replace(/[,\s]/g, '');
    
    if (!/^[0-9A-Fa-f]*$/.test(cleaned) || cleaned.length % 2 !== 0) {
      return t('errorInvalidHex');
    }

    const bytes: number[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes.push(parseInt(cleaned.substr(i, 2), 16));
    }

    if (encoding === 'utf8') {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(new Uint8Array(bytes));
    } else if (encoding === 'ascii') {
      return bytes.map(b => String.fromCharCode(b)).join('');
    } else if (encoding === 'utf16') {
      let result = '';
      for (let i = 0; i < bytes.length; i += 2) {
        const code = (bytes[i] << 8) | (bytes[i + 1] || 0);
        result += String.fromCharCode(code);
      }
      return result;
    }

    return '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encoding]);

  const handleConvert = () => {
    if (mode === 'encode') {
      setHex(textToHex(text));
    } else {
      setText(hexToText(hex));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const loadSample = () => {
    setText('Hello, World! 你好世界');
    setHex('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('encoding')}:</label>
          <select
            value={encoding}
            onChange={(e) => setEncoding(e.target.value as Encoding)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="utf8">UTF-8</option>
            <option value="ascii">ASCII</option>
            <option value="utf16">UTF-16</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('separator')}:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as Separator)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="space">{t('sepSpace')}</option>
            <option value="none">{t('sepNone')}</option>
            <option value="comma">{t('sepComma')}</option>
            <option value="0x">0x {t('sepPrefix')}</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('uppercase')}</span>
        </label>

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('textInput')}
            </label>
            {text && (
              <button
                onClick={() => handleCopy(text)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('textPlaceholder')}
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('hexOutput')}
            </label>
            {hex && (
              <button
                onClick={() => handleCopy(hex)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder={t('hexPlaceholder')}
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleConvert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'encode' ? t('textToHex') : t('hexToText')}
        </button>
        <button
          onClick={handleSwap}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ⇄ {t('swap')}
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  );
}
