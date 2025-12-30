'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextHashComparator() {
  const t = useTranslations('tools');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [isComparing, setIsComparing] = useState(false);

  const algorithms = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];

  const computeHash = async (text: string, algo: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      const [h1, h2] = await Promise.all([
        computeHash(text1, algorithm),
        computeHash(text2, algorithm)
      ]);
      setHash1(h1);
      setHash2(h2);
    } catch {
      setHash1('Error');
      setHash2('Error');
    }
    setIsComparing(false);
  };

  const isMatch = hash1 && hash2 && hash1 === hash2;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100"
        >
          {algorithms.map(algo => (
            <option key={algo} value={algo}>{algo}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('hashCompare.text1')}
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder={t('hashCompare.placeholder')}
            className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
          {hash1 && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono break-all text-gray-600 dark:text-gray-300">
              {hash1}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('hashCompare.text2')}
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder={t('hashCompare.placeholder')}
            className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
          {hash2 && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono break-all text-gray-600 dark:text-gray-300">
              {hash2}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={isComparing || !text1 || !text2}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-500 dark:disabled:text-gray-400 rounded-lg font-medium transition-colors"
      >
        {isComparing ? t('hashCompare.comparing') : t('hashCompare.compare')}
      </button>

      {hash1 && hash2 && (
        <div className={`p-4 rounded-lg border ${isMatch ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-2xl ${isMatch ? 'text-green-400' : 'text-red-400'}`}>
              {isMatch ? '✓' : '✗'}
            </span>
            <span className="font-medium">
              {isMatch ? t('hashCompare.match') : t('hashCompare.noMatch')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
