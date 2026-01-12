'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function PalindromeChecker() {
  const t = useTranslations('tools.palindrome-checker');
  const [input, setInput] = useState('');
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);

  const result = useMemo(() => {
    if (!input.trim()) return null;

    let processed = input;
    if (ignoreCase) processed = processed.toLowerCase();
    if (ignoreSpaces) processed = processed.replace(/\s/g, '');
    if (ignorePunctuation) processed = processed.replace(/[^\w\s]|_/g, '');

    const reversed = processed.split('').reverse().join('');
    const isPalindrome = processed === reversed;

    return {
      original: input,
      processed,
      reversed,
      isPalindrome,
      length: processed.length,
    };
  }, [input, ignoreSpaces, ignoreCase, ignorePunctuation]);

  const examples = [
    { text: 'A man a plan a canal Panama', type: 'phrase' },
    { text: 'Was it a car or a cat I saw', type: 'phrase' },
    { text: 'Never odd or even', type: 'phrase' },
    { text: 'racecar', type: 'word' },
    { text: 'level', type: 'word' },
    { text: 'radar', type: 'word' },
    { text: 'madam', type: 'word' },
    { text: '12321', type: 'number' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('ignoreCase')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreSpaces}
            onChange={(e) => setIgnoreSpaces(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('ignoreSpaces')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignorePunctuation}
            onChange={(e) => setIgnorePunctuation(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('ignorePunctuation')}</span>
        </label>
      </div>

      {result && (
        <div className={`p-6 rounded-xl text-center ${
          result.isPalindrome
            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
            : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
        }`}>
          <div className="text-6xl mb-4">
            {result.isPalindrome ? '✅' : '❌'}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${
            result.isPalindrome
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            {result.isPalindrome ? t('isPalindrome') : t('notPalindrome')}
          </h3>
          <p className={`text-sm ${
            result.isPalindrome
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {t('processedText')}: &quot;{result.processed}&quot;
          </p>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('forward')}</h4>
            <p className="font-mono text-lg text-gray-900 dark:text-white break-all">{result.processed}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('backward')}</h4>
            <p className="font-mono text-lg text-gray-900 dark:text-white break-all">{result.reversed}</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3">{t('examples')}</h3>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setInput(example.text)}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-full text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {example.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
