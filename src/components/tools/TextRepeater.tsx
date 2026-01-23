'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TextRepeater() {
  const t = useTranslations('tools.text-repeater');
  const [text, setText] = useState('');
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState('newline');
  const [addNumbering, setAddNumbering] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const separators: Record<string, string> = {
    newline: '\n',
    space: ' ',
    comma: ', ',
    semicolon: '; ',
    tab: '\t',
    none: '',
  };

  const result = useMemo(() => {
    if (!text) return '';
    const sep = separators[separator];
    const lines = Array.from({ length: count }, (_, i) => {
      if (addNumbering) {
        return `${i + 1}. ${text}`;
      }
      return text;
    });
    return lines.join(sep);
  }, [text, count, separator, addNumbering]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repeated-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('repeatCount')}
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            min="1"
            max="1000"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('separator')}
          </label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="newline">{t('newline')}</option>
            <option value="space">{t('space')}</option>
            <option value="comma">{t('comma')}</option>
            <option value="semicolon">{t('semicolon')}</option>
            <option value="tab">{t('tab')}</option>
            <option value="none">{t('none')}</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addNumbering}
              onChange={(e) => setAddNumbering(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('addNumbering')}</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        {[5, 10, 25, 50, 100].map(n => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className={`px-3 py-1 rounded text-sm ${
              count === n
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            ×{n}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900 dark:text-white">{t('result')}</h3>
          <div className="flex gap-2">
            <button
              onClick={copyResult}
              disabled={!result}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {copied ? t('copied') : t('copy')}
            </button>
            <button
              onClick={downloadResult}
              disabled={!result}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {t('download')}
            </button>
          </div>
        </div>
        <textarea
          value={result}
          readOnly
          className="w-full h-48 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('resultPlaceholder')}
        />
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {result.length} {t('characters')} | {result.split('\n').length} {t('lines')}
        </div>
      </div>
    </div>
  );
}
