'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { RefreshCw, Copy, Check, User, Users } from 'lucide-react';
import { generateNames, getAvailableOrigins, type Gender, type Origin } from '@/lib/data/names';

export default function NameGenerator() {
  const t = useTranslations('tools.name-generator');
  const tCommon = useTranslations('tools');

  const [gender, setGender] = useState<Gender>('any');
  const [origin, setOrigin] = useState<Origin>('any');
  const [count, setCount] = useState<number>(5);
  const [names, setNames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generate = useCallback(() => {
    const newNames = generateNames(count, gender, origin);
    setNames(newNames);
  }, [count, gender, origin]);

  const copyName = (name: string, index: number) => {
    navigator.clipboard.writeText(name);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(names.join('\n'));
    setCopiedAll(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedAll(false), 2000);
  };

  const origins = getAvailableOrigins();

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('gender')}
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="any">{t('anyGender')}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
            <option value="neutral">{t('neutral')}</option>
          </select>
        </div>

        {/* Origin */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('origin')}
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value as Origin)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {origins.map((o) => (
              <option key={o} value={o}>
                {t(`origins.${o}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Count */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('count')}
          </label>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {[1, 5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex gap-3">
        <button
          onClick={generate}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          {t('generate')}
        </button>

        {names.length > 0 && (
          <button
            onClick={copyAll}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {copiedAll ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copiedAll ? tCommon('copied') : t('copyAll')}
          </button>
        )}
      </div>

      {/* Results */}
      {names.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('generatedNames')} ({names.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {names.map((name, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{name}</span>
                </div>
                <button
                  onClick={() => copyName(name, index)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {names.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('clickToGenerate')}</p>
        </div>
      )}
    </div>
  );
}
