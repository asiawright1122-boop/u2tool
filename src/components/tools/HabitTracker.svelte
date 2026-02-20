<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['habit-tracker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.habit-tracker.${key}`;
  }

  // Types
  interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  color: string;
}

  let habits = $state([]);

  let newHabitName = $state('');

  let selectedColor = $state(colors[0]);

  $effect(() => {
    const saved = localStorage.getItem('habits');
    if (saved) habits = JSON.parse(saved);
  });

  $effect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  });

  // Functions
  function addHabit() {
    if (!newHabitName.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      completedDates: [],
      color: selectedColor,
    };
    habits = [...habits, habit];
    newHabitName = '';
  }
  function toggleDay(habitId: string, date: string) {
    habits = habits.map(h => {
      if (h.id !== habitId) return h;
      const dates = h.completedDates.includes(date)
        ? h.completedDates.filter(d => d !== date)
        : [...h.completedDates, date];
      return { ...h, completedDates: dates };
    });
  }
  function deleteHabit(id: string) {
    habits = habits.filter(h => h.id !== id);
  }
  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }
  const days = getLast7Days();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function getStreak(habit: Habit): number {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completedDates.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-3">
        <input
          type="text"
          bind:value={newHabitName}
          placeholder={t('habitPlaceholder')}
          class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          onkeypress={(e) => e.key === 'Enter' && addHabit()}
        />
        <div class="flex gap-1">
          {#each colors as color (color)}
<button 
              onclick={() => selectedColor = color}
              class={`w-10 h-10 rounded-lg transition-transform ${selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''}`}
              style="background-color: {color}"
            />
{/each}
        </div>
        <button
          onclick={addHabit}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('addHabit')}
        </button>
      </div>

      {#if habits.length === 0}
<div class="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('noHabits')}
        </div>
{:else}
<div class="space-y-4">
          <div class="grid grid-cols-[1fr_repeat(7,40px)_60px_40px] gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
            <div>{t('habit')}</div>
            {#each days as date (date)}
<div  class="text-center">
                {dayNames[new Date(date).getDay()]}
              </div>
{/each}
            <div class="text-center">{t('streak')}</div>
            <div></div>
          </div>

          {#each habits as habit (habit.id)}
<div 
              class="grid grid-cols-[1fr_repeat(7,40px)_60px_40px] gap-2 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" style="background-color: {habit.color}"></div>
                <span class="font-medium text-gray-900 dark:text-white truncate">{habit.name}</span>
              </div>
              {#each days as date (date)}
<button 
                  onclick={() => toggleDay(habit.id, date)}
                  class={`w-10 h-10 rounded-lg border-2 transition-colors ${
                    habit.completedDates.includes(date)
                      ? 'border-transparent'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  style="background-color: {habit.completedDates.includes(date) ? habit.color : 'transparent'}"
                >
                  {#if habit.completedDates.includes(date)}<span class="text-white">✓</span>{/if}
                </button>
{/each}
              <div class="text-center font-medium text-gray-900 dark:text-white">
                <span class="text-orange-500 font-bold">{getStreak(habit)}</span>
              </div>
              <button
                onclick={() => deleteHabit(habit.id)}
                class="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
{/each}
        </div>
{/if}

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> {t('tip')}
      </div>
    </div>
  
