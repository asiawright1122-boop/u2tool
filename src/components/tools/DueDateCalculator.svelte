<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['due-date-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.due-date-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Baby, Calendar, Clock, Heart } from 'lucide-svelte';
  import { CONCEPTION_OFFSET, PREGNANCY_DAYS } from '@/lib/tool-stubs';

  // Types
  type CalculationMethod = 'lmp' | 'conception' | 'ivf';
  interface PregnancyInfo {
  dueDate: Date;
  currentWeek: number;
  currentDay: number;
  trimester: 1 | 2 | 3;
  daysRemaining: number;
  progress: number;
  milestones: Milestone[];
}
  interface Milestone {
  week: number;
  title: string;
  description: string;
  isPast: boolean;
}

  let method = $state('lmp');

  let date = $state('');

  let result = $derived.by(() => {
    if (!date) return null;

    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) return null;

    let dueDate: Date;
    let conceptionDate: Date;

    switch (method) {
      case 'lmp':
        // Due date = LMP + 280 days
        dueDate = new Date(inputDate.getTime() + PREGNANCY_DAYS * 24 * 60 * 60 * 1000);
        conceptionDate = new Date(inputDate.getTime() + CONCEPTION_OFFSET * 24 * 60 * 60 * 1000);
        break;
      case 'conception':
        // Due date = Conception + 266 days (38 weeks)
        dueDate = new Date(inputDate.getTime() + 266 * 24 * 60 * 60 * 1000);
        conceptionDate = inputDate;
        break;
      case 'ivf':
        // Due date = Transfer date + 266 days - embryo age (assuming 5-day embryo)
        dueDate = new Date(inputDate.getTime() + (266 - 5) * 24 * 60 * 60 * 1000);
        conceptionDate = new Date(inputDate.getTime() - 5 * 24 * 60 * 60 * 1000);
        break;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current pregnancy progress
    const lmpDate = method === 'lmp' ? inputDate : new Date(conceptionDate.getTime() - CONCEPTION_OFFSET * 24 * 60 * 60 * 1000);
    const daysSinceLMP = Math.floor((today.getTime() - lmpDate.getTime()) / (24 * 60 * 60 * 1000));
    
    const currentWeek = Math.floor(daysSinceLMP / 7);
    const currentDay = daysSinceLMP % 7;
    const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));
    const progress = Math.min(100, Math.max(0, (daysSinceLMP / PREGNANCY_DAYS) * 100));

    let trimester: 1 | 2 | 3;
    if (currentWeek < 13) trimester = 1;
    else if (currentWeek < 27) trimester = 2;
    else trimester = 3;

    // Key milestones
    const milestones: Milestone[] = [
      { week: 4, title: t('milestone4'), description: t('milestone4Desc'), isPast: currentWeek >= 4 },
      { week: 8, title: t('milestone8'), description: t('milestone8Desc'), isPast: currentWeek >= 8 },
      { week: 12, title: t('milestone12'), description: t('milestone12Desc'), isPast: currentWeek >= 12 },
      { week: 16, title: t('milestone16'), description: t('milestone16Desc'), isPast: currentWeek >= 16 },
      { week: 20, title: t('milestone20'), description: t('milestone20Desc'), isPast: currentWeek >= 20 },
      { week: 24, title: t('milestone24'), description: t('milestone24Desc'), isPast: currentWeek >= 24 },
      { week: 28, title: t('milestone28'), description: t('milestone28Desc'), isPast: currentWeek >= 28 },
      { week: 32, title: t('milestone32'), description: t('milestone32Desc'), isPast: currentWeek >= 32 },
      { week: 36, title: t('milestone36'), description: t('milestone36Desc'), isPast: currentWeek >= 36 },
      { week: 40, title: t('milestone40'), description: t('milestone40Desc'), isPast: currentWeek >= 40 },
    ];

    return {
      dueDate,
      currentWeek,
      currentDay,
      trimester,
      daysRemaining,
      progress,
      milestones
    };
  });

  // Functions
  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  function getTrimesterColor(trimester: number) {
    switch (trimester) {
      case 1: return 'from-pink-400 to-pink-500';
      case 2: return 'from-slate-400 to-slate-500';
      case 3: return 'from-amber-400 to-amber-500';
      default: return 'from-gray-400 to-gray-500';
    }
  }

</script>


    <div class="space-y-6">
      <!-- Method Selection -->
      <div class="space-y-2">
        <div class="tool-label">
          {t('calculationMethod')}
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            onclick={() => method = 'lmp'}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              method === 'lmp'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('lmpMethod')}
          </button>
          <button
            onclick={() => method = 'conception'}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              method === 'conception'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('conceptionMethod')}
          </button>
          <button
            onclick={() => method = 'ivf'}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              method === 'ivf'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('ivfMethod')}
          </button>
        </div>
      </div>

      <!-- Date Input -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Calendar class="w-4 h-4" />
          {method === 'lmp' ? t('lmpDate') : method === 'conception' ? t('conceptionDate') : t('ivfDate')}
        </label>
        <input
          type="date"
          bind:value={date}
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- Due Date -->
          <div class="p-6 bg-gradient-to-r from-pink-50 to-slate-50 dark:from-pink-900/20 dark:to-slate-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
            <div class="flex items-center gap-3 mb-4">
              <Baby class="w-8 h-8 text-pink-500" />
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('estimatedDueDate')}</div>
                <div class="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {formatDate(result.dueDate)}
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-4">
              <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{t('week')} {result.currentWeek}, {t('day')} {result.currentDay}</span>
                <span>{result.daysRemaining} {t('daysRemaining')}</span>
              </div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class={`h-full bg-gradient-to-r ${getTrimesterColor(result.trimester)} rounded-full transition-all duration-500`}
                  style="width: {result.progress}%"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t('trimester1')}</span>
                <span>{t('trimester2')}</span>
                <span>{t('trimester3')}</span>
              </div>
            </div>
          </div>

          <!-- Current Status -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">{result.currentWeek}</div>
              <div class="text-sm text-gray-500">{t('weeks')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">{result.currentDay}</div>
              <div class="text-sm text-gray-500">{t('days')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">{result.trimester}</div>
              <div class="text-sm text-gray-500">{t('trimester')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(result.progress)}%</div>
              <div class="text-sm text-gray-500">{t('progress')}</div>
            </div>
          </div>

          <!-- Milestones -->
          <div class="space-y-2">
            <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Heart class="w-5 h-5 text-pink-500" />
              {t('milestones')}
            </h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              {#each result.milestones as milestone, index (index)}
<div 
                  class={`p-3 rounded-lg border ${
                    milestone.isPast
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="font-medium text-gray-900 dark:text-white">
                        {t('week')} {milestone.week}: {milestone.title}
                      </span>
                      <p class="text-sm text-gray-500">{milestone.description}</p>
                    </div>
                    {#if milestone.isPast}
<span class="text-green-500">✓</span>
{/if}
                  </div>
                </div>
{/each}
            </div>
          </div>
        </div>
{/if}
    </div>
  
