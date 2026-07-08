<script lang="ts">
  import { getDaysUntil } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']['milestone-tracker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.milestone-tracker.${key}`;
  }

  interface Milestone {
    id: string;
    name: string;
    dueDate: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
    progress: number;
    description: string;
  }

  let milestones = $state<Milestone[]>([
    { id: '1', name: 'Project Kickoff', dueDate: '2026-01-15', status: 'completed', progress: 100, description: 'Initial project setup and team alignment' },
    { id: '2', name: 'Requirements Complete', dueDate: '2026-02-01', status: 'completed', progress: 100, description: 'All requirements documented and approved' },
    { id: '3', name: 'Design Phase', dueDate: '2026-05-28', status: 'in_progress', progress: 75, description: 'UI/UX design and architecture' },
    { id: '4', name: 'Development Sprint 1', dueDate: '2026-06-15', status: 'not_started', progress: 0, description: 'Core features implementation' },
    { id: '5', name: 'Beta Release', dueDate: '2026-07-01', status: 'not_started', progress: 0, description: 'Internal beta testing' },
    { id: '6', name: 'Production Launch', dueDate: '2026-07-30', status: 'not_started', progress: 0, description: 'Public release' },
  ]);

  let sortedMilestones = $derived.by(() => {
    return [...milestones].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  });

  let summary = $derived.by(() => {
    const completed = milestones.filter(milestone => milestone.status === 'completed').length;
    const inProgress = milestones.filter(milestone => milestone.status === 'in_progress').length;
    const delayed = milestones.filter(milestone => milestone.status === 'delayed' || (getDaysUntil(milestone.dueDate) < 0 && milestone.status !== 'completed')).length;
    const upcoming = milestones.filter(milestone => {
      const days = getDaysUntil(milestone.dueDate);
      return days >= 0 && days <= 14 && milestone.status !== 'completed';
    }).length;
    const overallProgress = milestones.length > 0
      ? Math.round(milestones.reduce((sum, milestone) => sum + milestone.progress, 0) / milestones.length)
      : 0;
    return { total: milestones.length, completed, inProgress, delayed, upcoming, overallProgress };
  });

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
    milestones = milestones.map(milestone => milestone.id === id ? { ...milestone, [field]: value } : milestone);
  }

  function removeMilestone(id: string) {
    milestones = milestones.filter(milestone => milestone.id !== id);
  }

  function milestoneColor(milestone: Milestone) {
    if (milestone.status === 'completed') return 'green';
    if (milestone.status === 'delayed' || getDaysUntil(milestone.dueDate) < 0) return 'red';
    if (getDaysUntil(milestone.dueDate) <= 14) return 'orange';
    return 'amber';
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('total')}</p>
      <p class="text-xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
    </div>
    <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
      <p class="text-xs text-green-600 dark:text-green-400">{t('completed')}</p>
      <p class="text-xl font-bold text-green-700 dark:text-green-300">{summary.completed}</p>
    </div>
    <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <p class="text-xs text-amber-600 dark:text-amber-400">{t('inProgress')}</p>
      <p class="text-xl font-bold text-amber-700 dark:text-amber-300">{summary.inProgress}</p>
    </div>
    <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <p class="text-xs text-red-600 dark:text-red-400">{t('delayed')}</p>
      <p class="text-xl font-bold text-red-700 dark:text-red-300">{summary.delayed}</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-xs text-gray-500">{t('progress')}</p>
      <p class="text-xl font-bold text-gray-900 dark:text-white">{summary.overallProgress}%</p>
    </div>
  </div>

  <div class="flex items-center justify-between gap-3">
    <h3 class="font-medium text-gray-900 dark:text-white">{t('timeline')}</h3>
    <button onclick={addMilestone} class="btn-primary text-sm">{t('addMilestone')}</button>
  </div>

  <div class="space-y-4">
    {#each sortedMilestones as milestone, idx (milestone.id)}
      {@const daysUntil = getDaysUntil(milestone.dueDate)}
      {@const color = milestoneColor(milestone)}
      <div class="relative pl-10">
        <div class={`absolute left-2 w-5 h-5 rounded-full border-2 ${
          color === 'green' ? 'bg-green-500 border-green-500' :
          color === 'red' ? 'bg-red-500 border-red-500' :
          color === 'orange' ? 'bg-orange-500 border-orange-500' :
          'bg-white dark:bg-gray-800 border-amber-500'
        } ${milestone.status === 'completed' ? '' : 'flex items-center justify-center'}`}>
          {#if milestone.status === 'completed'}
            <span class="text-white text-xs">✓</span>
          {:else}
            <span class="text-xs font-bold text-amber-500">{idx + 1}</span>
          {/if}
        </div>

        <div class={`p-4 rounded-lg border ${
          color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
          color === 'red' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
          color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
          'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
        }`}>
          <div class="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_32px] gap-3 mb-2">
            <input
              aria-label={t('timeline')}
              type="text"
              value={milestone.name}
              onchange={(e) => updateMilestone(milestone.id, 'name', e.currentTarget.value)}
              class="px-2 py-1 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              aria-label="Due date"
              type="date"
              value={milestone.dueDate}
              onchange={(e) => updateMilestone(milestone.id, 'dueDate', e.currentTarget.value)}
              class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              aria-label="Status"
              value={milestone.status}
              onchange={(e) => updateMilestone(milestone.id, 'status', e.currentTarget.value)}
              class="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="not_started">{t('notStarted')}</option>
              <option value="in_progress">{t('inProgress')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="delayed">{t('delayed')}</option>
            </select>
            <button onclick={() => removeMilestone(milestone.id)} class="text-red-500 hover:text-red-700" aria-label={t('remove')}>x</button>
          </div>

          <input
            aria-label={t('descriptionPlaceholder')}
            type="text"
            value={milestone.description}
            onchange={(e) => updateMilestone(milestone.id, 'description', e.currentTarget.value)}
            placeholder={t('descriptionPlaceholder')}
            class="w-full px-2 py-1 mb-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          <div class="flex items-center gap-3">
            <label for={`milestone-tracker-field-2-${idx}`} class="text-xs text-gray-500 w-16">{t('progress')}:</label>
            <input
              type="range"
              min={0}
              max={100}
              value={milestone.progress}
              onchange={(e) => updateMilestone(milestone.id, 'progress', parseInt(e.currentTarget.value, 10))}
              class="flex-1" id={`milestone-tracker-field-2-${idx}`} />
            <span class="text-xs font-medium w-10">{milestone.progress}%</span>
            <span class={`text-xs ${daysUntil < 0 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
              {daysUntil === 0 ? t('today') : daysUntil > 0 ? `${daysUntil}${t('daysLeft')}` : `${Math.abs(daysUntil)}${t('daysOverdue')}`}
            </span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
