'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function RandomGenerator() {
  const t = useTranslations('tools.random');
  const tg = useTranslations('tools');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const nums: number[] = [];
    const range = max - min + 1;
    
    if (unique && count > range) {
      // Can't generate more unique numbers than the range
      setResults([]);
      return;
    }

    if (unique) {
      const available = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * available.length);
        nums.push(available[idx]);
        available.splice(idx, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        nums.push(Math.floor(Math.random() * range) + min);
      }
    }
    
    setResults(nums);
  };

  const copyResults = () => {
    navigator.clipboard.writeText(results.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('min')}</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('max')}</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">{tg('count')}</label>
          <input
            type="number"
            value={count}
            min={1}
            max={1000}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-700 border-gray-600"
            />
            <span className="text-sm text-gray-300">{t('unique')}</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {tg('generate')}
        </button>
        <button
          onClick={copyResults}
          disabled={results.length === 0}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {tg('copy')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-sm text-gray-300 mb-2">{tg('result')} ({results.length})</div>
          <div className="flex flex-wrap gap-2">
            {results.map((num, i) => (
              <span key={i} className="px-3 py-1 bg-gray-600 rounded text-white font-mono">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
