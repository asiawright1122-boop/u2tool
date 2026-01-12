'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function SpeechTimer() {
  const t = useTranslations('tools.speech-timer');
  const [targetMinutes, setTargetMinutes] = useState(5);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState(150);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const targetSeconds = targetMinutes * 60;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);
  const remainingSeconds = Math.max(targetSeconds - elapsedSeconds, 0);
  const estimatedWords = Math.round((elapsedSeconds / 60) * wordsPerMinute);

  const getProgressColor = () => {
    if (progress < 80) return 'bg-green-500';
    if (progress < 100) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('targetDuration')} ({t('minutes')})
          </label>
          <input
            type="number"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="120"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('wordsPerMinute')}
          </label>
          <input
            type="number"
            value={wordsPerMinute}
            onChange={(e) => setWordsPerMinute(Math.max(50, parseInt(e.target.value) || 150))}
            min="50"
            max="300"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-4">
          {formatTime(elapsedSeconds)}
        </div>
        <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {t('remaining')}: {formatTime(remainingSeconds)}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('estimatedWords')}: ~{estimatedWords} {t('words')}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? t('pause') : t('start')}
        </button>
        <button
          onClick={reset}
          className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          {t('reset')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[3, 5, 10].map((mins) => (
          <button
            key={mins}
            onClick={() => { setTargetMinutes(mins); reset(); }}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="text-lg font-medium text-gray-900 dark:text-white">{mins} {t('min')}</div>
            <div className="text-sm text-gray-500">~{mins * wordsPerMinute} {t('words')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
