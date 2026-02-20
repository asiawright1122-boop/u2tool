<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['crontab-calendar'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.crontab-calendar.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface CronField {
  values: number[];
  all: boolean;
}
  interface ParsedCron {
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
}

  let expression = $state('');

  let parsedCron = $state(null);

  let error = $state('');

  let selectedMonth = $state(new Date());

  let viewMode = $state('list');

  function handleParse() {
    if (!expression.trim()) {
      parsedCron = null;
      error = '';
      return;
    }

    const parsed = parseCron(expression);
    if (parsed) {
      parsedCron = parsed;
      error = '';
    } else {
      parsedCron = null;
      error = t('invalidCron');
    }
  }

  let nextRuns = $derived.by(() => {
    if (!parsedCron) return [];
    return getNextRuns(parsedCron, 10);
  });

  let monthRuns = $derived.by(() => {
    if (!parsedCron) return new Set<number>();
    const runs = getMonthRuns(parsedCron, selectedMonth.getFullYear(), selectedMonth.getMonth());
    return new Set(runs.map(d => d.getDate()));
  });

  // Functions
  function handleClear() {
    expression = '';
    parsedCron = null;
    error = '';
  }
  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === selectedMonth.getFullYear() && today.getMonth() === selectedMonth.getMonth();
  function prevMonth() {
    selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
  }
  function nextMonth() {
    selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
  }
  function formatDate(date: Date) {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

</script>


                    <div
                      class={`p-2 text-center rounded-lg ${
                        hasRun
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      } ${
                        isToday ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {day}
                      {#if hasRun}
<div class="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1"></div>
{/if}
                    </div>
                  
