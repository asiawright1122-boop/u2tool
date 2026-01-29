'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useMemo } from 'react';

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  description: string;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatusColor(status: Milestone['status'], daysUntil: number): string {
  if (status === 'completed') return 'green';
  if (status === 'delayed' || daysUntil < 0) return 'red';
  if (daysUntil <= 7) return 'orange';
  return 'blue';
}

export default function MilestoneTracker() {
  const t = useTranslations('tools.milestone-tracker');
  const tCommon = useTranslations('tools');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', name: 'Project Kickoff', dueDate: '2024-01-15', status: 'completed', progress: 100, description: 'Initial project setup and team alignment' },
    { id: '2', name: 'Requirements Complete', dueDate: '2024-02-01', status: 'completed', progress: 100, description: 'All requirements documented and approved' },
    { id: '3', name: 'Design Phase', dueDate: '2024-02-28', status: 'in_progress', progress: 75, description: 'UI/UX design and architecture' },
    { id: '4', name: 'Development Sprint 1', dueDate: '2024-03-15', status: 'not_started', progress: 0, description: 'Core features implementation' },
    { id: '5', name: 'Beta Release', dueDate: '2024-04-01', status: 'not_started', progress: 0, description: 'Internal beta testing' },
    { id: '6', name: 'Production Launch', dueDate: '2024-04-30', status: 'not_started', progress: 0, description: 'Public release' },
  ]);

  const addMilestone = useCallback(() => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    setMilestones(prev => [...prev, {
      id: Date.now().toString(),
      name: `Milestone ${prev.length + 1}`,
      dueDate: today.toISOString().split('T')[0],
      status: 'not_started',
      progress: 0,
      description: '',
    }]);
  }, []);

  const updateMilestone = useCallback((id: string, field: keyof Milestone, value: unknown) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }, []);

  const removeMilestone = useCallback((id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  }, []);

  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [milestones]);

  const summary = useMemo(() => {
    const completed = milestones.filter(m => m.status === 'completed').length;
    const inProgress = milestones.filter(m => m.status === 'in_progress').length;
    const delayed = milestones.filter(m => m.status === 'delayed' || (getDaysUntil(m.dueDate) < 0 && m.status !== 'completed')).length;
    const upcoming = milestones.filter(m => {
      const days = getDaysUntil(m.dueDate);
      return days >= 0 && days <= 14 && m.status !== 'completed';
    }).length;
    const overallProgress = milestones.length > 0 
      ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length)
      : 0;
    return { total: milestones.length, completed, inProgress, delayed, upcoming, overallProgress };
  }, [milestones]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{summary.total}</div>
          <div className="text-xs text-gray-500">{t('total')}</div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.completed}</div>
          <div className="text-xs text-green-700 dark:text-green-300">{t('completed')}</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.inProgress}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">{t('inProgress')}</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.delayed}</div>
          <div className="text-xs text-red-700 dark:text-red-300">{t('delayed')}</div>
        </div>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{summary.upcoming}</div>
          <div className="text-xs text-orange-700 dark:text-orange-300">{t('dueSoon')}</div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{summary.overallProgress}%</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">{t('progress')}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('timeline')}</h3>
        <button onClick={addMilestone} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">
          {t('addMilestone')}
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
        
        <div className="space-y-4">
          {sortedMilestones.map((milestone, idx) => {
            const daysUntil = getDaysUntil(milestone.dueDate);
            const color = getStatusColor(milestone.status, daysUntil);
            
            return (
              <div key={milestone.id} className="relative pl-10">
                <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                  color === 'green' ? 'bg-green-500 border-green-500' :
                  color === 'red' ? 'bg-red-500 border-red-500' :
                  color === 'orange' ? 'bg-orange-500 border-orange-500' :
                  'bg-white dark:bg-gray-800 border-blue-500'
                } ${milestone.status === 'completed' ? '' : 'flex items-center justify-center'}`}>
                  {milestone.status === 'completed' && <span className="text-white text-xs">✓</span>}
                  {milestone.status !== 'completed' && <span className="text-xs font-bold text-blue-500">{idx + 1}</span>}
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                  'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex gap-3 mb-2">
                    <input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <select
                      value={milestone.status}
                      onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="not_started">{t('notStarted')}</option>
                      <option value="in_progress">{t('inProgress')}</option>
                      <option value="completed">{t('completed')}</option>
                      <option value="delayed">{t('delayed')}</option>
                    </select>
                    <button onClick={() => removeMilestone(milestone.id)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                  
                  <input
                    type="text"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                    className="w-full px-2 py-1 mb-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16">{t('progress')}:</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={milestone.progress}
                      onChange={(e) => updateMilestone(milestone.id, 'progress', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs font-medium w-10">{milestone.progress}%</span>
                    <span className={`text-xs ${daysUntil < 0 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                      {daysUntil === 0 ? t('today') : daysUntil > 0 ? `${daysUntil}${t('daysLeft')}` : `${Math.abs(daysUntil)}${t('daysOverdue')}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
