'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function LineCounter() {
  const t = useTranslations('tools.lineCounter');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [ignoreEmpty, setIgnoreEmpty] = useState(false);

  const stats = useMemo(() => {
    if (!input) {
      return { total: 0, nonEmpty: 0, empty: 0, unique: 0 };
    }

    const lines = input.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const uniqueLines = new Set(nonEmptyLines.map(l => l.trim()));

    return {
      total: lines.length,
      nonEmpty: nonEmptyLines.length,
      empty: lines.length - nonEmptyLines.length,
      unique: uniqueLines.size,
    };
  }, [input]);

  const removeDuplicates = () => {
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique = lines.filter(line => {
      const trimmed = line.trim();
      if (ignoreEmpty && !trimmed) return false;
      if (seen.has(trimmed)) return false;
      seen.add(trimmed);
      return true;
    });
    setInput(unique.join('\n'));
  };

  const removeEmpty = () => {
    const lines = input.split('\n').filter(line => line.trim().length > 0);
    setInput(lines.join('\n'));
  };

  const sortLines = () => {
    const lines = input.split('\n');
    lines.sort((a, b) => a.localeCompare(b));
    setInput(lines.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('totalLines')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.nonEmpty}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('nonEmptyLines')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.empty}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('emptyLines')}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.unique}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">{t('uniqueLines')}</div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={removeDuplicates}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {t('removeDuplicates')}
        </button>
        <button
          onClick={removeEmpty}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          {t('removeEmpty')}
        </button>
        <button
          onClick={sortLines}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          {t('sortLines')}
        </button>
        <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreEmpty}
            onChange={(e) => setIgnoreEmpty(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('ignoreEmpty')}</span>
        </label>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder={t('placeholder')}
        />
      </div>
    </div>
  );
}
