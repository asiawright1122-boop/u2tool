'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextToBinary() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');
  const [binary, setBinary] = useState('');
  const [mode, setMode] = useState<'toBinary' | 'toText'>('toBinary');
  const [copied, setCopied] = useState(false);

  const textToBinary = (str: string): string => {
    return str.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
  };

  const binaryToText = (bin: string): string => {
    const bytes = bin.replace(/[^01]/g, '').match(/.{1,8}/g);
    if (!bytes) return '';
    return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (mode === 'toBinary') {
      setBinary(textToBinary(value));
    }
  };

  const handleBinaryChange = (value: string) => {
    setBinary(value);
    if (mode === 'toText') {
      try {
        setText(binaryToText(value));
      } catch {
        setText('');
      }
    }
  };

  const switchMode = (newMode: 'toBinary' | 'toText') => {
    setMode(newMode);
    if (newMode === 'toBinary' && text) {
      setBinary(textToBinary(text));
    } else if (newMode === 'toText' && binary) {
      setText(binaryToText(binary));
    }
  };

  const copyResult = () => {
    const result = mode === 'toBinary' ? binary : text;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => switchMode('toBinary')}
          className={`px-4 py-2 rounded ${mode === 'toBinary' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          {t('textBinary.toBinary')}
        </button>
        <button
          onClick={() => switchMode('toText')}
          className={`px-4 py-2 rounded ${mode === 'toText' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
        >
          {t('textBinary.toText')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('textBinary.text')}</label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-white"
            placeholder={t('textBinary.textPlaceholder')}
            readOnly={mode === 'toText'}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">{t('textBinary.binary')}</label>
            <button onClick={copyResult} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            className="w-full h-40 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"
            placeholder={t('textBinary.binaryPlaceholder')}
            readOnly={mode === 'toBinary'}
          />
        </div>
      </div>
    </div>
  );
}
