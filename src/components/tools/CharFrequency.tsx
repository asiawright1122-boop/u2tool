'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FrequencyData {
  char: string;
  count: number;
  percentage: number;
}

function analyzeFrequency(text: string, ignoreSpaces: boolean, caseSensitive: boolean): FrequencyData[] {
  let processedText = text;
  if (!caseSensitive) processedText = processedText.toLowerCase();
  if (ignoreSpaces) processedText = processedText.replace(/\s/g, '');
  
  const freq: Record<string, number> = {};
  for (const char of processedText) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  const total = processedText.length;
  return Object.entries(freq)
    .map(([char, count]) => ({
      char: char === ' ' ? '␣' : char,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);
}

export default function CharFrequency() {
  const t = useTranslations('tools.char-frequency');
  const [input, setInput] = useState('Hello World! This is a sample text for character frequency analysis.');
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [results, setResults] = useState<FrequencyData[]>([]);

  const handleAnalyze = () => {
    setResults(analyzeFrequency(input, ignoreSpaces, caseSensitive));
  };

  const maxCount = results.length > 0 ? results[0].count : 1;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('inputLabel')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          placeholder={t('placeholder')} />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={ignoreSpaces} onChange={(e) => setIgnoreSpaces(e.target.checked)}
            className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          {t('ignoreSpaces')}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          {t('caseSensitive')}
        </label>
      </div>

      <button onClick={handleAnalyze}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        {t('analyze')}
      </button>

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{t('uniqueChars')}: {results.length}</span>
            <span>{t('totalChars')}: {results.reduce((sum, r) => sum + r.count, 0)}</span>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-1">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="w-8 text-center font-mono text-blue-600 dark:text-blue-400">{r.char}</span>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${(r.count / maxCount) * 100}%` }} />
                </div>
                <span className="w-12 text-right text-sm text-gray-700 dark:text-gray-300">{r.count}</span>
                <span className="w-16 text-right text-sm text-gray-500 dark:text-gray-400">{r.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
