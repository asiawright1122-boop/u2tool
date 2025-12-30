'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextStatistics() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = (text.match(/[.!?。！？]+/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : '0';
    const readTime = Math.ceil(words / 200);
    const speakTime = Math.ceil(words / 150);
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []).size;
    const digits = (text.match(/\d/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, avgWordLen, readTime, speakTime, uniqueWords, digits, spaces };
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('textStats.placeholder')} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t('textStats.chars'), value: stats.chars },
          { label: t('textStats.charsNoSpace'), value: stats.charsNoSpace },
          { label: t('textStats.words'), value: stats.words },
          { label: t('textStats.uniqueWords'), value: stats.uniqueWords },
          { label: t('textStats.sentences'), value: stats.sentences },
          { label: t('textStats.paragraphs'), value: stats.paragraphs },
          { label: t('textStats.lines'), value: stats.lines },
          { label: t('textStats.avgWordLen'), value: stats.avgWordLen },
          { label: t('textStats.digits'), value: stats.digits },
          { label: t('textStats.spaces'), value: stats.spaces },
          { label: t('textStats.readTime'), value: `${stats.readTime} min` },
          { label: t('textStats.speakTime'), value: `${stats.speakTime} min` },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{s.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
