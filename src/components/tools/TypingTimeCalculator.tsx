'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TypingTimeCalculator() {
  const t = useTranslations('tools.typing-time-calculator');
  const tg = useTranslations('tools');
  const [wordCount, setWordCount] = useState(1000);
  const [typingSpeed, setTypingSpeed] = useState(40);

  const results = useMemo(() => {
    const minutes = wordCount / typingSpeed;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    const breaks = Math.floor(minutes / 25); // 每25分钟休息一次
    const totalWithBreaks = minutes + (breaks * 5); // 每次休息5分钟

    return {
      minutes: Math.round(minutes),
      hours,
      remainingMinutes,
      breaks,
      totalWithBreaks: Math.round(totalWithBreaks),
      formatted: hours > 0 
        ? `${hours}h ${remainingMinutes}m`
        : `${Math.round(minutes)}m`,
    };
  }, [wordCount, typingSpeed]);

  const speedLevels = [
    { label: t('beginner'), speed: 20 },
    { label: t('average'), speed: 40 },
    { label: t('professional'), speed: 60 },
    { label: t('expert'), speed: 80 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('wordCount')}
          </label>
          <input
            type="number"
            min={1}
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('typingSpeed')}: {typingSpeed} WPM
          </label>
          <input
            type="range"
            min={10}
            max={120}
            value={typingSpeed}
            onChange={(e) => setTypingSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {speedLevels.map((level) => (
          <button
            key={level.speed}
            onClick={() => setTypingSpeed(level.speed)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              typingSpeed === level.speed
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {level.label} ({level.speed} WPM)
          </button>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('estimatedTime')}</p>
        <p className="text-4xl font-bold text-blue-600">{results.formatted}</p>
        <p className="text-sm text-gray-500 mt-2">
          ({results.minutes} {t('minutesTotal')})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('pureTypingTime')}</p>
          <p className="text-xl font-bold text-blue-600">{results.formatted}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('recommendedBreaks')}</p>
          <p className="text-xl font-bold text-green-600">{results.breaks}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('totalWithBreaks')}</p>
          <p className="text-xl font-bold text-purple-600">{results.totalWithBreaks}m</p>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">{t('ergonomicTips')}</h3>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
