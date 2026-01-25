'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { checkGrammar, type GrammarError } from '@/lib/grammar-rules';

export default function GrammarChecker() {
  const t = useTranslations('tools.grammar-checker');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');

  const errors: GrammarError[] = useMemo(() => {
    if (!input.trim()) return [];
    return checkGrammar(input);
  }, [input]);

  const getHighlightedText = () => {
    if (!input || errors.length === 0) return input;
    
    let result = input;
    // 从后往前替换，避免位置偏移
    const sortedErrors = [...errors].sort((a, b) => b.position.start - a.position.start);
    
    sortedErrors.forEach(error => {
      const before = result.slice(0, error.position.start);
      const match = result.slice(error.position.start, error.position.end);
      const after = result.slice(error.position.end);
      result = `${before}<mark class="bg-red-200 dark:bg-red-800">${match}</mark>${after}`;
    });
    
    return result;
  };

  const applyFix = (error: GrammarError) => {
    if (!error.suggestions || error.suggestions.length === 0) return;
    const newText = input.slice(0, error.position.start) + error.suggestions[0] + input.slice(error.position.end);
    setInput(newText);
  };

  const applyAllFixes = () => {
    let newText = input;
    // 从后往前应用修复
    const sortedErrors = [...errors].sort((a, b) => b.position.start - a.position.start);
    sortedErrors.forEach(error => {
      if (error.suggestions && error.suggestions.length > 0) {
        newText = newText.slice(0, error.position.start) + error.suggestions[0] + newText.slice(error.position.end);
      }
    });
    setInput(newText);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={applyAllFixes} 
          disabled={errors.length === 0}
          className="btn-primary"
        >
          {t('fixAll')} ({errors.length})
        </button>
        <button onClick={() => setInput('')} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('preview')}</label>
          <div 
            className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white overflow-auto"
            dangerouslySetInnerHTML={{ __html: getHighlightedText() || t('noErrors') }}
          />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">{t('foundErrors')} ({errors.length})</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {errors.map((error, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex justify-between items-start">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    &quot;{error.original}&quot;
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{error.message}</p>
                  {error.suggestions && error.suggestions.length > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {t('suggestion')}: {error.suggestions[0]}
                    </p>
                  )}
                </div>
                {error.suggestions && error.suggestions.length > 0 && (
                  <button
                    onClick={() => applyFix(error)}
                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {t('fix')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
