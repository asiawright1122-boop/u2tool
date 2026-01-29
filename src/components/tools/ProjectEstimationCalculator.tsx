'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Task {
  id: string;
  name: string;
  optimistic: number;
  mostLikely: number;
  pessimistic: number;
}

interface EstimationResult {
  expected: number;
  standardDeviation: number;
  variance: number;
  confidence68: { min: number; max: number };
  confidence95: { min: number; max: number };
}

function calculatePERT(optimistic: number, mostLikely: number, pessimistic: number): { expected: number; variance: number } {
  const expected = (optimistic + 4 * mostLikely + pessimistic) / 6;
  const variance = Math.pow((pessimistic - optimistic) / 6, 2);
  return { expected, variance };
}

function calculateProjectEstimation(tasks: Task[]): EstimationResult {
  let totalExpected = 0;
  let totalVariance = 0;
  
  for (const task of tasks) {
    const { expected, variance } = calculatePERT(task.optimistic, task.mostLikely, task.pessimistic);
    totalExpected += expected;
    totalVariance += variance;
  }
  
  const standardDeviation = Math.sqrt(totalVariance);
  
  return {
    expected: Math.round(totalExpected * 10) / 10,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
    variance: Math.round(totalVariance * 10) / 10,
    confidence68: {
      min: Math.round((totalExpected - standardDeviation) * 10) / 10,
      max: Math.round((totalExpected + standardDeviation) * 10) / 10,
    },
    confidence95: {
      min: Math.round((totalExpected - 2 * standardDeviation) * 10) / 10,
      max: Math.round((totalExpected + 2 * standardDeviation) * 10) / 10,
    },
  };
}

export default function ProjectEstimationCalculator() {
  const t = useTranslations('tools.project-estimation-calculator');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: 'Requirements Analysis', optimistic: 2, mostLikely: 3, pessimistic: 5 },
    { id: '2', name: 'Design', optimistic: 3, mostLikely: 5, pessimistic: 8 },
    { id: '3', name: 'Development', optimistic: 10, mostLikely: 15, pessimistic: 25 },
    { id: '4', name: 'Testing', optimistic: 3, mostLikely: 5, pessimistic: 10 },
    { id: '5', name: 'Deployment', optimistic: 1, mostLikely: 2, pessimistic: 4 },
  ]);
  const [unit, setUnit] = useState<'hours' | 'days' | 'weeks'>('days');

  const addTask = useCallback(() => {
    setTasks(prev => [...prev, {
      id: Date.now().toString(),
      name: `${t('taskDefault')} ${prev.length + 1}`,
      optimistic: 1,
      mostLikely: 2,
      pessimistic: 4,
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTask = useCallback((id: string, field: keyof Task, value: string | number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const result = useMemo(() => calculateProjectEstimation(tasks), [tasks]);

  const unitLabels: Record<string, string> = {
    hours: t('hrs'),
    days: t('days'),
    weeks: t('wks')
  };
  const unitLabel = unitLabels[unit];

  const unitNames: Record<string, string> = {
    hours: t('hours'),
    days: t('days'),
    weeks: t('weeks')
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {(['hours', 'days', 'weeks'] as const).map(u => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                unit === u
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {unitNames[u]}
            </button>
          ))}
        </div>
        <button
          onClick={addTask}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {t('addTask')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-3 py-2 text-left">{t('taskName')}</th>
              <th className="px-3 py-2 text-center">{t('optimistic')}</th>
              <th className="px-3 py-2 text-center">{t('mostLikely')}</th>
              <th className="px-3 py-2 text-center">{t('pessimistic')}</th>
              <th className="px-3 py-2 text-center">{t('expected')}</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const { expected } = calculatePERT(task.optimistic, task.mostLikely, task.pessimistic);
              return (
                <tr key={task.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={task.name}
                      onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={task.optimistic}
                      onChange={(e) => updateTask(task.id, 'optimistic', parseFloat(e.target.value) || 0)}
                      min={0}
                      className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={task.mostLikely}
                      onChange={(e) => updateTask(task.id, 'mostLikely', parseFloat(e.target.value) || 0)}
                      min={0}
                      className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={task.pessimistic}
                      onChange={(e) => updateTask(task.id, 'pessimistic', parseFloat(e.target.value) || 0)}
                      min={0}
                      className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2 text-center font-medium text-blue-600 dark:text-blue-400">
                    {Math.round(expected * 10) / 10} {unitLabel}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {result.expected} {unitLabel}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">{t('expectedDuration')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {result.confidence68.min} - {result.confidence68.max} {unitLabel}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">{t('confidence68')}</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {result.confidence95.min} - {result.confidence95.max} {unitLabel}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">{t('confidence95')}</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('pertFormula')}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Expected = (Optimistic + 4 × Most Likely + Pessimistic) / 6
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {t('standardDeviation')}: ±{result.standardDeviation} {unitLabel}
        </p>
      </div>
    </div>
  );
}
