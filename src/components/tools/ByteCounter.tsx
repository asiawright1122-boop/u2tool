'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ByteCounter() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');

  const getByteLength = (str: string, encoding: string): number => {
    if (encoding === 'utf8') {
      return new TextEncoder().encode(str).length;
    } else if (encoding === 'utf16') {
      return str.length * 2;
    } else if (encoding === 'ascii') {
      return str.length;
    }
    return 0;
  };

  const utf8Bytes = getByteLength(text, 'utf8');
  const utf16Bytes = getByteLength(text, 'utf16');
  const asciiBytes = getByteLength(text, 'ascii');
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('input')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('byteCounter.placeholder')}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{charCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('byteCounter.characters')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{utf8Bytes}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">UTF-8 {t('byteCounter.bytes')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{utf16Bytes}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">UTF-16 {t('byteCounter.bytes')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{asciiBytes}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">ASCII {t('byteCounter.bytes')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{lineCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('byteCounter.lines')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {utf8Bytes > 1024 ? (utf8Bytes / 1024).toFixed(2) + ' KB' : utf8Bytes + ' B'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('byteCounter.size')}</div>
        </div>
      </div>
    </div>
  );
}
