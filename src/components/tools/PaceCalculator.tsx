'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Timer, Route, Calculator, ArrowLeftRight } from 'lucide-react';

type CalculationMode = 'pace' | 'time' | 'distance';
type Unit = 'km' | 'mi';

interface PaceResult {
  pacePerKm: string;
  pacePerMile: string;
  speedKmh: number;
  speedMph: number;
  finishTime: string;
  splits: { distance: number; time: string }[];
}

const COMMON_DISTANCES = [
  { name: '5K', km: 5 },
  { name: '10K', km: 10 },
  { name: 'Half Marathon', km: 21.0975 },
  { name: 'Marathon', km: 42.195 },
];

export default function PaceCalculator() {
  const t = useTranslations('tools.pace-calculator');
  const tCommon = useTranslations('tools');

  const [mode, setMode] = useState<CalculationMode>('pace');
  const [unit, setUnit] = useState<Unit>('km');
  const [distance, setDistance] = useState<string>('10');
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('50');
  const [seconds, setSeconds] = useState<string>('0');
  const [paceMinutes, setPaceMinutes] = useState<string>('5');
  const [paceSeconds, setPaceSeconds] = useState<string>('0');

  const result = useMemo<PaceResult | null>(() => {
    const distanceNum = parseFloat(distance);
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const secondsNum = parseInt(seconds) || 0;
    const paceMinNum = parseInt(paceMinutes) || 0;
    const paceSecNum = parseInt(paceSeconds) || 0;

    if (distanceNum <= 0) return null;

    let totalSeconds: number;
    let distanceKm: number;

    // Convert distance to km
    distanceKm = unit === 'km' ? distanceNum : distanceNum * 1.60934;

    if (mode === 'pace') {
      // Calculate pace from distance and time
      totalSeconds = hoursNum * 3600 + minutesNum * 60 + secondsNum;
      if (totalSeconds <= 0) return null;
    } else if (mode === 'time') {
      // Calculate time from distance and pace
      const paceSecondsPerUnit = paceMinNum * 60 + paceSecNum;
      if (paceSecondsPerUnit <= 0) return null;
      
      const paceSecondsPerKm = unit === 'km' ? paceSecondsPerUnit : paceSecondsPerUnit / 1.60934;
      totalSeconds = paceSecondsPerKm * distanceKm;
    } else {
      // Calculate distance from time and pace
      totalSeconds = hoursNum * 3600 + minutesNum * 60 + secondsNum;
      const paceSecondsPerUnit = paceMinNum * 60 + paceSecNum;
      if (paceSecondsPerUnit <= 0 || totalSeconds <= 0) return null;
      
      const paceSecondsPerKm = unit === 'km' ? paceSecondsPerUnit : paceSecondsPerUnit / 1.60934;
      distanceKm = totalSeconds / paceSecondsPerKm;
    }

    // Calculate pace per km
    const paceSecondsPerKm = totalSeconds / distanceKm;
    const paceMinPerKm = Math.floor(paceSecondsPerKm / 60);
    const paceSecPerKm = Math.round(paceSecondsPerKm % 60);

    // Calculate pace per mile
    const paceSecondsPerMile = paceSecondsPerKm * 1.60934;
    const paceMinPerMile = Math.floor(paceSecondsPerMile / 60);
    const paceSecPerMile = Math.round(paceSecondsPerMile % 60);

    // Calculate speed
    const speedKmh = (distanceKm / totalSeconds) * 3600;
    const speedMph = speedKmh / 1.60934;

    // Format finish time
    const finishHours = Math.floor(totalSeconds / 3600);
    const finishMinutes = Math.floor((totalSeconds % 3600) / 60);
    const finishSecs = Math.round(totalSeconds % 60);
    const finishTime = finishHours > 0
      ? `${finishHours}:${finishMinutes.toString().padStart(2, '0')}:${finishSecs.toString().padStart(2, '0')}`
      : `${finishMinutes}:${finishSecs.toString().padStart(2, '0')}`;

    // Calculate splits
    const splits: { distance: number; time: string }[] = [];
    const splitDistances = unit === 'km' ? [1, 5, 10, 21.0975, 42.195] : [1, 3.1, 6.2, 13.1, 26.2];
    
    for (const splitDist of splitDistances) {
      const splitDistKm = unit === 'km' ? splitDist : splitDist * 1.60934;
      if (splitDistKm <= distanceKm) {
        const splitSeconds = paceSecondsPerKm * splitDistKm;
        const splitH = Math.floor(splitSeconds / 3600);
        const splitM = Math.floor((splitSeconds % 3600) / 60);
        const splitS = Math.round(splitSeconds % 60);
        const splitTime = splitH > 0
          ? `${splitH}:${splitM.toString().padStart(2, '0')}:${splitS.toString().padStart(2, '0')}`
          : `${splitM}:${splitS.toString().padStart(2, '0')}`;
        splits.push({ distance: splitDist, time: splitTime });
      }
    }

    return {
      pacePerKm: `${paceMinPerKm}:${paceSecPerKm.toString().padStart(2, '0')}`,
      pacePerMile: `${paceMinPerMile}:${paceSecPerMile.toString().padStart(2, '0')}`,
      speedKmh: Math.round(speedKmh * 10) / 10,
      speedMph: Math.round(speedMph * 10) / 10,
      finishTime,
      splits,
    };
  }, [mode, unit, distance, hours, minutes, seconds, paceMinutes, paceSeconds]);

  const setCommonDistance = (km: number) => {
    const dist = unit === 'km' ? km : km / 1.60934;
    setDistance(dist.toFixed(2));
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode('pace')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'pace'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculatePace')}
        </button>
        <button
          onClick={() => setMode('time')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'time'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculateTime')}
        </button>
        <button
          onClick={() => setMode('distance')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'distance'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculateDistance')}
        </button>
      </div>

      {/* Unit Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('km')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'km'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('kilometers')}
        </button>
        <button
          onClick={() => setUnit('mi')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'mi'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('miles')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distance Input */}
        {mode !== 'distance' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Route className="w-4 h-4" />
              {t('distance')} ({unit})
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div className="flex flex-wrap gap-2">
              {COMMON_DISTANCES.map((d) => (
                <button
                  key={d.name}
                  onClick={() => setCommonDistance(d.km)}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Input */}
        {mode !== 'time' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              {t('time')}
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0"
                  placeholder="H"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div className="text-xs text-center text-gray-500 mt-1">{t('hours')}</div>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="0"
                  max="59"
                  placeholder="M"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div className="text-xs text-center text-gray-500 mt-1">{t('minutes')}</div>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  min="0"
                  max="59"
                  placeholder="S"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div className="text-xs text-center text-gray-500 mt-1">{t('seconds')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pace Input */}
        {mode !== 'pace' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {t('pace')} (/{unit})
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(e.target.value)}
                  min="0"
                  placeholder="M"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div className="text-xs text-center text-gray-500 mt-1">{t('minutes')}</div>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(e.target.value)}
                  min="0"
                  max="59"
                  placeholder="S"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div className="text-xs text-center text-gray-500 mt-1">{t('seconds')}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Results */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('pacePerKm')}</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.pacePerKm}</div>
                <div className="text-xs text-gray-500">min/km</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('pacePerMile')}</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.pacePerMile}</div>
                <div className="text-xs text-gray-500">min/mi</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('speed')}</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.speedKmh}</div>
                <div className="text-xs text-gray-500">km/h</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('finishTime')}</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.finishTime}</div>
              </div>
            </div>
          </div>

          {/* Splits */}
          {result.splits.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('splits')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {result.splits.map((split, index) => (
                  <div key={index} className="p-2 bg-white dark:bg-gray-700 rounded text-center">
                    <div className="text-sm text-gray-500">{split.distance} {unit}</div>
                    <div className="font-medium text-gray-900 dark:text-white">{split.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
