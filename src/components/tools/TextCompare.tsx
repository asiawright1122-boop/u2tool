'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextCompare() {
  const t = useTranslations('tools');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const similarity = useMemo(() => {
    if (!text1 || !text2) return null;
    const longer = text1.length > text2.length ? text1 : text2;
    const shorter = text1.length > text2.length ? text2 : text1;
    if (longer.length === 0) return { charSim: '100', wordSim: '100', distance: 0, common: 0, total: 0 };
    
    // Levenshtein distance
    const costs: number[] = [];
    for (let i = 0; i <= shorter.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= longer.length; j++) {
        if (i === 0) costs[j] = j;
        else if (j > 0) {
          let newValue = costs[j - 1];
          if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[longer.length] = lastValue;
    }
    const distance = costs[longer.length];
    const percent = ((longer.length - distance) / longer.length * 100).toFixed(1);
    
    // Common words
    const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);
    const common = [...words1].filter(w => words2.has(w)).length;
    const total = new Set([...words1, ...words2]).size;
    const wordSim = total > 0 ? (common / total * 100).toFixed(1) : '0';

    return { charSim: percent, wordSim, distance, common, total };
  }, [text1, text2]);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('textCompare.text1')}</label>
          <textarea value={text1} onChange={(e) => setText1(e.target.value)} className="w-full h-40 p-3 bg-gray-800 border border-gray-700 rounded-lg" placeholder={t('textCompare.placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('textCompare.text2')}</label>
          <textarea value={text2} onChange={(e) => setText2(e.target.value)} className="w-full h-40 p-3 bg-gray-800 border border-gray-700 rounded-lg" placeholder={t('textCompare.placeholder')} />
        </div>
      </div>
      {similarity && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{similarity.charSim}%</p>
            <p className="text-sm text-gray-300">{t('textCompare.charSimilarity')}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{similarity.wordSim}%</p>
            <p className="text-sm text-gray-300">{t('textCompare.wordSimilarity')}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{similarity.distance}</p>
            <p className="text-sm text-gray-300">{t('textCompare.editDistance')}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">{similarity.common}/{similarity.total}</p>
            <p className="text-sm text-gray-300">{t('textCompare.commonWords')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
