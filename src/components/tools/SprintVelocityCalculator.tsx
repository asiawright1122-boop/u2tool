'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Sprint {
  id: string;
  name: string;
  committed: number;
  completed: number;
}

interface VelocityStats {
  average: number;
  median: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
  completionRate: number;
  predictedNext: number;
}

function calculateStats(sprints: Sprint[]): VelocityStats {
  if (sprints.length === 0) {
    return { average: 0, median: 0, min: 0, max: 0, trend: 'stable', completionRate: 0, predictedNext: 0 };
  }
  
  const completed = sprints.map(s => s.completed);
  const sorted = [...completed].sort((a, b) => a - b);
  
  const average = completed.reduce((a, b) => a + b, 0) / completed.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  
  const totalCommitted = sprints.reduce((a, s) => a + s.committed, 0);
  const totalCompleted = sprints.reduce((a, s) => a + s.completed, 0);
  const completionRate = totalCommitted > 0 ? (totalCompleted / totalCommitted) * 100 : 0;
  
  // Trend calculation (last 3 sprints)
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (sprints.length >= 3) {
    const recent = sprints.slice(-3).map(s => s.completed);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = sprints.slice(0, -3).length > 0
      ? sprints.slice(0, -3).reduce((a, s) => a + s.completed, 0) / sprints.slice(0, -3).length
      : recentAvg;
    
    if (recentAvg > olderAvg * 1.1) trend = 'up';
    else if (recentAvg < olderAvg * 0.9) trend = 'down';
  }
  
  // Predicted next (weighted average of last 3)
  const weights = [0.5, 0.3, 0.2];
  const recentSprints = sprints.slice(-3).reverse();
  let predictedNext = 0;
  let weightSum = 0;
  recentSprints.forEach((s, i) => {
    predictedNext += s.completed * weights[i];
    weightSum += weights[i];
  });
  predictedNext = weightSum > 0 ? predictedNext / weightSum : average;
  
  return {
    average: Math.round(average * 10) / 10,
    median: Math.round(median * 10) / 10,
    min: Math.min(...completed),
    max: Math.max(...completed),
    trend,
    completionRate: Math.round(completionRate),
    predictedNext: Math.round(predictedNext),
  };
}

export default function SprintVelocityCalculator() {
  const t = useTranslations('tools.sprint-velocity-calculator');
  const [sprints, setSprints] = useState<Sprint[]>([
    { id: '1', name: 'Sprint 1', committed: 30, completed: 25 },
    { id: '2', name: 'Sprint 2', committed: 28, completed: 28 },
    { id: '3', name: 'Sprint 3', committed: 32, completed: 30 },
    { id: '4', name: 'Sprint 4', committed: 30, completed: 32 },
    { id: '5', name: 'Sprint 5', committed: 35, completed: 33 },
  ]);

  const addSprint = useCallback(() => {
    setSprints(prev => [...prev, {
      id: Date.now().toString(),
      name: `${t('sprintDefault')} ${prev.length + 1}`,
      committed: 30,
      completed: 0,
    }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSprint = useCallback((id: string, field: keyof Sprint, value: string | number) => {
    setSprints(prev => prev.map(sprint => 
      sprint.id === id ? { ...sprint, [field]: value } : sprint
    ));
  }, []);

  const removeSprint = useCallback((id: string) => {
    setSprints(prev => prev.filter(sprint => sprint.id !== id));
  }, []);

  const stats = useMemo(() => calculateStats(sprints), [sprints]);

  const maxCompleted = Math.max(...sprints.map(s => Math.max(s.committed, s.completed)), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addSprint}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {t('addSprint')}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.average}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">{t('avgVelocity')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.predictedNext}</div>
          <div className="text-sm text-green-700 dark:text-green-300">{t('predictedNext')}</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.completionRate}%</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">{t('completionRate')}</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {stats.trend === 'up' ? '↑' : stats.trend === 'down' ? '↓' : '→'}
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-300">{t('trend')}</div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{t('velocityChart')}</h3>
        <div className="flex items-end gap-2 h-40">
          {sprints.map(sprint => (
            <div key={sprint.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end h-32">
                <div
                  className="flex-1 bg-blue-200 dark:bg-blue-800 rounded-t"
                  style={{ height: `${(sprint.committed / maxCompleted) * 100}%` }}
                  title={`${t('committed')}: ${sprint.committed}`}
                />
                <div
                  className="flex-1 bg-green-500 dark:bg-green-600 rounded-t"
                  style={{ height: `${(sprint.completed / maxCompleted) * 100}%` }}
                  title={`${t('completed')}: ${sprint.completed}`}
                />
              </div>
              <span className="text-xs text-gray-500 truncate w-full text-center">{sprint.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-200 dark:bg-blue-800 rounded" /> {t('committed')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded" /> {t('completed')}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-3 py-2 text-left">{t('sprint')}</th>
              <th className="px-3 py-2 text-center">{t('committed')}</th>
              <th className="px-3 py-2 text-center">{t('completed')}</th>
              <th className="px-3 py-2 text-center">{t('rate')}</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sprints.map(sprint => {
              const rate = sprint.committed > 0 ? Math.round((sprint.completed / sprint.committed) * 100) : 0;
              return (
                <tr key={sprint.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={sprint.name}
                      onChange={(e) => updateSprint(sprint.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={sprint.committed}
                      onChange={(e) => updateSprint(sprint.id, 'committed', parseInt(e.target.value) || 0)}
                      min={0}
                      className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={sprint.completed}
                      onChange={(e) => updateSprint(sprint.id, 'completed', parseInt(e.target.value) || 0)}
                      min={0}
                      className="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td className={`px-3 py-2 text-center font-medium ${rate >= 100 ? 'text-green-600' : rate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {rate}%
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeSprint(sprint.id)} className="text-red-500 hover:text-red-700">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-gray-500">{t('median')}:</span>
          <span className="ml-2 font-medium text-gray-900 dark:text-white">{stats.median}</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-gray-500">{t('min')}:</span>
          <span className="ml-2 font-medium text-gray-900 dark:text-white">{stats.min}</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-gray-500">{t('max')}:</span>
          <span className="ml-2 font-medium text-gray-900 dark:text-white">{stats.max}</span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <span className="text-gray-500">{t('range')}:</span>
          <span className="ml-2 font-medium text-gray-900 dark:text-white">{stats.max - stats.min}</span>
        </div>
      </div>
    </div>
  );
}
