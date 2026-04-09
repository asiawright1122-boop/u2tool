<script lang="ts">
  import { getDaysUntil } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['milestone-tracker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.milestone-tracker.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  description: string;
}

  let milestones = $state([
    { id: '1', name: 'Project Kickoff', dueDate: '2024-01-15', status: 'completed', progress: 100, description: 'Initial project setup and team alignment' },
    { id: '2', name: 'Requirements Complete', dueDate: '2024-02-01', status: 'completed', progress: 100, description: 'All requirements documented and approved' },
    { id: '3', name: 'Design Phase', dueDate: '2024-02-28', status: 'in_progress', progress: 75, description: 'UI/UX design and architecture' },
    { id: '4', name: 'Development Sprint 1', dueDate: '2024-03-15', status: 'not_started', progress: 0, description: 'Core features implementation' },
    { id: '5', name: 'Beta Release', dueDate: '2024-04-01', status: 'not_started', progress: 0, description: 'Internal beta testing' },
    { id: '6', name: 'Production Launch', dueDate: '2024-04-30', status: 'not_started', progress: 0, description: 'Public release' },
  ]);

  function addMilestone() {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    milestones = [...milestones, {
      id: Date.now().toString(),
      name: `Milestone ${milestones.length + 1}`,
      dueDate: today.toISOString().split('T')[0],
      status: 'not_started',
      progress: 0,
      description: '',
    }];
  }

  function updateMilestone(id: string, field: keyof Milestone, value: unknown) {
    milestones = milestones.map(m => m.id === id ? { ...m, [field]: value } : m);
  }

  function removeMilestone(id: string) {
    milestones = milestones.filter(m => m.id !== id);
  }

  let sortedMilestones = $derived.by(() => {
    return [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  });

  let summary = $derived.by(() => {
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
  });

</script>


              <div class="relative pl-10">
                <div class={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                  color === 'green' ? 'bg-green-500 border-green-500' :
                  color === 'red' ? 'bg-red-500 border-red-500' :
                  color === 'orange' ? 'bg-orange-500 border-orange-500' :
                  'bg-white dark:bg-gray-800 border-blue-500'
                } ${milestone.status === 'completed' ? '' : 'flex items-center justify-center'}`}>
                  {#if milestone.status === 'completed'}
<span class="text-white text-xs">✓</span>
{/if}
                  {#if milestone.status !== 'completed'}
<span class="text-xs font-bold text-blue-500">{idx + 1}</span>
{/if}
                </div>
                
                <div class={`p-4 rounded-lg border ${
                  color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                  color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                  color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                  'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                }`}>
                  <div class="flex gap-3 mb-2">
                    <input
                      type="text"
                      value={milestone.name}
                      onchange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                      class="flex-1 px-2 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="date"
                      value={milestone.dueDate}
                      onchange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                      class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <select
                      value={milestone.status}
                      onchange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                      class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="not_started">{t('notStarted')}</option>
                      <option value="in_progress">{t('inProgress')}</option>
                      <option value="completed">{t('completed')}</option>
                      <option value="delayed">{t('delayed')}</option>
                    </select>
                    <button onclick={() => removeMilestone(milestone.id)} class="text-red-500 hover:text-red-700">✕</button>
                  </div>
                  
                  <input
                    type="text"
                    value={milestone.description}
                    onchange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                    class="w-full px-2 py-1 mb-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-gray-500 w-16">{t('progress')}:</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={milestone.progress}
                      onchange={(e) => updateMilestone(milestone.id, 'progress', parseInt(e.target.value))}
                      class="flex-1"
                    />
                    <span class="text-xs font-medium w-10">{milestone.progress}%</span>
                    <span class={`text-xs ${daysUntil < 0 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                      {daysUntil === 0 ? t('today') : daysUntil > 0 ? `${daysUntil}${t('daysLeft')}` : `${Math.abs(daysUntil)}${t('daysOverdue')}`}
                    </span>
                  </div>
                </div>
              </div>
            
