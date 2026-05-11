<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Lap {
  id: number;
  time: number;
  diff: number;
}

  let time = $state(0);

  let isRunning = $state(false);

  let laps = $state([]);

  let intervalRef = $state(null);

  let startTimeRef = $state(0);

  let accumulatedTimeRef = $state(0);

  $effect(() => {
    if (isRunning) {
      startTimeRef = Date.now();
      intervalRef = setInterval(() => {
        time = accumulatedTimeRef + (Date.now() - startTimeRef);
      }, 10);
    } else {
      if (intervalRef) {
        clearInterval(intervalRef);
        accumulatedTimeRef = time;
      }
    }
    return () => {
      if (intervalRef) clearInterval(intervalRef);
    };
  });

  // Functions
  function formatTime(ms: number) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }
  function handleStartStop() {
    isRunning = !isRunning;
  }
  function handleReset() {
    isRunning = false;
    time = 0;
    laps = [];
    accumulatedTimeRef = 0;
  }
  function handleLap() {
    if (!isRunning) return;
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const newLap: Lap = {
      id: laps.length + 1,
      time: time,
      diff: time - lastLapTime,
    };
    laps = [newLap, ...laps];
  }
  function getBestWorstLap() {
    if (laps.length < 2) return { best: -1, worst: -1 };
    const diffs = laps.map(l => l.diff);
    return {
      best: Math.min(...diffs),
      worst: Math.max(...diffs),
    };
  }
  const { best, worst } = getBestWorstLap();

</script>


    <div class="space-y-6">
      <div class="text-center py-8">
        <div class="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white tracking-wider">
          {formatTime(time)}
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          onclick={handleLap}
          disabled={!isRunning}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {t('stopwatchUI.lap')}
        </button>
        <button
          onclick={handleStartStop}
          class={`px-8 py-3 rounded-full font-medium min-w-[120px] ${
            isRunning
              ? 'bg-red-500 hover:bg-rose-500 text-white'
              : 'bg-green-500 hover:btn-success'
          }`}
        >
          {isRunning ? t('stopwatchUI.stop') : t('stopwatchUI.start')}
        </button>
        <button
          onclick={handleReset}
          disabled={time === 0}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {t('stopwatchUI.reset')}
        </button>
      </div>

      {#if laps.length > 0}
<div class="mt-8">
          <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {t('stopwatchUI.laps')} ({laps.length})
          </h3>
          <div class="max-h-64 overflow-y-auto">
            <table class="w-full">
              <thead class="sticky top-0 bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-400">{t('stopwatchUI.lapNumber')}</th>
                  <th class="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">{t('stopwatchUI.lapTime')}</th>
                  <th class="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-400">{t('stopwatchUI.totalTime')}</th>
                </tr>
              </thead>
              <tbody>
                {#each laps as lap (lap.id)}
<tr 
                    class={`border-b border-gray-200 dark:border-gray-700 ${
                      lap.diff === best ? 'bg-green-50 dark:bg-green-900/20' :
                      lap.diff === worst ? 'bg-red-50 dark:bg-red-900/20' : ''
                    }`}
                  >
                    <td class="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {t('stopwatchUI.lapLabel')} {lap.id}
                      {#if laps.length > 1 && lap.diff === best}
                        <span class="ml-2 text-green-600 font-bold">BEST</span>
                      {/if}
                      {#if laps.length > 1 && lap.diff === worst}
                        <span class="ml-2 inline-flex text-red-600">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"/><path d="M4.82 7.9 8 10"/><path d="M15.18 7.9 12 10"/><path d="M16.93 10H20a2 2 0 0 1 0 4H2"/></svg>
                        </span>
                      {/if}
                    </td>
                    <td class="px-4 py-2 text-right font-mono text-gray-800 dark:text-gray-200">
                      {formatTime(lap.diff)}
                    </td>
                    <td class="px-4 py-2 text-right font-mono text-gray-600 dark:text-gray-400">
                      {formatTime(lap.time)}
                    </td>
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
        </div>
{/if}
    </div>
  
