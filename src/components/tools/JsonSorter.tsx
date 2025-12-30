'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type SortOrder = 'asc' | 'desc';

function sortObject(obj: unknown, order: SortOrder): unknown {
  if (Array.isArray(obj)) {
    return obj.map(item => sortObject(item, order));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>);
    keys.sort((a, b) => order === 'asc' ? a.localeCompare(b) : b.localeCompare(a));
    
    for (const key of keys) {
      sorted[key] = sortObject((obj as Record<string, unknown>)[key], order);
    }
    return sorted;
  }
  
  return obj;
}

export default function JsonSorter() {
  const t = useTranslations('tools.jsonSort');
  const tg = useTranslations('tools');
  const [input, setInput] = useState(`{
  "zebra": 1,
  "apple": 2,
  "mango": {
    "z": 1,
    "a": 2
  },
  "banana": [3, 1, 2]
}`);
  const [output, setOutput] = useState('');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [error, setError] = useState('');

  const sortJson = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const sorted = sortObject(parsed, order);
      setOutput(JSON.stringify(sorted, null, 2));
    } catch {
      setError(t('invalidJson'));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as SortOrder)}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="asc">{t('ascending')}</option>
          <option value="desc">{t('descending')}</option>
        </select>
        <button
          onClick={sortJson}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
        >
          {t('sort')}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
        >
          {tg('copy')}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-500 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
