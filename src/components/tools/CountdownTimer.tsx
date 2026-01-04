'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Preset {
  name: string;
  seconds: number;
}

const PRESETS: Preset[] = [
  { name: '1 min', seconds: 60 },
  { name: '5 min', seconds: 300 },
  { name: '10 min', seconds: 600 },
  { name: '15 min', seconds: 900 },
  { name: '30 min', seconds: 1800 },
  { name: '1 hour', seconds: 3600 },
];

export default function CountdownTimer() {
  const t = useTranslations('tools');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    }
  }, []);

  const playAlarm = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          new Notification(t('countdownTimer.timeUp'), { body: t('countdownTimer.timerFinished') });
        }
      });
    }
  }, [t]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, playAlarm]);

  const formatDisplay = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning && timeLeft === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total > 0) {
        setTimeLeft(total);
        setIsFinished(false);
        setIsRunning(true);
      }
    } else if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const handlePreset = (preset: Preset) => {
    const h = Math.floor(preset.seconds / 3600);
    const m = Math.floor((preset.seconds % 3600) / 60);
    const s = preset.seconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setTimeLeft(preset.seconds);
    setIsFinished(false);
  };

  const progress = timeLeft > 0 ? (timeLeft / (hours * 3600 + minutes * 60 + seconds)) * 100 : 0;

  return (
    <div className="space-y-6">
      {!isRunning && timeLeft === 0 && !isFinished && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {preset.name}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('countdownTimer.hours')}</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <span className="text-4xl font-bold self-end pb-2">:</span>
            <div className="text-center">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('countdownTimer.minutes')}</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <span className="text-4xl font-bold self-end pb-2">:</span>
            <div className="text-center">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('countdownTimer.seconds')}</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-20 px-3 py-2 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      )}

      {(isRunning || timeLeft > 0 || isFinished) && (
        <div className="text-center py-8">
          <div className="relative inline-block">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200 dark:text-gray-700" />
              <circle
                cx="128" cy="128" r="120"
                stroke="currentColor" strokeWidth="8" fill="none"
                className={isFinished ? 'text-red-500' : 'text-blue-500'}
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-5xl font-mono font-bold ${isFinished ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                {formatDisplay(timeLeft)}
              </span>
            </div>
          </div>
          {isFinished && (
            <div className="mt-4 text-2xl font-bold text-red-500 animate-bounce">
              🔔 {t('countdownTimer.timeUp')}!
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={hours === 0 && minutes === 0 && seconds === 0 && timeLeft === 0}
            className="px-8 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {timeLeft > 0 ? t('countdownTimer.resume') : t('countdownTimer.start')}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-8 py-3 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 min-w-[120px]"
          >
            {t('countdownTimer.pause')}
          </button>
        )}
        <button
          onClick={handleReset}
          disabled={timeLeft === 0 && !isFinished}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {t('countdownTimer.reset')}
        </button>
      </div>
    </div>
  );
}
