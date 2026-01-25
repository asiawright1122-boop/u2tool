'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { calculateReadability, type ReadabilityResult } from '@/lib/readability';

export default function ReadabilityChecker() {
  const t = useTranslations('tools.readability-checker');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');

  const result: ReadabilityResult | null = useMemo(() => {
    if (!input.trim()) return null;
    return calculateReadability(input);
  }, [input]);

  const getGradeColor = (grade: number): string => {
    if (grade <= 6) return 'text-green-600';
    if (grade <= 10) return 'text-yellow-600';
    if (grade <= 14) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 60) return 'text-green-600';
    if (score >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder={t('inputPlaceholder')}
        />
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('fleschKincaid')}</h3>
            <p className={`text-2xl font-bold ${getGradeColor(result.metrics.fleschKincaidGrade)}`}>
              {result.metrics.fleschKincaidGrade.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{t('gradeLevel')}</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('fleschReading')}</h3>
            <p className={`text-2xl font-bold ${getScoreColor(result.metrics.fleschReadingEase)}`}>
              {result.metrics.fleschReadingEase.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{t('easeScore')}</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('gunningFog')}</h3>
            <p className={`text-2xl font-bold ${getGradeColor(result.metrics.gunningFogIndex)}`}>
              {result.metrics.gunningFogIndex.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{t('gradeLevel')}</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('smog')}</h3>
            <p className={`text-2xl font-bold ${getGradeColor(result.metrics.smogIndex)}`}>
              {result.metrics.smogIndex.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{t('gradeLevel')}</p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('readingTime')}</h3>
            <p className="text-2xl font-bold text-blue-600">
              {result.readingTime} {t('minutes')}
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('statistics')}</h3>
            <div className="text-sm space-y-1">
              <p>{t('words')}: {result.metrics.wordCount}</p>
              <p>{t('sentences')}: {result.metrics.sentenceCount}</p>
              <p>{t('characters')}: {result.metrics.characterCount}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{t('interpretation')}</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {result.gradeLevel}
          </p>
          {result.suggestions.length > 0 && (
            <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 list-disc list-inside">
              {result.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
