'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface Lap {
  id: number;
  time: number;
  diff: number;
}

export default function Stopwatch() {
  const t = useTranslations('tools');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setTime(accumulatedTimeRef.current + (Date.now() - startTimeRef.current));
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        accumulatedTimeRef.current = time;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
  };

  const handleLap = () => {
    if (!isRunning) return;
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const newLap: Lap = {
      id: laps.length + 1,
      time: time,
      diff: time - lastLapTime,
    };
    setLaps([newLap, ...laps]);
  };

  const getBestWorstLap = () => {
    if (laps.length < 2) return { best: -1, worst: -1 };
    const diffs = laps.map(l => l.diff);
    return {
      best: Math.min(...diffs),
      worst: Math.max(...diffs),
    };
  };

  const { best, worst } = getBestWorstLap();

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {t('stopwatchUI.lap')}
        </button>
        <button
          onClick={handleStartStop}
          className={`px-8 py-3 rounded-full font-medium min-w-[120px] ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? t('stopwatchUI.stop') : t('stopwatchUI.start')}
        </button>
        <button
          onClick={handleReset}
          disabled={time === 0}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {t('stopwatchUI.reset')}
        </button>
      </div>

      {laps.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t('stopwatchUI.laps')} ({laps.length})
          </h3>
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">{t('stopwatchUI.lapNumber')}</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">{t('stopwatchUI.lapTime')}</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">{t('stopwatchUI.totalTime')}</th>
                </tr>
              </thead>
              <tbody>
                {laps.map((lap) => (
                  <tr
                    key={lap.id}
                    className={`border-b border-gray-200 dark:border-gray-700 ${
                      lap.diff === best ? 'bg-green-50 dark:bg-green-900/20' :
                      lap.diff === worst ? 'bg-red-50 dark:bg-red-900/20' : ''
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {t('stopwatchUI.lapLabel')} {lap.id}
                      {lap.diff === best && laps.length > 1 && <span className="ml-2 text-green-600">🏆</span>}
                      {lap.diff === worst && laps.length > 1 && <span className="ml-2 text-red-600">🐢</span>}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-gray-800 dark:text-gray-200">
                      {formatTime(lap.diff)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-gray-600 dark:text-gray-400">
                      {formatTime(lap.time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
