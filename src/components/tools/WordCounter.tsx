'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function WordCounter() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      sentences: trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0,
      paragraphs: trimmed ? trimmed.split(/\n\n+/).filter(p => p.trim()).length : 0,
      lines: trimmed ? trimmed.split('\n').length : 0,
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          className="tool-textarea h-64"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label={t('wordCounter.words')} value={stats.words} />
        <StatCard label={t('wordCounter.characters')} value={stats.characters} />
        <StatCard label={t('wordCounter.characters')} value={stats.charactersNoSpaces} />
        <StatCard label={t('wordCounter.sentences')} value={stats.sentences} />
        <StatCard label={t('wordCounter.paragraphs')} value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
      </div>

      <button
        onClick={() => setText('')}
        className="btn-secondary"
      >
        {t('clear')}
      </button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}
