'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextReverser() {
  const t = useTranslations('tools.textReverser');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chars' | 'words' | 'lines'>('chars');

  const getReversed = () => {
    if (!input) return '';
    
    switch (mode) {
      case 'chars':
        return input.split('').reverse().join('');
      case 'words':
        return input.split(/\s+/).reverse().join(' ');
      case 'lines':
        return input.split('\n').reverse().join('\n');
      default:
        return input;
    }
  };

  const reversed = getReversed();

  const copyResult = () => {
    navigator.clipboard.writeText(reversed);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setMode('chars')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'chars' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {t('reverseChars')}
        </button>
        <button
          onClick={() => setMode('words')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'words' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {t('reverseWords')}
        </button>
        <button
          onClick={() => setMode('lines')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            mode === 'lines' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {t('reverseLines')}
        </button>
        <button
          onClick={copyResult}
          disabled={!reversed}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {tg('copy')}
        </button>
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
            value={reversed}
            readOnly
            className="w-full h-64 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
