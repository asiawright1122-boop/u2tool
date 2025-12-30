'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextCaseCounter() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const uppercase = (text.match(/[A-Z]/g) || []).length;
    const lowercase = (text.match(/[a-z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = text.length - uppercase - lowercase - digits - spaces;
    const letters = uppercase + lowercase;

    return {
      total: text.length,
      uppercase,
      lowercase,
      digits,
      spaces,
      special,
      letters,
      uppercasePercent: letters > 0 ? ((uppercase / letters) * 100).toFixed(1) : '0',
      lowercasePercent: letters > 0 ? ((lowercase / letters) * 100).toFixed(1) : '0',
    };
  }, [text]);

  const StatCard = ({ label, value, percent }: { label: string; value: number; percent?: string }) => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      {percent && <div className="text-xs text-blue-400 mt-1">{percent}%</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('caseCounter.placeholder')}
          className="w-full h-40 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('caseCounter.total')} value={stats.total} />
        <StatCard label={t('caseCounter.letters')} value={stats.letters} />
        <StatCard label={t('caseCounter.uppercase')} value={stats.uppercase} percent={stats.uppercasePercent} />
        <StatCard label={t('caseCounter.lowercase')} value={stats.lowercase} percent={stats.lowercasePercent} />
        <StatCard label={t('caseCounter.digits')} value={stats.digits} />
        <StatCard label={t('caseCounter.spaces')} value={stats.spaces} />
        <StatCard label={t('caseCounter.special')} value={stats.special} />
      </div>

      {stats.letters > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('caseCounter.ratio')}</div>
          <div className="flex h-4 rounded overflow-hidden">
            <div
              className="bg-blue-500"
              style={{ width: `${stats.uppercasePercent}%` }}
              title={`Uppercase: ${stats.uppercasePercent}%`}
            />
            <div
              className="bg-green-500"
              style={{ width: `${stats.lowercasePercent}%` }}
              title={`Lowercase: ${stats.lowercasePercent}%`}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-blue-400">A-Z: {stats.uppercasePercent}%</span>
            <span className="text-green-400">a-z: {stats.lowercasePercent}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
