<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

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

  let { locale, translations }: Props = $props();

  function t(key: string, fallback?: string): string {
    const scope = (translations['tools']['sprint-velocity-calculator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    if (typeof value === 'string') return value;
    return fallback ?? `MISSING: tools.sprint-velocity-calculator.${key}`;
  }

  function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return Number(((sorted[middle - 1] + sorted[middle]) / 2).toFixed(1));
    }
    return sorted[middle];
  }

  function computeStats(list: Sprint[]): VelocityStats {
    const completed = list.map((item) => item.completed);
    const committed = list.map((item) => item.committed);
    const totalCompleted = completed.reduce((sum, item) => sum + item, 0);
    const totalCommitted = committed.reduce((sum, item) => sum + item, 0);
    const average = list.length > 0 ? Number((totalCompleted / list.length).toFixed(1)) : 0;
    const predictedNext = list.length > 0
      ? Number(((average * 0.7) + (completed[list.length - 1] ?? 0) * 0.3).toFixed(1))
      : 0;

    let trend: VelocityStats['trend'] = 'stable';
    if (list.length >= 2) {
      const previous = completed[list.length - 2];
      const current = completed[list.length - 1];
      if (current > previous) trend = 'up';
      if (current < previous) trend = 'down';
    }

    return {
      average,
      median: median(completed),
      min: completed.length > 0 ? Math.min(...completed) : 0,
      max: completed.length > 0 ? Math.max(...completed) : 0,
      trend,
      completionRate: totalCommitted > 0
        ? Number(((totalCompleted / totalCommitted) * 100).toFixed(1))
        : 0,
      predictedNext,
    };
  }

  let sprints = $state<Sprint[]>([
    { id: '1', name: 'Sprint 1', committed: 30, completed: 25 },
    { id: '2', name: 'Sprint 2', committed: 28, completed: 28 },
    { id: '3', name: 'Sprint 3', committed: 32, completed: 30 },
    { id: '4', name: 'Sprint 4', committed: 30, completed: 32 },
    { id: '5', name: 'Sprint 5', committed: 35, completed: 33 },
  ]);

  function addSprint() {
    sprints = [
      ...sprints,
      {
        id: Date.now().toString(),
        name: `${t('sprintDefault', 'Sprint')} ${sprints.length + 1}`,
        committed: 30,
        completed: 0,
      },
    ];
  }

  function updateSprint(id: string, field: keyof Sprint, value: string | number) {
    sprints = sprints.map((sprint) => (
      sprint.id === id ? { ...sprint, [field]: value } : sprint
    ));
  }

  function removeSprint(id: string) {
    sprints = sprints.filter((sprint) => sprint.id !== id);
  }

  let stats = $derived.by(() => computeStats(sprints));
  let maxPoints = $derived.by(() => Math.max(1, ...sprints.map((s) => Math.max(s.committed, s.completed))));
</script>

<div class="space-y-6">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 text-center">
      <div class="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.average}</div>
      <div class="text-xs text-blue-600 dark:text-blue-400">{t('avgVelocity', 'Avg velocity')}</div>
    </div>
    <div class="rounded-lg p-4 bg-green-50 dark:bg-green-900/20 text-center">
      <div class="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completionRate}%</div>
      <div class="text-xs text-green-600 dark:text-green-400">{t('completionRate', 'Completion rate')}</div>
    </div>
    <div class="rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20 text-center">
      <div class="text-2xl font-bold text-purple-700 dark:text-purple-300">
        {stats.trend === 'up' ? 'UP' : stats.trend === 'down' ? 'DOWN' : 'STABLE'}
      </div>
      <div class="text-xs text-purple-600 dark:text-purple-400">{t('trend', 'Trend')}</div>
    </div>
    <div class="rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20 text-center">
      <div class="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.predictedNext}</div>
      <div class="text-xs text-amber-600 dark:text-amber-400">{t('nextPrediction', 'Next prediction')}</div>
    </div>
  </div>

  <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50 dark:bg-gray-900/60">
        <tr>
          <th class="px-3 py-2 text-left">{t('sprintName', 'Sprint')}</th>
          <th class="px-3 py-2 text-center">{t('committed', 'Committed')}</th>
          <th class="px-3 py-2 text-center">{t('completed', 'Completed')}</th>
          <th class="px-3 py-2 text-center">{t('completion', 'Completion')}</th>
          <th class="px-3 py-2 text-center">{t('actions', 'Actions')}</th>
        </tr>
      </thead>
      <tbody>
        {#each sprints as sprint (sprint.id)}
          {@const rate = sprint.committed > 0 ? Math.round((sprint.completed / sprint.committed) * 100) : 0}
          <tr class="border-t border-gray-200 dark:border-gray-700">
            <td class="px-3 py-2">
              <input
                type="text"
                value={sprint.name}
                onchange={(e) => updateSprint(sprint.id, 'name', e.target.value)}
                class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td class="px-3 py-2 text-center">
              <input
                type="number"
                value={sprint.committed}
                onchange={(e) => updateSprint(sprint.id, 'committed', parseInt(e.target.value, 10) || 0)}
                min={0}
                class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td class="px-3 py-2 text-center">
              <input
                type="number"
                value={sprint.completed}
                onchange={(e) => updateSprint(sprint.id, 'completed', parseInt(e.target.value, 10) || 0)}
                min={0}
                class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td
              class={`px-3 py-2 text-center font-medium ${
                rate >= 100 ? 'text-green-600' : rate >= 80 ? 'text-yellow-600' : 'text-red-600'
              }`}
            >
              {rate}%
            </td>
            <td class="px-3 py-2 text-center">
              <button onclick={() => removeSprint(sprint.id)} class="text-red-500 hover:text-red-700">x</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="flex justify-between items-center">
    <button onclick={addSprint} class="btn-primary">{t('addSprint', 'Add sprint')}</button>
    <div class="text-xs text-gray-500 dark:text-gray-400">
      {t('median', 'Median')}: {stats.median} | {t('range', 'Range')}: {stats.min} - {stats.max}
    </div>
  </div>

  <div class="space-y-3 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/60">
    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('velocityTrend', 'Velocity trend')}</div>
    {#each sprints as sprint (sprint.id)}
      <div class="space-y-1">
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{sprint.name}</span>
          <span>{sprint.completed}/{sprint.committed}</span>
        </div>
        <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            class="h-full bg-blue-500"
            style={`width: ${(sprint.completed / maxPoints) * 100}%`}
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>
