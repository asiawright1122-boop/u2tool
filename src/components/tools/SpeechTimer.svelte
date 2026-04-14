<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['speech-timer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.speech-timer.${key}`;
  }

  let targetMinutes = $state(5);

  let elapsedSeconds = $state(0);

  let isRunning = $state(false);

  let wordsPerMinute = $state(150);

  let intervalRef = $state(null);

  $effect(() => {
    if (isRunning) {
      intervalRef = setInterval(() => {
        elapsedSeconds = elapsedSeconds + 1;
      }, 1000);
    } else if (intervalRef) {
      clearInterval(intervalRef);
    }
    return () => {
      if (intervalRef) clearInterval(intervalRef);
    };
  });

  // Functions
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  const targetSeconds = targetMinutes * 60;
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100);
  const remainingSeconds = Math.max(targetSeconds - elapsedSeconds, 0);
  const estimatedWords = Math.round((elapsedSeconds / 60) * wordsPerMinute);
  function getProgressColor() {
    if (progress < 80) return 'bg-green-500';
    if (progress < 100) return 'bg-yellow-500';
    return 'bg-red-500';
  }
  function reset() {
    isRunning = false;
    elapsedSeconds = 0;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('targetDuration')} ({t('minutes')})
          </label>
          <input
            type="number"
            value={targetMinutes}
            onchange={(e) => targetMinutes = Math.max(1, parseInt(e.target.value) || 1)}
            min="1"
            max="120"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={isRunning}
          />
        </div>
        <div>
          <label class="tool-label">
            {t('wordsPerMinute')}
          </label>
          <input
            type="number"
            value={wordsPerMinute}
            onchange={(e) => wordsPerMinute = Math.max(50, parseInt(e.target.value) || 150)}
            min="50"
            max="300"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="p-8 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
        <div class="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-4">
          {formatTime(elapsedSeconds)}
        </div>
        <div class="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {t('remaining')}: {formatTime(remainingSeconds)}
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
          <div
            class={`h-4 rounded-full transition-all duration-300 ${getProgressColor()}`}
            style="width: {progress}%"></div>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {t('estimatedWords')}: ~{estimatedWords} {t('words')}
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          onclick={() => isRunning = !isRunning}
          class={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:btn-success'
          }`}
        >
          {isRunning ? t('pause') : t('start')}
        </button>
        <button
          onclick={reset}
          class="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
        >
          {t('reset')}
        </button>
      </div>

      <div class="grid grid-cols-3 gap-4 text-center">
        {#each [3, 5, 10] as mins (mins)}
<button 
            onclick={() => { targetMinutes = mins; reset(); }}
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="text-lg font-medium text-gray-900 dark:text-white">{mins} {t('min')}</div>
            <div class="text-sm text-gray-500">~{mins * wordsPerMinute} {t('words')}</div>
          </button>
{/each}
      </div>
    </div>
  
