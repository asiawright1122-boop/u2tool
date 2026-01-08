'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-react';

interface Countdown {
  id: string;
  name: string;
  targetDate: string;
}

interface CountdownResult {
  totalDays: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isPast: boolean;
}

export default function CountdownDaysCalculator() {
  const t = useTranslations('tools.countdown-days-calculator');
  const tCommon = useTranslations('tools');

  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [now, setNow] = useState(new Date());

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('countdowns');
    if (saved) {
      try {
        setCountdowns(JSON.parse(saved));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
  }, [countdowns]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const addCountdown = () => {
    if (!newName.trim() || !newDate) return;
    
    const countdown: Countdown = {
      id: Date.now().toString(),
      name: newName.trim(),
      targetDate: newDate,
    };
    
    setCountdowns([...countdowns, countdown]);
    setNewName('');
    setNewDate('');
  };

  const removeCountdown = (id: string) => {
    setCountdowns(countdowns.filter(c => c.id !== id));
  };

  const calculateCountdown = (targetDateStr: string): CountdownResult => {
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    
    const diff = target.getTime() - now.getTime();
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const totalSeconds = Math.floor(absDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const weeks = Math.floor(((totalDays % 365) % 30) / 7);
    const days = ((totalDays % 365) % 30) % 7;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Calculate progress (for events within a year)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearDiff = endOfYear.getTime() - startOfYear.getTime();
    const elapsed = now.getTime() - startOfYear.getTime();
    const progress = Math.min(100, Math.max(0, (elapsed / yearDiff) * 100));

    return {
      totalDays,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      progress,
      isPast,
    };
  };

  // Quick add presets
  const quickAddPresets = [
    { name: t('newYear'), getDate: () => `${new Date().getFullYear() + 1}-01-01` },
    { name: t('christmas'), getDate: () => `${new Date().getFullYear()}-12-25` },
    { name: t('valentines'), getDate: () => `${new Date().getFullYear() + 1}-02-14` },
  ];

  return (
    <div className="space-y-6">
      {/* Add New Countdown */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {t('addCountdown')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('eventName')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={addCountdown}
            disabled={!newName.trim() || !newDate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {t('add')}
          </button>
        </div>

        {/* Quick Add */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">{t('quickAdd')}:</span>
          {quickAddPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                setNewName(preset.name);
                setNewDate(preset.getDate());
              }}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Countdowns List */}
      {countdowns.length > 0 ? (
        <div className="space-y-4">
          {countdowns.map((countdown) => {
            const result = calculateCountdown(countdown.targetDate);
            return (
              <div
                key={countdown.id}
                className={`p-4 rounded-lg border ${
                  result.isPast
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {countdown.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(countdown.targetDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCountdown(countdown.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Counter */}
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    {result.isPast ? '-' : ''}{result.totalDays}
                  </div>
                  <div className="text-gray-500">{t('days')}</div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-center">
                  {result.years > 0 && (
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{result.years}</div>
                      <div className="text-xs text-gray-500">{t('years')}</div>
                    </div>
                  )}
                  {(result.years > 0 || result.months > 0) && (
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{result.months}</div>
                      <div className="text-xs text-gray-500">{t('months')}</div>
                    </div>
                  )}
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{result.weeks}</div>
                    <div className="text-xs text-gray-500">{t('weeks')}</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{result.days}</div>
                    <div className="text-xs text-gray-500">{t('daysShort')}</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{result.hours}</div>
                    <div className="text-xs text-gray-500">{t('hours')}</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{result.minutes}</div>
                    <div className="text-xs text-gray-500">{t('minutes')}</div>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{result.seconds}</div>
                    <div className="text-xs text-gray-500">{t('seconds')}</div>
                  </div>
                </div>

                {/* Status */}
                {result.isPast && (
                  <div className="mt-4 text-center text-gray-500">
                    {t('eventPassed')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('noCountdowns')}</p>
        </div>
      )}
    </div>
  );
}
