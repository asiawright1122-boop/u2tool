'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  hoursPerDay: number;
  daysOff: number;
  meetings: number;
  adminTime: number;
}

interface SprintConfig {
  durationDays: number;
  holidays: number;
  focusFactor: number;
}

function calculateCapacity(member: TeamMember, config: SprintConfig): number {
  const workingDays = config.durationDays - config.holidays - member.daysOff;
  const grossHours = workingDays * member.hoursPerDay;
  const netHours = grossHours - member.meetings - member.adminTime;
  return Math.max(0, Math.round(netHours * config.focusFactor));
}

export default function TeamCapacityPlanner() {
  const t = useTranslations('tools.team-capacity-planner');
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Alice', role: 'Senior Dev', hoursPerDay: 8, daysOff: 1, meetings: 8, adminTime: 4 },
    { id: '2', name: 'Bob', role: 'Developer', hoursPerDay: 8, daysOff: 0, meetings: 6, adminTime: 2 },
    { id: '3', name: 'Carol', role: 'Designer', hoursPerDay: 8, daysOff: 2, meetings: 10, adminTime: 4 },
    { id: '4', name: 'David', role: 'QA', hoursPerDay: 8, daysOff: 0, meetings: 4, adminTime: 2 },
  ]);

  const [config, setConfig] = useState<SprintConfig>({
    durationDays: 10,
    holidays: 0,
    focusFactor: 0.8,
  });

  const addMember = useCallback(() => {
    setTeam(prev => [...prev, {
      id: Date.now().toString(),
      name: `Member ${prev.length + 1}`,
      role: 'Developer',
      hoursPerDay: 8,
      daysOff: 0,
      meetings: 6,
      adminTime: 2,
    }]);
  }, []);

  const updateMember = useCallback((id: string, field: keyof TeamMember, value: string | number) => {
    setTeam(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }, []);

  const removeMember = useCallback((id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateConfig = useCallback(<K extends keyof SprintConfig>(key: K, value: SprintConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const capacities = useMemo(() => {
    return team.map(member => ({
      ...member,
      capacity: calculateCapacity(member, config),
    }));
  }, [team, config]);

  const summary = useMemo(() => {
    const totalCapacity = capacities.reduce((sum, m) => sum + m.capacity, 0);
    const avgCapacity = team.length > 0 ? Math.round(totalCapacity / team.length) : 0;
    const totalGross = team.reduce((sum, m) => sum + (config.durationDays - config.holidays - m.daysOff) * m.hoursPerDay, 0);
    const utilizationRate = totalGross > 0 ? Math.round((totalCapacity / totalGross) * 100) : 0;
    
    const byRole: Record<string, number> = {};
    capacities.forEach(m => {
      byRole[m.role] = (byRole[m.role] || 0) + m.capacity;
    });
    
    return { totalCapacity, avgCapacity, utilizationRate, byRole };
  }, [capacities, team, config]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('sprintDuration')}</label>
          <input
            type="number"
            value={config.durationDays}
            onChange={(e) => updateConfig('durationDays', parseInt(e.target.value) || 10)}
            min={1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('holidays')}</label>
          <input
            type="number"
            value={config.holidays}
            onChange={(e) => updateConfig('holidays', parseInt(e.target.value) || 0)}
            min={0}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('focusFactor')}</label>
          <select
            value={config.focusFactor}
            onChange={(e) => updateConfig('focusFactor', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={0.6}>60% ({t('newTeam')})</option>
            <option value={0.7}>70% ({t('forming')})</option>
            <option value={0.8}>80% ({t('established')})</option>
            <option value={0.9}>90% ({t('highPerforming')})</option>
          </select>
        </div>
        <div className="flex items-end">
          <button onClick={addMember} className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            {t('addMember')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.totalCapacity}h</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">{t('totalCapacity')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{summary.avgCapacity}h</div>
          <div className="text-sm text-green-700 dark:text-green-300">{t('avgPerPerson')}</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{summary.utilizationRate}%</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">{t('utilization')}</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{team.length}</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">{t('teamSize')}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-3 py-2 text-left">{t('name')}</th>
              <th className="px-3 py-2 text-left">{t('role')}</th>
              <th className="px-3 py-2 text-center">{t('hoursPerDay')}</th>
              <th className="px-3 py-2 text-center">{t('daysOff')}</th>
              <th className="px-3 py-2 text-center">{t('meetings')}</th>
              <th className="px-3 py-2 text-center">{t('admin')}</th>
              <th className="px-3 py-2 text-center">{t('capacity')}</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {capacities.map(member => (
              <tr key={member.id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                    className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={member.hoursPerDay}
                    onChange={(e) => updateMember(member.id, 'hoursPerDay', parseInt(e.target.value) || 8)}
                    min={1}
                    max={12}
                    className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={member.daysOff}
                    onChange={(e) => updateMember(member.id, 'daysOff', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={member.meetings}
                    onChange={(e) => updateMember(member.id, 'meetings', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={member.adminTime}
                    onChange={(e) => updateMember(member.id, 'adminTime', parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{member.capacity}h</span>
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => removeMember(member.id)} className="text-red-500 hover:text-red-700">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('capacityByRole')}</h3>
          <div className="space-y-2">
            {Object.entries(summary.byRole).map(([role, hours]) => (
              <div key={role} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{role}</span>
                <span className="font-medium text-gray-900 dark:text-white">{hours}h</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('capacityFormula')}</h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>Working Days = Sprint Days - {t('holidays')} - {t('daysOff')}</p>
            <p>Gross Hours = Working Days × {t('hoursPerDay')}</p>
            <p>Net Hours = Gross Hours - {t('meetings')} - {t('admin')}</p>
            <p>{t('capacity')} = Net Hours × {t('focusFactor')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
