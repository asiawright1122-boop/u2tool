'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function DiffChecker() {
  const t = useTranslations('tools');
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<{ type: string; value: string }[]>([]);
  const [showDiff, setShowDiff] = useState(false);

  const computeDiff = () => {
    if (!text1.trim() && !text2.trim()) {
      setDiff([]);
      setShowDiff(false);
      return;
    }
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: { type: string; value: string }[] = [];
    
    const maxLen = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] ?? '';
      const line2 = lines2[i] ?? '';
      
      if (line1 === line2) {
        result.push({ type: 'same', value: line1 });
      } else {
        if (line1) result.push({ type: 'removed', value: line1 });
        if (line2) result.push({ type: 'added', value: line2 });
      }
    }
    
    setDiff(result);
    setShowDiff(true);
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiff([]);
    setShowDiff(false);
  };

  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    same: diff.filter(d => d.type === 'same').length,
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('diffChecker.original')}</label>
          <textarea
            className="tool-textarea"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder={t('diffChecker.originalPlaceholder')}
            rows={10}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('diffChecker.modified')}</label>
          <textarea
            className="tool-textarea"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder={t('diffChecker.modifiedPlaceholder')}
            rows={10}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={computeDiff} className="btn-primary">
          {t('diffChecker.compare')}
        </button>
        <button onClick={clearAll} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {showDiff && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="text-green-600 dark:text-green-400">+ {stats.added} {t('diffChecker.added')}</span>
            <span className="text-red-600 dark:text-red-400">- {stats.removed} {t('diffChecker.removed')}</span>
            <span className="text-gray-600 dark:text-gray-300">{stats.same} {t('diffChecker.unchanged')}</span>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {diff.map((line, i) => (
              <div
                key={i}
                className={`px-2 py-0.5 ${
                  line.type === 'added'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : line.type === 'removed'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="inline-block w-6 text-gray-500 dark:text-gray-300">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                {line.value || ' '}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
