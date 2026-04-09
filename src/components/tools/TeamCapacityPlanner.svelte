<script lang="ts">
  import { calculateCapacity } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['team-capacity-planner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.team-capacity-planner.${key}`;
  }

  // Types
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

  let team = $state([
    { id: '1', name: 'Alice', role: 'Senior Dev', hoursPerDay: 8, daysOff: 1, meetings: 8, adminTime: 4 },
    { id: '2', name: 'Bob', role: 'Developer', hoursPerDay: 8, daysOff: 0, meetings: 6, adminTime: 2 },
    { id: '3', name: 'Carol', role: 'Designer', hoursPerDay: 8, daysOff: 2, meetings: 10, adminTime: 4 },
    { id: '4', name: 'David', role: 'QA', hoursPerDay: 8, daysOff: 0, meetings: 4, adminTime: 2 },
  ]);

  let config = $state({
    durationDays: 10,
    holidays: 0,
    focusFactor: 0.8,
  });

  function addMember() {
    team = [...team, {
      id: Date.now().toString(),
      name: `Member ${team.length + 1}`,
      role: 'Developer',
      hoursPerDay: 8,
      daysOff: 0,
      meetings: 6,
      adminTime: 2,
    }];
  }

  function updateMember(id: string, field: keyof TeamMember, value: string | number) {
    team = team.map(m => m.id === id ? { ...m, [field]: value } : m);
  }

  function removeMember(id: string) {
    team = team.filter(m => m.id !== id);
  }

  function updateConfig(key: keyof SprintConfig, value: SprintConfig[keyof SprintConfig]) {
    config = ({ ...config, [key]: value });
  }

  let capacities = $derived.by(() => {
    return team.map(member => ({
      ...member,
      capacity: calculateCapacity(member, config),
    }));
  });

  let summary = $derived.by(() => {
    const totalCapacity = capacities.reduce((sum, m) => sum + m.capacity, 0);
    const avgCapacity = team.length > 0 ? Math.round(totalCapacity / team.length) : 0;
    const totalGross = team.reduce((sum, m) => sum + (config.durationDays - config.holidays - m.daysOff) * m.hoursPerDay, 0);
    const utilizationRate = totalGross > 0 ? Math.round((totalCapacity / totalGross) * 100) : 0;
    
    const byRole: Record<string, number> = {};
    capacities.forEach(m => {
      byRole[m.role] = (byRole[m.role] || 0) + m.capacity;
    });
    
    return { totalCapacity, avgCapacity, utilizationRate, byRole };
  });

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('sprintDuration')}</label>
          <input
            type="number"
            value={config.durationDays}
            onchange={(e) => updateConfig('durationDays', parseInt(e.target.value) || 10)}
            min={1}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('holidays')}</label>
          <input
            type="number"
            value={config.holidays}
            onchange={(e) => updateConfig('holidays', parseInt(e.target.value) || 0)}
            min={0}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('focusFactor')}</label>
          <select
            value={config.focusFactor}
            onchange={(e) => updateConfig('focusFactor', parseFloat(e.target.value))}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={0.6}>60% ({t('newTeam')})</option>
            <option value={0.7}>70% ({t('forming')})</option>
            <option value={0.8}>80% ({t('established')})</option>
            <option value={0.9}>90% ({t('highPerforming')})</option>
          </select>
        </div>
        <div class="flex items-end">
          <button onclick={addMember} class="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            {t('addMember')}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.totalCapacity}h</div>
          <div class="text-sm text-blue-700 dark:text-blue-300">{t('totalCapacity')}</div>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-green-600 dark:text-green-400">{summary.avgCapacity}h</div>
          <div class="text-sm text-green-700 dark:text-green-300">{t('avgPerPerson')}</div>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{summary.utilizationRate}%</div>
          <div class="text-sm text-purple-700 dark:text-purple-300">{t('utilization')}</div>
        </div>
        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{team.length}</div>
          <div class="text-sm text-orange-700 dark:text-orange-300">{t('teamSize')}</div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-800">
              <th class="px-3 py-2 text-left">{t('name')}</th>
              <th class="px-3 py-2 text-left">{t('role')}</th>
              <th class="px-3 py-2 text-center">{t('hoursPerDay')}</th>
              <th class="px-3 py-2 text-center">{t('daysOff')}</th>
              <th class="px-3 py-2 text-center">{t('meetings')}</th>
              <th class="px-3 py-2 text-center">{t('admin')}</th>
              <th class="px-3 py-2 text-center">{t('capacity')}</th>
              <th class="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {#each capacities as member (member.id)}
<tr  class="border-b border-gray-200 dark:border-gray-700">
                <td class="px-3 py-2">
                  <input
                    type="text"
                    value={member.name}
                    onchange={(e) => updateMember(member.id, 'name', e.target.value)}
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    type="text"
                    value={member.role}
                    onchange={(e) => updateMember(member.id, 'role', e.target.value)}
                    class="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    type="number"
                    value={member.hoursPerDay}
                    onchange={(e) => updateMember(member.id, 'hoursPerDay', parseInt(e.target.value) || 8)}
                    min={1}
                    max={12}
                    class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    type="number"
                    value={member.daysOff}
                    onchange={(e) => updateMember(member.id, 'daysOff', parseInt(e.target.value) || 0)}
                    min={0}
                    class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    type="number"
                    value={member.meetings}
                    onchange={(e) => updateMember(member.id, 'meetings', parseInt(e.target.value) || 0)}
                    min={0}
                    class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="px-3 py-2">
                  <input
                    type="number"
                    value={member.adminTime}
                    onchange={(e) => updateMember(member.id, 'adminTime', parseInt(e.target.value) || 0)}
                    min={0}
                    class="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="px-3 py-2 text-center">
                  <span class="font-bold text-blue-600 dark:text-blue-400">{member.capacity}h</span>
                </td>
                <td class="px-3 py-2">
                  <button onclick={() => removeMember(member.id)} class="text-red-500 hover:text-red-700">✕</button>
                </td>
              </tr>
{/each}
          </tbody>
        </table>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('capacityByRole')}</h3>
          <div class="space-y-2">
            {#each Object.entries(summary.byRole) as [role, hours] (role)}
<div  class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{role}</span>
                <span class="font-medium text-gray-900 dark:text-white">{hours}h</span>
              </div>
{/each}
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('capacityFormula')}</h3>
          <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>Working Days = Sprint Days - {t('holidays')} - {t('daysOff')}</p>
            <p>Gross Hours = Working Days × {t('hoursPerDay')}</p>
            <p>Net Hours = Gross Hours - {t('meetings')} - {t('admin')}</p>
            <p>{t('capacity')} = Net Hours × {t('focusFactor')}</p>
          </div>
        </div>
      </div>
    </div>
  
