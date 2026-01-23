'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BinaryToText() {
  const t = useTranslations('tools.binary-to-text');
  const [binary, setBinary] = useState('');
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'toText' | 'toBinary'>('toText');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const binaryToText = (bin: string): string => {
    const cleaned = bin.replace(/[^01]/g, '');
    if (cleaned.length % 8 !== 0) {
      throw new Error('Invalid binary length');
    }
    let result = '';
    for (let i = 0; i < cleaned.length; i += 8) {
      const byte = cleaned.substr(i, 8);
      result += String.fromCharCode(parseInt(byte, 2));
    }
    return result;
  };

  const textToBinary = (txt: string): string => {
    return txt.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  };

  const handleConvert = () => {
    setError('');
    try {
      if (mode === 'toText') {
        const result = binaryToText(binary);
        setText(result);
      } else {
        const result = textToBinary(text);
        setBinary(result);
      }
    } catch {
      setError(t('invalidBinary'));
    }
  };

  const copyToClipboard = () => {
    const content = mode === 'toText' ? text : binary;
    navigator.clipboard.writeText(content);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const swapMode = () => {
    setMode(mode === 'toText' ? 'toBinary' : 'toText');
    setError('');
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
            onClick={() => setMode('toText')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toText'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('binaryToText')}
          </button>
          <button
            onClick={() => setMode('toBinary')}
            className={`px-4 py-2 rounded-md transition-colors ${
              mode === 'toBinary'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('textToBinary')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toText' ? t('binaryInput') : t('textInput')}
          </label>
          <textarea
            value={mode === 'toText' ? binary : text}
            onChange={(e) => mode === 'toText' ? setBinary(e.target.value) : setText(e.target.value)}
            placeholder={mode === 'toText' ? t('binaryPlaceholder') : t('textPlaceholder')}
            className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toText' ? t('textOutput') : t('binaryOutput')}
          </label>
          <textarea
            value={mode === 'toText' ? text : binary}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={handleConvert}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        <button
          onClick={swapMode}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          🔄 {t('swap')}
        </button>
        <button
          onClick={copyToClipboard}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {copied ? t('copied') : t('copy')}
        </button>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('exampleTitle')}</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">{t('text')}:</div>
            <div className="font-mono text-gray-900 dark:text-white">Hello</div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">{t('binary')}:</div>
            <div className="font-mono text-gray-900 dark:text-white text-xs">01001000 01100101 01101100 01101100 01101111</div>
          </div>
        </div>
      </div>
    </div>
  );
}
