'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function ScreenTimeCalculator() {
  const t = useTranslations('tools.screen-time-calculator');
  const tg = useTranslations('tools');
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [wakeHours, setWakeHours] = useState(16);

  const results = useMemo(() => {
    const daily = hoursPerDay;
    const weekly = daily * 7;
    const monthly = daily * 30;
    const yearly = daily * 365;
    const percentOfWake = ((daily / wakeHours) * 100).toFixed(1);

    return {
      daily,
      weekly,
      monthly,
      yearly,
      percentOfWake,
      weeklyDays: (weekly / 24).toFixed(1),
      monthlyDays: (monthly / 24).toFixed(1),
      yearlyDays: (yearly / 24).toFixed(1),
    };
  }, [hoursPerDay, wakeHours]);

  const getHealthStatus = () => {
    if (hoursPerDay <= 2) return { status: t('excellent'), color: 'text-green-600' };
    if (hoursPerDay <= 4) return { status: t('good'), color: 'text-blue-600' };
    if (hoursPerDay <= 6) return { status: t('moderate'), color: 'text-yellow-600' };
    if (hoursPerDay <= 8) return { status: t('high'), color: 'text-orange-600' };
    return { status: t('excessive'), color: 'text-red-600' };
  };

  const health = getHealthStatus();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('hoursPerDay')}: {hoursPerDay}h
          </label>
          <input
            type="range"
            min={0}
            max={24}
            step={0.5}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('wakeHours')}: {wakeHours}h
          </label>
          <input
            type="range"
            min={12}
            max={20}
            step={0.5}
            value={wakeHours}
            onChange={(e) => setWakeHours(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('healthStatus')}</p>
        <p className={`text-2xl font-bold ${health.color}`}>{health.status}</p>
        <p className="text-sm text-gray-500 mt-2">
          {t('percentOfWake')}: <span className="font-bold">{results.percentOfWake}%</span>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('daily')}</p>
          <p className="text-2xl font-bold text-blue-600">{results.daily}h</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('weekly')}</p>
          <p className="text-2xl font-bold text-blue-600">{results.weekly}h</p>
          <p className="text-xs text-gray-500">({results.weeklyDays} {t('days')})</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('monthly')}</p>
          <p className="text-2xl font-bold text-blue-600">{results.monthly}h</p>
          <p className="text-xs text-gray-500">({results.monthlyDays} {t('days')})</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('yearly')}</p>
          <p className="text-2xl font-bold text-blue-600">{results.yearly}h</p>
          <p className="text-xs text-gray-500">({results.yearlyDays} {t('days')})</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{t('recommendations')}</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
        </ul>
      </div>
    </div>
  );
}
