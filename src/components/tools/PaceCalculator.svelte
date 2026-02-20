<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['pace-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.pace-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Timer, Route, Calculator, ArrowLeftRight } from 'lucide-react';

  // Types
  type CalculationMode = 'pace' | 'time' | 'distance';
  type Unit = 'km' | 'mi';
  interface PaceResult {
  pacePerKm: string;
  pacePerMile: string;
  speedKmh: number;
  speedMph: number;
  finishTime: string;
  splits: { distance: number; time: string }[];
}

  let mode = $state('pace');

  let unit = $state('km');

  let distance = $state('10');

  let hours = $state('0');

  let minutes = $state('50');

  let seconds = $state('0');

  let paceMinutes = $state('5');

  let paceSeconds = $state('0');

  let result = $derived.by(() => {
    const distanceNum = parseFloat(distance);
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const secondsNum = parseInt(seconds) || 0;
    const paceMinNum = parseInt(paceMinutes) || 0;
    const paceSecNum = parseInt(paceSeconds) || 0;

    if (distanceNum <= 0) return null;

    let totalSeconds: number;
    let distanceKm: number;

    // Convert distance to km
    distanceKm = unit === 'km' ? distanceNum : distanceNum * 1.60934;

    if (mode === 'pace') {
      // Calculate pace from distance and time
      totalSeconds = hoursNum * 3600 + minutesNum * 60 + secondsNum;
      if (totalSeconds <= 0) return null;
    } else if (mode === 'time') {
      // Calculate time from distance and pace
      const paceSecondsPerUnit = paceMinNum * 60 + paceSecNum;
      if (paceSecondsPerUnit <= 0) return null;
      
      const paceSecondsPerKm = unit === 'km' ? paceSecondsPerUnit : paceSecondsPerUnit / 1.60934;
      totalSeconds = paceSecondsPerKm * distanceKm;
    } else {
      // Calculate distance from time and pace
      totalSeconds = hoursNum * 3600 + minutesNum * 60 + secondsNum;
      const paceSecondsPerUnit = paceMinNum * 60 + paceSecNum;
      if (paceSecondsPerUnit <= 0 || totalSeconds <= 0) return null;
      
      const paceSecondsPerKm = unit === 'km' ? paceSecondsPerUnit : paceSecondsPerUnit / 1.60934;
      distanceKm = totalSeconds / paceSecondsPerKm;
    }

    // Calculate pace per km
    const paceSecondsPerKm = totalSeconds / distanceKm;
    const paceMinPerKm = Math.floor(paceSecondsPerKm / 60);
    const paceSecPerKm = Math.round(paceSecondsPerKm % 60);

    // Calculate pace per mile
    const paceSecondsPerMile = paceSecondsPerKm * 1.60934;
    const paceMinPerMile = Math.floor(paceSecondsPerMile / 60);
    const paceSecPerMile = Math.round(paceSecondsPerMile % 60);

    // Calculate speed
    const speedKmh = (distanceKm / totalSeconds) * 3600;
    const speedMph = speedKmh / 1.60934;

    // Format finish time
    const finishHours = Math.floor(totalSeconds / 3600);
    const finishMinutes = Math.floor((totalSeconds % 3600) / 60);
    const finishSecs = Math.round(totalSeconds % 60);
    const finishTime = finishHours > 0
      ? `${finishHours}:${finishMinutes.toString().padStart(2, '0')}:${finishSecs.toString().padStart(2, '0')}`
      : `${finishMinutes}:${finishSecs.toString().padStart(2, '0')}`;

    // Calculate splits
    const splits: { distance: number; time: string }[] = [];
    const splitDistances = unit === 'km' ? [1, 5, 10, 21.0975, 42.195] : [1, 3.1, 6.2, 13.1, 26.2];
    
    for (const splitDist of splitDistances) {
      const splitDistKm = unit === 'km' ? splitDist : splitDist * 1.60934;
      if (splitDistKm <= distanceKm) {
        const splitSeconds = paceSecondsPerKm * splitDistKm;
        const splitH = Math.floor(splitSeconds / 3600);
        const splitM = Math.floor((splitSeconds % 3600) / 60);
        const splitS = Math.round(splitSeconds % 60);
        const splitTime = splitH > 0
          ? `${splitH}:${splitM.toString().padStart(2, '0')}:${splitS.toString().padStart(2, '0')}`
          : `${splitM}:${splitS.toString().padStart(2, '0')}`;
        splits.push({ distance: splitDist, time: splitTime });
      }
    }

    return {
      pacePerKm: `${paceMinPerKm}:${paceSecPerKm.toString().padStart(2, '0')}`,
      pacePerMile: `${paceMinPerMile}:${paceSecPerMile.toString().padStart(2, '0')}`,
      speedKmh: Math.round(speedKmh * 10) / 10,
      speedMph: Math.round(speedMph * 10) / 10,
      finishTime,
      splits,
    };
  });

  // Functions
  function setCommonDistance(km: number) {
    const dist = unit === 'km' ? km : km / 1.60934;
    distance = dist.toFixed(2);
  }

</script>


    <div class="space-y-6">
      <!-- Mode Selection -->
      <div class="flex flex-wrap gap-2">
        <button
          onclick={() => mode = 'pace'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'pace'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculatePace')}
        </button>
        <button
          onclick={() => mode = 'time'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'time'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculateTime')}
        </button>
        <button
          onclick={() => mode = 'distance'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'distance'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculateDistance')}
        </button>
      </div>

      <!-- Unit Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => unit = 'km'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'km'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('kilometers')}
        </button>
        <button
          onclick={() => unit = 'mi'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'mi'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('miles')}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Distance Input -->
        {#if mode !== 'distance'}
<div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Route class="w-4 h-4" />
              {t('distance')} ({unit})
            </label>
            <input
              type="number"
              bind:value={distance}
              min="0"
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <div class="flex flex-wrap gap-2">
              {#each COMMON_DISTANCES as d (d.name)}
<button 
                  onclick={() => commonDistance = d.km}
                  class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {d.name}
                </button>
{/each}
            </div>
          </div>
{/if}

        <!-- Time Input -->
        {#if mode !== 'time'}
<div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Timer class="w-4 h-4" />
              {t('time')}
            </label>
            <div class="flex gap-2">
              <div class="flex-1">
                <input
                  type="number"
                  bind:value={hours}
                  min="0"
                  placeholder={t('hoursShort')}
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div class="text-xs text-center text-gray-500 mt-1">{t('hours')}</div>
              </div>
              <div class="flex-1">
                <input
                  type="number"
                  bind:value={minutes}
                  min="0"
                  max="59"
                  placeholder={t('minutesShort')}
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div class="text-xs text-center text-gray-500 mt-1">{t('minutes')}</div>
              </div>
              <div class="flex-1">
                <input
                  type="number"
                  bind:value={seconds}
                  min="0"
                  max="59"
                  placeholder={t('secondsShort')}
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div class="text-xs text-center text-gray-500 mt-1">{t('seconds')}</div>
              </div>
            </div>
          </div>
{/if}

        <!-- Pace Input -->
        {#if mode !== 'pace'}
<div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calculator class="w-4 h-4" />
              {t('pace')} (/{unit})
            </label>
            <div class="flex gap-2">
              <div class="flex-1">
                <input
                  type="number"
                  bind:value={paceMinutes}
                  min="0"
                  placeholder={t('minutesShort')}
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div class="text-xs text-center text-gray-500 mt-1">{t('minutes')}</div>
              </div>
              <div class="flex-1">
                <input
                  type="number"
                  bind:value={paceSeconds}
                  min="0"
                  max="59"
                  placeholder={t('secondsShort')}
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
                />
                <div class="text-xs text-center text-gray-500 mt-1">{t('seconds')}</div>
              </div>
            </div>
          </div>
{/if}
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- Main Results -->
          <div class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('pacePerKm')}</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{result.pacePerKm}</div>
                <div class="text-xs text-gray-500">min/km</div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('pacePerMile')}</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{result.pacePerMile}</div>
                <div class="text-xs text-gray-500">min/mi</div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('speed')}</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{result.speedKmh}</div>
                <div class="text-xs text-gray-500">km/h</div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('finishTime')}</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{result.finishTime}</div>
              </div>
            </div>
          </div>

          <!-- Splits -->
          {#if result.splits.length > 0}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('splits')}</h3>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
                {#each result.splits as split, index (index)}
<div  class="p-2 bg-white dark:bg-gray-700 rounded text-center">
                    <div class="text-sm text-gray-500">{split.distance} {unit}</div>
                    <div class="font-medium text-gray-900 dark:text-white">{split.time}</div>
                  </div>
{/each}
              </div>
            </div>
{/if}
        </div>
{/if}
    </div>
  
