'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, Activity, Scale, Ruler } from 'lucide-react';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type Unit = 'metric' | 'imperial';

interface CalorieResult {
  bmr: number;
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Hard exercise 6-7 days/week
  very_active: 1.9     // Very hard exercise & physical job
};

export default function CalorieCalculator() {
  const t = useTranslations('tools.calorie-calculator');
  const tCommon = useTranslations('tools');

  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<string>('30');
  const [unit, setUnit] = useState<Unit>('metric');
  const [height, setHeight] = useState<string>('175');
  const [heightFeet, setHeightFeet] = useState<string>('5');
  const [heightInches, setHeightInches] = useState<string>('9');
  const [weight, setWeight] = useState<string>('70');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  const result = useMemo<CalorieResult | null>(() => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    
    if (isNaN(ageNum) || isNaN(weightNum) || ageNum <= 0 || weightNum <= 0) {
      return null;
    }

    let heightCm: number;
    let weightKg: number;

    if (unit === 'metric') {
      heightCm = parseFloat(height);
      weightKg = weightNum;
    } else {
      // Convert imperial to metric
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightCm = (feet * 12 + inches) * 2.54;
      weightKg = weightNum * 0.453592;
    }

    if (isNaN(heightCm) || heightCm <= 0) {
      return null;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const maintenance = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    return {
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      mildLoss: Math.round(maintenance - 250),      // 0.25 kg/week
      weightLoss: Math.round(maintenance - 500),    // 0.5 kg/week
      extremeLoss: Math.round(maintenance - 1000),  // 1 kg/week
      mildGain: Math.round(maintenance + 250),      // 0.25 kg/week
      weightGain: Math.round(maintenance + 500)     // 0.5 kg/week
    };
  }, [gender, age, unit, height, heightFeet, heightInches, weight, activityLevel]);

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
        {/* Gender */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('gender')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                gender === 'male'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('male')}
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                gender === 'female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('female')}
            </button>
          </div>
        </div>

        {/* Age */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('age')}
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="1"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Height */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            {t('height')} ({unit === 'metric' ? 'cm' : 'ft/in'})
          </label>
          {unit === 'metric' ? (
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="50"
              max="300"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                min="1"
                max="8"
                placeholder="ft"
                className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                min="0"
                max="11"
                placeholder="in"
                className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Scale className="w-4 h-4" />
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

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* BMR */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{t('bmr')}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {result.bmr.toLocaleString()} <span className="text-lg font-normal">{t('caloriesPerDay')}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('bmrDescription')}</p>
          </div>

          {/* Maintenance */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-medium text-blue-700 dark:text-blue-300 mb-2">{t('maintenance')}</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {result.maintenance.toLocaleString()} <span className="text-lg font-normal">{t('caloriesPerDay')}</span>
            </div>
          </div>

          {/* Weight Loss Options */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-medium text-green-700 dark:text-green-300 mb-3">{t('weightLoss')}</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{t('mildLoss')}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{result.mildLoss.toLocaleString()} cal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{t('moderateLoss')}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{result.weightLoss.toLocaleString()} cal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{t('extremeLoss')}</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{result.extremeLoss.toLocaleString()} cal</span>
              </div>
            </div>
          </div>

          {/* Weight Gain Options */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="font-medium text-orange-700 dark:text-orange-300 mb-3">{t('weightGain')}</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{t('mildGain')}</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{result.mildGain.toLocaleString()} cal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{t('moderateGain')}</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{result.weightGain.toLocaleString()} cal</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
