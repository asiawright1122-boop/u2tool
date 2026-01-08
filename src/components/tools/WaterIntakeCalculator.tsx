'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Droplets, Activity, Sun, Thermometer } from 'lucide-react';

type Unit = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type Climate = 'cold' | 'temperate' | 'hot' | 'very_hot';

interface WaterResult {
  liters: number;
  cups: number;
  ounces: number;
  glasses: number;
}

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.3,
  very_active: 1.4
};

const CLIMATE_FACTORS: Record<Climate, number> = {
  cold: 0.9,
  temperate: 1.0,
  hot: 1.1,
  very_hot: 1.2
};

export default function WaterIntakeCalculator() {
  const t = useTranslations('tools.water-intake-calculator');
  const tCommon = useTranslations('tools');

  const [unit, setUnit] = useState<Unit>('metric');
  const [weight, setWeight] = useState<string>('70');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [climate, setClimate] = useState<Climate>('temperate');
  const [exerciseMinutes, setExerciseMinutes] = useState<string>('30');

  const result = useMemo<WaterResult | null>(() => {
    const weightNum = parseFloat(weight);
    const exerciseNum = parseFloat(exerciseMinutes) || 0;
    
    if (isNaN(weightNum) || weightNum <= 0) {
      return null;
    }

    // Convert to kg if imperial
    const weightKg = unit === 'metric' ? weightNum : weightNum * 0.453592;

    // Base calculation: 30-35ml per kg of body weight
    let baseLiters = (weightKg * 33) / 1000;

    // Apply activity factor
    baseLiters *= ACTIVITY_FACTORS[activityLevel];

    // Apply climate factor
    baseLiters *= CLIMATE_FACTORS[climate];

    // Add extra water for exercise (about 350ml per 30 minutes)
    baseLiters += (exerciseNum / 30) * 0.35;

    // Round to 2 decimal places
    const liters = Math.round(baseLiters * 100) / 100;

    return {
      liters,
      cups: Math.round(liters * 4.227 * 10) / 10,  // 1 liter ≈ 4.227 cups
      ounces: Math.round(liters * 33.814 * 10) / 10, // 1 liter ≈ 33.814 oz
      glasses: Math.round(liters * 4 * 10) / 10  // 1 glass ≈ 250ml
    };
  }, [unit, weight, activityLevel, climate, exerciseMinutes]);

  const getProgressWidth = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'metric'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('metric')}
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'imperial'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('imperial')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weight */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="20"
            max="500"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Exercise Minutes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('exerciseMinutes')}
          </label>
          <input
            type="number"
            value={exerciseMinutes}
            onChange={(e) => setExerciseMinutes(e.target.value)}
            min="0"
            max="480"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Activity Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {t('activityLevel')}
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="sedentary">{t('sedentary')}</option>
            <option value="light">{t('light')}</option>
            <option value="moderate">{t('moderate')}</option>
            <option value="active">{t('active')}</option>
            <option value="very_active">{t('veryActive')}</option>
          </select>
        </div>

        {/* Climate */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            {t('climate')}
          </label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as Climate)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="cold">{t('cold')}</option>
            <option value="temperate">{t('temperate')}</option>
            <option value="hot">{t('hot')}</option>
            <option value="very_hot">{t('veryHot')}</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('recommendedIntake')}</div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {result.liters} L
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>0 L</span>
                <span>4 L</span>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressWidth(result.liters, 4)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Alternative Units */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.glasses}</div>
              <div className="text-sm text-gray-500">{t('glasses')}</div>
              <div className="text-xs text-gray-400">(250ml)</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.cups}</div>
              <div className="text-sm text-gray-500">{t('cups')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.ounces}</div>
              <div className="text-sm text-gray-500">{t('ounces')}</div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-2">
              <Sun className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-700 dark:text-yellow-300">{t('tips')}</div>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• {t('tip1')}</li>
                  <li>• {t('tip2')}</li>
                  <li>• {t('tip3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
