<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sleep-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sleep-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Moon, Sun, Clock, Info } from 'lucide-svelte';

  // Types
  type Mode = 'wake' | 'sleep';
  interface SleepTime {
  time: string;
  cycles: number;
  hours: number;
  quality: 'optimal' | 'good' | 'fair';
}

  let mode = $state('wake');

  let targetTime = $state('07:00');

  let fallAsleepTime = $state(15);

  let suggestedTimes = $derived.by(() => {
    const [hours, minutes] = targetTime.split(':').map(Number);
    const targetDate = new Date();
    targetDate.setHours(hours, minutes, 0, 0);

    const results: SleepTime[] = [];

    if (mode === 'wake') {
      // Calculate bedtimes for waking up at target time
      // Recommend 4-6 sleep cycles
      for (let cycles = 6; cycles >= 4; cycles--) {
        const sleepMinutes = cycles * SLEEP_CYCLE_MINUTES + fallAsleepTime;
        const bedtime = new Date(targetDate.getTime() - sleepMinutes * 60 * 1000);
        
        results.push({
          time: bedtime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          cycles,
          hours: (cycles * SLEEP_CYCLE_MINUTES) / 60,
          quality: cycles >= 5 ? 'optimal' : cycles === 4 ? 'good' : 'fair'
        });
      }
    } else {
      // Calculate wake times for going to bed at target time
      for (let cycles = 4; cycles <= 6; cycles++) {
        const sleepMinutes = cycles * SLEEP_CYCLE_MINUTES + fallAsleepTime;
        const wakeTime = new Date(targetDate.getTime() + sleepMinutes * 60 * 1000);
        
        results.push({
          time: wakeTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          cycles,
          hours: (cycles * SLEEP_CYCLE_MINUTES) / 60,
          quality: cycles >= 5 ? 'optimal' : cycles === 4 ? 'good' : 'fair'
        });
      }
    }

    return results;
  });

  // Functions
  function getQualityColor(quality: string) {
    switch (quality) {
      case 'optimal': return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
      default: return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
    }
  }
  function getQualityBadge(quality: string) {
    switch (quality) {
      case 'optimal': return 'bg-green-500 text-white';
      case 'good': return 'bg-blue-500 text-white';
      default: return 'bg-yellow-500 text-white';
    }
  }

</script>


    <div class="space-y-6">
      <!-- Mode Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => mode = 'wake'}
          class={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            mode === 'wake'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Sun class="w-5 h-5" />
          {t('wakeUpMode')}
        </button>
        <button
          onclick={() => mode = 'sleep'}
          class={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            mode === 'sleep'
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Moon class="w-5 h-5" />
          {t('sleepMode')}
        </button>
      </div>

      <!-- Time Input -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock class="w-4 h-4" />
            {mode === 'wake' ? t('wakeUpTime') : t('bedtime')}
          </label>
          <input
            type="time"
            bind:value={targetTime}
            class="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fallAsleepTime')} ({t('minutes')})
          </label>
          <select
            value={fallAsleepTime}
            onchange={(e) => fallAsleepTime = parseInt(e.target.value)}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="5">5 {t('minutes')}</option>
            <option value="10">10 {t('minutes')}</option>
            <option value="15">15 {t('minutes')}</option>
            <option value="20">20 {t('minutes')}</option>
            <option value="30">30 {t('minutes')}</option>
          </select>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-3">
        <h3 class="font-medium text-gray-900 dark:text-white">
          {mode === 'wake' ? t('suggestedBedtimes') : t('suggestedWakeTimes')}
        </h3>
        
        {#each suggestedTimes as item, index (index)}
<div 
            class={`p-4 rounded-lg border ${getQualityColor(item.quality)} transition-all hover:scale-[1.02]`}
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.time}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <div>{item.cycles} {t('cycles')}</div>
                  <div>{item.hours} {t('hours')}</div>
                </div>
              </div>
              <span class={`px-3 py-1 rounded-full text-sm font-medium ${getQualityBadge(item.quality)}`}>
                {t(item.quality)}
              </span>
            </div>
          </div>
{/each}
      </div>

      <!-- Sleep Cycle Info -->
      <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div class="flex items-start gap-3">
          <Info class="w-5 h-5 text-indigo-500 mt-0.5" />
          <div>
            <div class="font-medium text-indigo-700 dark:text-indigo-300">{t('aboutSleepCycles')}</div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('sleepCycleInfo')}
            </p>
            <ul class="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• {t('cycleInfo1')}</li>
              <li>• {t('cycleInfo2')}</li>
              <li>• {t('cycleInfo3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  
