<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sprint-velocity-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sprint-velocity-calculator.${key}`;
  }

  // Types
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

  let sprints = $state([
    { id: '1', name: 'Sprint 1', committed: 30, completed: 25 },
    { id: '2', name: 'Sprint 2', committed: 28, completed: 28 },
    { id: '3', name: 'Sprint 3', committed: 32, completed: 30 },
    { id: '4', name: 'Sprint 4', committed: 30, completed: 32 },
    { id: '5', name: 'Sprint 5', committed: 35, completed: 33 },
  ]);

  function addSprint() {
    sprints = [...sprints, {
      id: Date.now().toString(),
      name: `${t('sprintDefault')} ${sprints.length + 1}`,
      committed: 30,
      completed: 0,
    }];
  }

  function updateSprint(id: string, field: keyof Sprint, value: string | number) {
    sprints = sprints.map(sprint => 
      sprint.id === id ? { ...sprint, [field]: value } : sprint
    );
  }

  function removeSprint(id: string) {
    sprints = sprints.filter(sprint => sprint.id !== id);
  }

  let stats = $derived(calculateStats(sprints));

  // Functions
  const maxCompleted = Math.max(...sprints.map(s => Math.max(s.committed, s.completed)), 1);

</script>


                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="px-3 py-2">
                    <input
                      type="text"
                      value={sprint.name}
                      onchange={(e) => updateSprint(sprint.id, 'name', e.target.value)}
                      class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      type="number"
                      value={sprint.committed}
                      onchange={(e) => updateSprint(sprint.id, 'committed', parseInt(e.target.value) || 0)}
                      min={0}
                      class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class="px-3 py-2">
                    <input
                      type="number"
                      value={sprint.completed}
                      onchange={(e) => updateSprint(sprint.id, 'completed', parseInt(e.target.value) || 0)}
                      min={0}
                      class="w-20 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </td>
                  <td class={`px-3 py-2 text-center font-medium ${rate >= 100 ? 'text-green-600' : rate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {rate}%
                  </td>
                  <td class="px-3 py-2">
                    <button onclick={() => removeSprint(sprint.id)} class="text-red-500 hover:text-red-700">✕</button>
                  </td>
                </tr>
              
