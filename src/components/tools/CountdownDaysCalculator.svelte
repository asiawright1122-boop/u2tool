<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['countdown-days-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.countdown-days-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Calendar, Clock, Plus, Trash2, Save } from 'lucide-svelte';

  // Types
  interface Countdown {
  id: string;
  name: string;
  targetDate: string;
}
  interface CountdownResult {
  totalDays: number;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  progress: number;
  isPast: boolean;
}

  let countdowns = $state([]);

  let newName = $state('');

  let newDate = $state('');

  let now = $state(new Date());

  $effect(() => {
    const saved = localStorage.getItem('countdowns');
    if (saved) {
      try {
        countdowns = JSON.parse(saved);
      } catch {
        // Ignore parse errors
      }
    }
  });

  $effect(() => {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
  });

  $effect(() => {
    const interval = setInterval(() => now = new Date(), 1000);
    return () => clearInterval(interval);
  });

  // Functions
  function addCountdown() {
    if (!newName.trim() || !newDate) return;
    
    const countdown: Countdown = {
      id: Date.now().toString(),
      name: newName.trim(),
      targetDate: newDate,
    };
    
    countdowns = [...countdowns, countdown];
    newName = '';
    newDate = '';
  }
  function removeCountdown(id: string) {
    countdowns = countdowns.filter(c => c.id !== id);
  }
  function calculateCountdown(targetDateStr: string): CountdownResult {
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    
    const diff = target.getTime() - now.getTime();
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const totalSeconds = Math.floor(absDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const weeks = Math.floor(((totalDays % 365) % 30) / 7);
    const days = ((totalDays % 365) % 30) % 7;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Calculate progress (for events within a year)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearDiff = endOfYear.getTime() - startOfYear.getTime();
    const elapsed = now.getTime() - startOfYear.getTime();
    const progress = Math.min(100, Math.max(0, (elapsed / yearDiff) * 100));

    return {
      totalDays,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
      progress,
      isPast,
    };
  }
  const quickAddPresets = [
    { name: t('newYear'), getDate: () => `${new Date().getFullYear() + 1}-01-01` },
    { name: t('christmas'), getDate: () => `${new Date().getFullYear()}-12-25` },
    { name: t('valentines'), getDate: () => `${new Date().getFullYear() + 1}-02-14` },
  ];

</script>


              <div
                class={`p-4 rounded-lg border ${
                  result.isPast
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {countdown.name}
                    </h4>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar class="w-4 h-4" />
                      {new Date(countdown.targetDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <button
                    onclick={() => removeCountdown(countdown.id)}
                    class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <!-- Main Counter -->
                <div class="text-center mb-4">
                  <div class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                    {result.isPast ? '-' : ''}{result.totalDays}
                  </div>
                  <div class="text-gray-500">{t('days')}</div>
                </div>

                <!-- Detailed Breakdown -->
                <div class="grid grid-cols-4 md:grid-cols-7 gap-2 text-center">
                  {#if result.years > 0}
<div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div class="text-xl font-bold text-gray-900 dark:text-white">{result.years}</div>
                      <div class="text-xs text-gray-500">{t('years')}</div>
                    </div>
{/if}
                  {#if result.years > 0 || result.months > 0}
<div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <div class="text-xl font-bold text-gray-900 dark:text-white">{result.months}</div>
                      <div class="text-xs text-gray-500">{t('months')}</div>
                    </div>
{/if}
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{result.weeks}</div>
                    <div class="text-xs text-gray-500">{t('weeks')}</div>
                  </div>
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{result.days}</div>
                    <div class="text-xs text-gray-500">{t('daysShort')}</div>
                  </div>
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{result.hours}</div>
                    <div class="text-xs text-gray-500">{t('hours')}</div>
                  </div>
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{result.minutes}</div>
                    <div class="text-xs text-gray-500">{t('minutes')}</div>
                  </div>
                  <div class="p-2 bg-white dark:bg-gray-800 rounded-lg">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">{result.seconds}</div>
                    <div class="text-xs text-gray-500">{t('seconds')}</div>
                  </div>
                </div>

                <!-- Status -->
                {#if result.isPast}
<div class="mt-4 text-center text-gray-500">
                    {t('eventPassed')}
                  </div>
{/if}
              </div>
            
