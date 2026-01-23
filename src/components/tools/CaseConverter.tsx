'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CaseConverter() {
  const t = useTranslations('tools.case');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const conversions = [
    { id: 'upper', label: t('uppercase'), fn: (s: string) => s.toUpperCase() },
    { id: 'lower', label: t('lowercase'), fn: (s: string) => s.toLowerCase() },
    { id: 'title', label: t('titleCase'), fn: (s: string) => s.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) },
    { id: 'sentence', label: t('sentenceCase'), fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
    { id: 'camel', label: t('camelCase'), fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'pascal', label: 'PascalCase', fn: (s: string) => s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'snake', label: t('snakeCase'), fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
    { id: 'kebab', label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
  ];

  const copyResult = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
        />
      </div>

      <button onClick={() => setInput('')} className="btn-secondary">
        {tg('clear')}
      </button>

      {input && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conversions.map(({ id, label, fn }) => {
            const result = fn(input);
            return (
              <div key={id} className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{label}</span>
                  <button
                    onClick={() => copyResult(id, result)}
                    className={`text-xs px-2 py-1 rounded ${copied === id ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
                  >
                    {copied === id ? tg('copied') : tg('copy')}
                  </button>
                </div>
                <div className="text-sm break-all text-gray-900 dark:text-gray-100">{result}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
