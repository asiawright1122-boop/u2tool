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
  type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

  let workDuration = $state(25);

  let shortBreakDuration = $state(5);

  let longBreakDuration = $state(15);

  let sessionsBeforeLongBreak = $state(4);

  let soundEnabled = $state(true);

  let isRunning = $state(false);

  let currentPhase = $state('work');

  let timeRemaining = $state(workDuration * 60);

  let completedSessions = $state(0);

  let showSettings = $state(false);

  let audioRef = $state(null);

  function playNotification() {
    if (soundEnabled && audioRef) {
      audioRef.play().catch(() => {});
    }
  }

  function getDurationForPhase(phase: TimerPhase) {
    switch (phase) {
      case 'work': return workDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
    }
  }

  function handleSessionComplete() {
    playNotification();
    
    if (currentPhase === 'work') {
      const newCompletedSessions = completedSessions + 1;
      completedSessions = newCompletedSessions;
      
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        currentPhase = 'longBreak';
        timeRemaining = longBreakDuration * 60;
      } else {
        currentPhase = 'shortBreak';
        timeRemaining = shortBreakDuration * 60;
      }
    } else {
      currentPhase = 'work';
      timeRemaining = workDuration * 60;
    }
    isRunning = false;
  }

  $effect(() => {
    audioRef = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAA');
  });

  $effect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        timeRemaining = timeRemaining - 1;
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  });

  // Functions
  function toggleTimer() { return isRunning = !isRunning; }
  function resetTimer() {
    isRunning = false;
    timeRemaining = getDurationForPhase(currentPhase);
  }
  function skipPhase() {
    isRunning = false;
    if (currentPhase === 'work') {
      const newCompletedSessions = completedSessions + 1;
      completedSessions = newCompletedSessions;
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        currentPhase = 'longBreak';
        timeRemaining = longBreakDuration * 60;
      } else {
        currentPhase = 'shortBreak';
        timeRemaining = shortBreakDuration * 60;
      }
    } else {
      currentPhase = 'work';
      timeRemaining = workDuration * 60;
    }
  }
  function switchPhase(phase: TimerPhase) {
    isRunning = false;
    currentPhase = phase;
    timeRemaining = getDurationForPhase(phase);
  }
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  const progress = 1 - (timeRemaining / getDurationForPhase(currentPhase));
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);
  const phaseColors = {
    work: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', stroke: '#ef4444' },
    shortBreak: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', stroke: '#22c55e' },
    longBreak: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', stroke: '#3b82f6' },
  };

</script>


    <div class="space-y-6">
      <!-- Phase Tabs -->
      <div class="flex justify-center gap-2">
        {#each (['work', 'shortBreak', 'longBreak'] as TimerPhase[]) as phase (phase)}
<button 
            onclick={() => switchPhase(phase)}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPhase === phase
                ? `${phaseColors[phase].bg} ${phaseColors[phase].text}`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t(`pomodoro.${phase}`)}
          </button>
{/each}
      </div>

      <!-- Timer Display -->
      <div class={`${phaseColors[currentPhase].bg} rounded-2xl p-8 flex flex-col items-center`}>
        <div class="relative w-64 h-64">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" stroke-width="8" class="text-gray-200 dark:text-gray-700"></circle>
            <circle cx="128" cy="128" r="120" fill="none" stroke={phaseColors[currentPhase].stroke} stroke-width="8"
              stroke-linecap="round" stroke-dasharray={circumference} stroke-dashoffset={strokeDashoffset}
              class="transition-all duration-1000"></circle>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class={`text-5xl font-bold ${phaseColors[currentPhase].text}`}>{formatTime(timeRemaining)}</span>
            <span class="text-gray-500 dark:text-gray-400 mt-2">{t(`pomodoro.${currentPhase}`)}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex gap-3 mt-6">
          <button onclick={toggleTimer}
            class={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-emerald-500'
            }`}>
            {isRunning ? t('pomodoro.pause') : t('pomodoro.start')}
          </button>
          <button onclick={resetTimer} class="px-6 py-3 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            {t('pomodoro.reset')}
          </button>
          <button onclick={skipPhase} class="px-6 py-3 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            {t('pomodoro.skip')}
          </button>
        </div>
      </div>

      <!-- Session Counter -->
      <div class="flex justify-center items-center gap-4">
        <span class="text-gray-600 dark:text-gray-400">{t('pomodoro.completedSessions')}:</span>
        <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedSessions}</span>
        <button onclick={() => completedSessions = 0} class="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          {t('clear')}
        </button>
      </div>

      <!-- Settings Toggle -->
      <div class="flex justify-center">
        <button onclick={() => showSettings = !showSettings}
          class="text-amber-600 dark:text-amber-400 hover:underline">
          {showSettings ? t('pomodoro.hideSettings') : t('pomodoro.showSettings')}
        </button>
      </div>

      <!-- Settings Panel -->
      {#if showSettings}
<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-4">{t('pomodoro.settings')}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1" for="pomodoro-work-duration">{t('pomodoro.workDuration')} ({t('pomodoro.minutes')})</label>
              <input type="number" id="pomodoro-work-duration" name="workDuration" min="1" max="60" bind:value={workDuration}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1" for="pomodoro-short-break">{t('pomodoro.shortBreakDuration')} ({t('pomodoro.minutes')})</label>
              <input type="number" id="pomodoro-short-break" name="shortBreakDuration" min="1" max="30" bind:value={shortBreakDuration}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1" for="pomodoro-long-break">{t('pomodoro.longBreakDuration')} ({t('pomodoro.minutes')})</label>
              <input type="number" id="pomodoro-long-break" name="longBreakDuration" min="1" max="60" bind:value={longBreakDuration}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1" for="pomodoro-sessions">{t('pomodoro.sessionsBeforeLongBreak')}</label>
              <input type="number" id="pomodoro-sessions" name="sessionsBeforeLongBreak" min="1" max="10" bind:value={sessionsBeforeLongBreak}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="soundEnabled" name="soundEnabled" bind:checked={soundEnabled} class="w-4 h-4" />
            <label for="soundEnabled" class="text-sm text-gray-600 dark:text-gray-400">{t('pomodoro.soundNotification')}</label>
          </div>
        </div>
{/if}
    </div>
  
