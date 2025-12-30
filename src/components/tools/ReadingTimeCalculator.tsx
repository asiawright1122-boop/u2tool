'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ReadingTimeCalculator() {
  const t = useTranslations('tools.reading-time-calculator');
  const [text, setText] = useState('');
  const [wordsPerMinute, setWordsPerMinute] = useState(200);
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    const speakingTime = Math.ceil(words / 150); // Average speaking rate

    setStats({
      words,
      characters,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    });
  }, [text, wordsPerMinute]);

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return t('lessThanMinute');
    if (minutes === 1) return t('minute');
    if (minutes < 60) return t('minutes', { n: minutes });
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return t('hours', { n: hours });
    return `${t('hour', { n: hours })} ${t('minutes', { n: mins })}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('pasteText')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          placeholder={t('placeholder')}
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-600 dark:text-gray-300">{t('readingSpeed')}</label>
        <input
          type="range"
          min="100"
          max="400"
          value={wordsPerMinute}
          onChange={(e) => setWordsPerMinute(parseInt(e.target.value))}
          className="flex-1 max-w-xs"
        />
        <span className="text-sm font-mono w-24 text-gray-900 dark:text-white">{wordsPerMinute} {t('wpm')}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('words')}</div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.characters}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('characters')}</div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.sentences}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('sentences')}</div>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.paragraphs}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('paragraphs')}</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatTime(stats.readingTime)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('readingTime')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{formatTime(stats.speakingTime)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{t('speakingTime')}</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">{t('reference')}</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">{t('slow')}</span>
            <span className="text-gray-600 dark:text-gray-300 ml-2">100-150 {t('wpm')}</span>
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">{t('average')}</span>
            <span className="text-gray-600 dark:text-gray-300 ml-2">200-250 {t('wpm')}</span>
          </div>
          <div>
            <span className="text-purple-600 dark:text-purple-400">{t('fast')}</span>
            <span className="text-gray-600 dark:text-gray-300 ml-2">300-400 {t('wpm')}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p>{t('tip')}</p>
      </div>
    </div>
  );
}
