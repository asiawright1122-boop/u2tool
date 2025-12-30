'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ListRandomizer() {
  const t = useTranslations('tools.list-randomizer');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const randomize = () => {
    if (!input.trim()) return;
    
    const lines = input.split('\n').filter(line => line.trim() !== '');
    
    // Fisher-Yates shuffle
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    
    setOutput(lines.join('\n'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="tool-label mb-0">{t('originalList')}</label>
            <button
              onClick={() => setInput('')}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
            >
              {t('clear')}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="tool-textarea"
            placeholder={t('placeholder')}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="tool-label mb-0">{t('randomizedList')}</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              {t('copyResult')}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={12}
            className="tool-textarea text-green-600 dark:text-green-400"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={randomize}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('shuffleList')}
        </button>
      </div>
    </div>
  );
}
