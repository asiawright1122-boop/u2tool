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
  interface Preset {
  name: string;
  seconds: number;
}

  let hours = $state(0);

  let minutes = $state(5);

  let seconds = $state(0);

  let timeLeft = $state(0);

  let isRunning = $state(false);

  let isFinished = $state(false);

  let intervalRef = $state(null);

  let audioRef = $state(null);

  function playAlarm() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          new Notification(t('countdownTimer.timeUp'), { body: t('countdownTimer.timerFinished') });
        }
      });
    }
  }

  $effect(() => {
    if (typeof window !== 'undefined') {
      audioRef = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    }
  });

  $effect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef = setInterval(() => {
        if (timeLeft <= 1) {
          isRunning = false;
          isFinished = true;
          playAlarm();
          timeLeft = 0;
        } else {
          timeLeft = timeLeft - 1;
        }
      }, 1000);
    }
    return () => {
      if (intervalRef) clearInterval(intervalRef);
    };
  });

  // Functions
  function formatDisplay(totalSeconds: number) {
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  function handleStart() {
    if (!isRunning && timeLeft === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total > 0) {
        timeLeft = total;
        isFinished = false;
        isRunning = true;
      }
    } else if (!isRunning && timeLeft > 0) {
      isRunning = true;
    }
  }
  function handlePause() { return isRunning = false; }
  function handleReset() {
    isRunning = false;
    timeLeft = 0;
    isFinished = false;
  }
  function handlePreset(preset: Preset) {
    h = Math.floor(preset.seconds / 3600);
    m = Math.floor((preset.seconds % 3600) / 60);
    s = preset.seconds % 60;
    hours = h;
    minutes = m;
    seconds = s;
    timeLeft = preset.seconds;
    isFinished = false;
  }
  const progress = timeLeft > 0 ? (timeLeft / (hours * 3600 + minutes * 60 + seconds)) * 100 : 0;

</script>


    <div class="space-y-6">
      {#if !isRunning}
timeLeft === 0 && !isFinished && (
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2 justify-center">
            {#each PRESETS as preset (preset.name)}
<button 
                onclick={() => handlePreset(preset)}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {preset.name}
              </button>
{/each}
          </div>
          <div class="flex justify-center gap-4">
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('countdownTimer.hours')}</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onchange={(e) => hours = Math.min(23, Math.max(0, parseInt(e.target.value) || 0))}
                class="w-20 px-3 py-2 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <span class="text-4xl font-bold self-end pb-2">:</span>
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('countdownTimer.minutes')}</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onchange={(e) => minutes = Math.min(59, Math.max(0, parseInt(e.target.value) || 0))}
                class="w-20 px-3 py-2 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
            <span class="text-4xl font-bold self-end pb-2">:</span>
            <div class="text-center">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('countdownTimer.seconds')}</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onchange={(e) => seconds = Math.min(59, Math.max(0, parseInt(e.target.value) || 0))}
                class="w-20 px-3 py-2 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      )
{/if}

      {#if isRunning || timeLeft > 0 || isFinished}
<div class="text-center py-8">
          <div class="relative inline-block">
            <svg class="w-64 h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="currentColor" stroke-width="8" fill="none" class="text-gray-200 dark:text-gray-700"></circle>
              <circle
                cx="128" cy="128" r="120"
                stroke="currentColor" stroke-width="8" fill="none"
                class={isFinished ? 'text-red-500' : 'text-blue-500'}
                stroke-dasharray={2 * Math.PI * 120}
                stroke-dashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                stroke-linecap="round"></circle>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class={`text-5xl font-mono font-bold ${isFinished ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>
                {formatDisplay(timeLeft)}
              </span>
            </div>
          </div>
          {#if isFinished}
<div class="mt-4 text-2xl font-bold text-red-500 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> {t('countdownTimer.timeUp')}!
            </div>
{/if}
        </div>
{/if}

      <div class="flex justify-center gap-4">
        {#if !isRunning}
<button
            onclick={handleStart}
            disabled={hours === 0 && minutes === 0 && seconds === 0 && timeLeft === 0}
            class="px-8 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {timeLeft > 0 ? t('countdownTimer.resume') : t('countdownTimer.start')}
          </button>
{:else}
<button
            onclick={handlePause}
            class="px-8 py-3 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 min-w-[120px]"
          >
            {t('countdownTimer.pause')}
          </button>
{/if}
        <button
          onclick={handleReset}
          disabled={timeLeft === 0 && !isFinished}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {t('countdownTimer.reset')}
        </button>
      </div>
    </div>
  
