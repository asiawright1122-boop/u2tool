<script lang="ts">
  import { calculateProjectEstimation } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']['project-estimation-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.project-estimation-calculator.${key}`;
  }

  interface Task {
    id: string;
    name: string;
    optimistic: number;
    mostLikely: number;
    pessimistic: number;
  }

  type Unit = 'hours' | 'days' | 'weeks';

  let tasks = $state<Task[]>([
    { id: '1', name: 'Requirements Analysis', optimistic: 2, mostLikely: 3, pessimistic: 5 },
    { id: '2', name: 'Design', optimistic: 3, mostLikely: 5, pessimistic: 8 },
    { id: '3', name: 'Development', optimistic: 10, mostLikely: 15, pessimistic: 25 },
    { id: '4', name: 'Testing', optimistic: 3, mostLikely: 5, pessimistic: 10 },
    { id: '5', name: 'Deployment', optimistic: 1, mostLikely: 2, pessimistic: 4 },
  ]);

  let unit = $state<Unit>('days');

  const unitLabels: Record<Unit, string> = {
    hours: t('hrs'),
    days: t('days'),
    weeks: t('wks'),
  };

  let result = $derived(calculateProjectEstimation(tasks));
  let unitLabel = $derived(unitLabels[unit]);

  function addTask() {
    tasks = [...tasks, {
      id: Date.now().toString(),
      name: `${t('taskDefault')} ${tasks.length + 1}`,
      optimistic: 1,
      mostLikely: 2,
      pessimistic: 4,
    }];
  }

  function updateTask(id: string, field: keyof Task, value: string | number) {
    tasks = tasks.map(task => task.id === id ? { ...task, [field]: value } : task);
  }

  function removeTask(id: string) {
    tasks = tasks.filter(task => task.id !== id);
  }
</script>

<div class="space-y-6">
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div>
      <label for="project-estimation-unit" class="tool-label">{t('process')}</label>
      <select
        id="project-estimation-unit"
        name="unit"
        bind:value={unit}
        class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="hours">{t('hours')}</option>
        <option value="days">{t('days')}</option>
        <option value="weeks">{t('weeks')}</option>
      </select>
    </div>
    <button onclick={addTask} class="btn-primary">{t('addTask')}</button>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-gray-200 dark:border-gray-700 text-left">
          <th class="px-3 py-2">{t('taskName')}</th>
          <th class="px-3 py-2 text-center">{t('optimistic')}</th>
          <th class="px-3 py-2 text-center">{t('mostLikely')}</th>
          <th class="px-3 py-2 text-center">{t('pessimistic')}</th>
          <th class="px-3 py-2 text-center">{t('expected')}</th>
          <th class="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {#each result.tasks as task (task.id)}
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <td class="px-3 py-2">
              <input
                aria-label={t('taskName')}
                type="text"
                value={task.name}
                onchange={(e) => updateTask(task.id, 'name', e.currentTarget.value)}
                class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td class="px-3 py-2">
              <input
                aria-label={t('optimistic')}
                type="number"
                value={task.optimistic}
                onchange={(e) => updateTask(task.id, 'optimistic', parseFloat(e.currentTarget.value) || 0)}
                min={0}
                class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td class="px-3 py-2">
              <input
                aria-label={t('mostLikely')}
                type="number"
                value={task.mostLikely}
                onchange={(e) => updateTask(task.id, 'mostLikely', parseFloat(e.currentTarget.value) || 0)}
                min={0}
                class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td class="px-3 py-2">
              <input
                aria-label={t('pessimistic')}
                type="number"
                value={task.pessimistic}
                onchange={(e) => updateTask(task.id, 'pessimistic', parseFloat(e.currentTarget.value) || 0)}
                min={0}
                class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </td>
            <td class="px-3 py-2 text-center font-medium text-amber-600 dark:text-amber-400">
              {Math.round(task.expected * 10) / 10} {unitLabel}
            </td>
            <td class="px-3 py-2">
              <button
                onclick={() => removeTask(task.id)}
                class="text-red-500 hover:text-red-700"
                aria-label={t('remove')}
              >
                x
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
      <p class="text-sm text-amber-700 dark:text-amber-300">{t('expectedDuration')}</p>
      <p class="text-2xl font-bold text-amber-800 dark:text-amber-200">{result.expected} {unitLabel}</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-sm text-gray-600 dark:text-gray-400">{t('standardDeviation')}</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">{result.standardDeviation} {unitLabel}</p>
    </div>
    <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <p class="text-sm text-gray-600 dark:text-gray-400">{t('pertFormula')}</p>
      <p class="text-sm font-mono text-gray-900 dark:text-white">(O + 4M + P) / 6</p>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('confidence68')}</p>
      <p class="text-lg text-gray-900 dark:text-white">{result.confidence68.min} - {result.confidence68.max} {unitLabel}</p>
    </div>
    <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('confidence95')}</p>
      <p class="text-lg text-gray-900 dark:text-white">{result.confidence95.min} - {result.confidence95.max} {unitLabel}</p>
    </div>
  </div>
</div>
