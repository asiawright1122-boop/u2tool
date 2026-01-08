'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface KeywordResult {
  word: string;
  count: number;
  density: number;
}

export default function KeywordDensityChecker() {
  const t = useTranslations('tools.keyword-density-checker');
  const tc = useTranslations('tools');
  
  const [text, setText] = useState('');
  const [minLength, setMinLength] = useState('3');
  const [excludeCommon, setExcludeCommon] = useState(true);

  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who',
    'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
  ]);

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const words = text.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
    const totalWords = words.length;
    const minLen = parseInt(minLength) || 3;

    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      if (word.length >= minLen && (!excludeCommon || !commonWords.has(word))) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    const results: KeywordResult[] = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);

    // Phrase analysis (2-3 word phrases)
    const phrases2: Record<string, number> = {};
    const phrases3: Record<string, number> = {};
    
    for (let i = 0; i < words.length - 1; i++) {
      const phrase2 = `${words[i]} ${words[i + 1]}`;
      phrases2[phrase2] = (phrases2[phrase2] || 0) + 1;
      
      if (i < words.length - 2) {
        const phrase3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        phrases3[phrase3] = (phrases3[phrase3] || 0) + 1;
      }
    }

    const topPhrases2 = Object.entries(phrases2)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topPhrases3 = Object.entries(phrases3)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { totalWords, results, topPhrases2, topPhrases3 };
  }, [text, minLength, excludeCommon]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('enterText')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={tc('inputPlaceholder')}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">{t('minLength')}:</label>
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(e.target.value)}
            min="1"
            max="10"
            className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeCommon}
            onChange={(e) => setExcludeCommon(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{t('excludeCommon')}</span>
        </label>
      </div>

      {/* Stats */}
      {analysis && (
        <>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.totalWords}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalWords')}</div>
            </div>
          </div>

          {/* Single Keywords */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('topKeywords')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="px-3 py-2 text-left">{t('keyword')}</th>
                    <th className="px-3 py-2 text-right">{t('count')}</th>
                    <th className="px-3 py-2 text-right">{t('density')}</th>
                    <th className="px-3 py-2">{t('visual')}</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.results.slice(0, 20).map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{item.word}</td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{item.count}</td>
                      <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">{item.density.toFixed(2)}%</td>
                      <td className="px-3 py-2 w-32">
                        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(item.density * 10, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2-Word Phrases */}
          {analysis.topPhrases2.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('twoWordPhrases')}</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topPhrases2.map(([phrase, count], idx) => (
                  <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                    {phrase} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3-Word Phrases */}
          {analysis.topPhrases3.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('threeWordPhrases')}</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.topPhrases3.map(([phrase, count], idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                    {phrase} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
