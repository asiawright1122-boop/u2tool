<script lang="ts">
  import { getMonthRuns, getNextRuns, parseCron } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

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

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = (translations.tools as Record<string, unknown>)?.['crontab-calendar'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.crontab-calendar.${key}`;
  }

  function tg(key: string): string {
    const scope = translations.tools as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let expression = $state('0 9 * * 1-5');
  let parsedCron = $state<ParsedCron | null>(parseCron(expression));
  let error = $state('');
  let selectedMonth = $state(new Date());
  let viewMode = $state<'list' | 'calendar'>('calendar');

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = $derived(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate());
  const firstDayOfMonth = $derived(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay());
  const calendarDays = $derived(Array.from({ length: daysInMonth }, (_, index) => index + 1));
  const blankDays = $derived(Array.from({ length: firstDayOfMonth }, (_, index) => index));

  const nextRuns = $derived.by(() => {
    if (!parsedCron) return [];
    return getNextRuns(parsedCron, 10);
  });

  const monthRuns = $derived.by(() => {
    if (!parsedCron) return new Set<number>();
    const runs = getMonthRuns(parsedCron, selectedMonth.getFullYear(), selectedMonth.getMonth());
    return new Set(runs.map((date) => date.getDate()));
  });

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

  function handleClear() {
    expression = '';
    parsedCron = null;
    error = '';
  }

  function prevMonth() {
    selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
  }

  function nextMonth() {
    selectedMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
  }

  function isToday(day: number) {
    const today = new Date();
    return (
      today.getFullYear() === selectedMonth.getFullYear() &&
      today.getMonth() === selectedMonth.getMonth() &&
      today.getDate() === day
    );
  }

  function formatMonth(date: Date) {
    return date.toLocaleString(locale || 'en-US', { month: 'long', year: 'numeric' });
  }

  function formatDate(date: Date) {
    return date.toLocaleString(locale || 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
</script>

<div class="space-y-6">
  <div>
    <label class="block text-sm font-medium mb-2" for="cron-expression">{t('expression')}</label>
    <div class="flex flex-col gap-3 sm:flex-row">
      <input
        id="cron-expression"
        type="text"
        bind:value={expression}
        onkeydown={(event) => event.key === 'Enter' && handleParse()}
        class="tool-input font-mono"
        placeholder={t('expressionPlaceholder')}
      />
      <div class="flex gap-2">
        <button type="button" onclick={handleParse} class="tool-button-primary">
          {t('parse')}
        </button>
        <button type="button" onclick={handleClear} class="tool-button-secondary">
          {tg('clear')}
        </button>
      </div>
    </div>
    <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{t('formatHint')}</p>
  </div>

  {#if error}
    <div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
      {error}
    </div>
  {/if}

  {#if parsedCron}
    <div class="flex gap-2">
      <button
        type="button"
        onclick={() => viewMode = 'calendar'}
        class={`px-3 py-2 rounded-lg text-sm transition-colors ${
          viewMode === 'calendar'
            ? 'bg-amber-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {t('calendarView')}
      </button>
      <button
        type="button"
        onclick={() => viewMode = 'list'}
        class={`px-3 py-2 rounded-lg text-sm transition-colors ${
          viewMode === 'list'
            ? 'bg-amber-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        {t('listView')}
      </button>
    </div>

    {#if viewMode === 'list'}
      <div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <h3 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">{t('nextRuns')}</h3>
        <div class="space-y-2">
          {#each nextRuns as date, index (index)}
            <div class="font-mono text-sm text-gray-600 dark:text-gray-300">{formatDate(date)}</div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <button type="button" onclick={prevMonth} class="tool-button-secondary" aria-label={t('prevMonth')}>
            &lt;
          </button>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">{formatMonth(selectedMonth)}</h3>
          <button type="button" onclick={nextMonth} class="tool-button-secondary" aria-label={t('nextMonth')}>
            &gt;
          </button>
        </div>

        <div class="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
          {#each weekdayLabels as label}
            <div>{label}</div>
          {/each}
        </div>

        <div class="mt-2 grid grid-cols-7 gap-2">
          {#each blankDays as blank (blank)}
            <div class="min-h-10"></div>
          {/each}
          {#each calendarDays as day (day)}
            {@const hasRun = monthRuns.has(day)}
            <div
              class={`min-h-10 rounded-lg p-2 text-center ${
                hasRun
                  ? 'bg-amber-100 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'text-gray-700 dark:text-gray-300'
              } ${isToday(day) ? 'ring-2 ring-amber-500' : ''}`}
              title={hasRun ? t('scheduledRun') : ''}
            >
              <div>{day}</div>
              {#if hasRun}
                <div class="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-amber-500"></div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>
