'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextDeduplicator() {
  const t = useTranslations('tools.dedup');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  const result = useMemo(() => {
    if (!input) return { output: '', original: 0, unique: 0, removed: 0 };
    
    const lines = input.split('\n');
    const seen = new Set<string>();
    const unique: string[] = [];
    
    for (const line of lines) {
      const processed = trimLines ? line.trim() : line;
      const key = caseSensitive ? processed : processed.toLowerCase();
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    }
    
    return {
      output: unique.join('\n'),
      original: lines.length,
      unique: unique.length,
      removed: lines.length - unique.length,
    };
  }, [input, caseSensitive, trimLines]);

  const copyResult = () => {
    navigator.clipboard.writeText(result.output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600"
          />
          <span className="text-sm text-gray-300">{t('caseSensitive')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600"
          />
          <span className="text-sm text-gray-300">{t('trimLines')}</span>
        </label>
        <button
          onClick={copyResult}
          disabled={!result.output}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {tg('copy')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-blue-400">{result.original}</div>
          <div className="text-sm text-gray-300">{t('original')}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-400">{result.unique}</div>
          <div className="text-sm text-gray-300">{t('unique')}</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-400">{result.removed}</div>
          <div className="text-sm text-gray-300">{t('removed')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={result.output}
            readOnly
            className="w-full h-64 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
