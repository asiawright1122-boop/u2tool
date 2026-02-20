<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['project-estimation-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.project-estimation-calculator.${key}`;
  }

  // Types
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

  let tasks = $state([
    { id: '1', name: 'Requirements Analysis', optimistic: 2, mostLikely: 3, pessimistic: 5 },
    { id: '2', name: 'Design', optimistic: 3, mostLikely: 5, pessimistic: 8 },
    { id: '3', name: 'Development', optimistic: 10, mostLikely: 15, pessimistic: 25 },
    { id: '4', name: 'Testing', optimistic: 3, mostLikely: 5, pessimistic: 10 },
    { id: '5', name: 'Deployment', optimistic: 1, mostLikely: 2, pessimistic: 4 },
  ]);

  let unit = $state('days');

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
    tasks = tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    );
  }

  function removeTask(id: string) {
    tasks = tasks.filter(task => task.id !== id);
  }

  let result = $derived(calculateProjectEstimation(tasks));

  // Functions
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

</script>


                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-3 py-2">
                    <input
                      type="text"
                      value={task.name}
                      onchange={(e) => updateTask(task.id, 'name', e.target.value)}
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      type="number"
                      value={task.optimistic}
                      onchange={(e) => updateTask(task.id, 'optimistic', parseFloat(e.target.value) || 0)}
                      min={0}
                      class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      type="number"
                      value={task.mostLikely}
                      onchange={(e) => updateTask(task.id, 'mostLikely', parseFloat(e.target.value) || 0)}
                      min={0}
                      class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      type="number"
                      value={task.pessimistic}
                      onchange={(e) => updateTask(task.id, 'pessimistic', parseFloat(e.target.value) || 0)}
                      min={0}
                      class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-3 py-2 text-center font-medium text-blue-600 dark:text-blue-400">
                    {Math.round(expected * 10) / 10} {unitLabel}
                  </td>
                  <td class="px-3 py-2">
                    <button
                      onclick={() => removeTask(task.id)}
                      class="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              
