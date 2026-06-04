<script lang="ts">
  import { onMount } from 'svelte';

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
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

  // Config States
  let workDuration = $state(25);
  let shortBreakDuration = $state(5);
  let longBreakDuration = $state(15);
  let sessionsBeforeLongBreak = $state(4);
  let soundEnabled = $state(true);

  // Runtime States
  let isRunning = $state(false);
  let currentPhase = $state<TimerPhase>('work');
  let timeRemaining = $state(25 * 60);
  let completedSessions = $state(0);
  let showSettings = $state(false);

  // Svelte 5 Derived States
  const currentPhaseDuration = $derived(getDurationForPhase(currentPhase));
  const progress = $derived(1 - (timeRemaining / currentPhaseDuration));
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = $derived(circumference * (1 - progress));

  const phaseColors = {
    work: { bg: 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30', text: 'text-red-600 dark:text-red-400', stroke: '#ef4444' },
    shortBreak: { bg: 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30', text: 'text-green-600 dark:text-green-400', stroke: '#22c55e' },
    longBreak: { bg: 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30', text: 'text-blue-600 dark:text-blue-400', stroke: '#3b82f6' },
  };

  // Web Audio Synthesizer to avoid broken/missing static sound files
  let audioCtx: AudioContext | null = null;
  function playBeep() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Web Audio Playback failed:', e);
    }
  }

  function getDurationForPhase(phase: TimerPhase): number {
    switch (phase) {
      case 'work': return workDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
    }
  }

  function handleSessionComplete() {
    playBeep();
    isRunning = false;

    if (currentPhase === 'work') {
      completedSessions += 1;
      if (completedSessions % sessionsBeforeLongBreak === 0) {
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

  // Svelte 5 Effect to handle Timer interval side-effects
  $effect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (timeRemaining > 0) {
          timeRemaining -= 1;
        } else {
          handleSessionComplete();
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  // Load / Save States
  let isMounted = $state(false);
  onMount(() => {
    isMounted = true;
    try {
      const saved = localStorage.getItem('u2tool_pomodoro_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.workDuration !== undefined) workDuration = data.workDuration;
        if (data.shortBreakDuration !== undefined) shortBreakDuration = data.shortBreakDuration;
        if (data.longBreakDuration !== undefined) longBreakDuration = data.longBreakDuration;
        if (data.sessionsBeforeLongBreak !== undefined) sessionsBeforeLongBreak = data.sessionsBeforeLongBreak;
        if (data.soundEnabled !== undefined) soundEnabled = data.soundEnabled;
        if (data.completedSessions !== undefined) completedSessions = data.completedSessions;
        
        // Reset remaining time based on loaded configuration
        timeRemaining = getDurationForPhase(currentPhase);
      }
    } catch (e) {
      console.error('Failed to load Pomodoro configuration:', e);
    }
  });

  $effect(() => {
    if (!isMounted) return;
    try {
      const data = {
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        sessionsBeforeLongBreak,
        soundEnabled,
        completedSessions
      };
      localStorage.setItem('u2tool_pomodoro_data', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save Pomodoro state:', e);
    }
  });

  // Actions
  function toggleTimer() {
    isRunning = !isRunning;
  }

  function resetTimer() {
    isRunning = false;
    timeRemaining = getDurationForPhase(currentPhase);
  }

  function skipPhase() {
    isRunning = false;
    if (currentPhase === 'work') {
      completedSessions += 1;
      if (completedSessions % sessionsBeforeLongBreak === 0) {
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
</script>

<div class="space-y-6 max-w-lg mx-auto">
  <!-- Phase Tabs -->
  <div class="flex justify-center gap-2 bg-gray-100 dark:bg-gray-800/60 p-1.5 rounded-xl border border-gray-200/60 dark:border-gray-700/40">
    {#each (['work', 'shortBreak', 'longBreak'] as TimerPhase[]) as phase (phase)}
      <button onclick={() => switchPhase(phase)}
        class="flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
        class:bg-white={currentPhase === phase}
        class:dark:bg-gray-700={currentPhase === phase}
        class:text-gray-900={currentPhase === phase}
        class:dark:text-white={currentPhase === phase}
        class:shadow-sm={currentPhase === phase}
        class:text-gray-500={currentPhase !== phase}
        class:dark:text-gray-400={currentPhase !== phase}
        class:hover:text-gray-700={currentPhase !== phase}
        class:dark:hover:text-gray-200={currentPhase !== phase}>
        {t(`pomodoro.${phase}`)}
      </button>
    {/each}
  </div>

  <!-- Timer Display -->
  <div class="flex flex-col items-center p-8 rounded-3xl border {phaseColors[currentPhase].bg}">
    <div class="relative w-64 h-64">
      <svg class="w-full h-full transform -rotate-90">
        <!-- Trail -->
        <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" stroke-width="6"
          class="text-gray-200/60 dark:text-gray-800/40"></circle>
        <!-- Circle Progress -->
        <circle cx="128" cy="128" r="120" fill="none"
          stroke={phaseColors[currentPhase].stroke} stroke-width="6"
          stroke-linecap="round"
          stroke-dasharray={circumference}
          stroke-dashoffset={strokeDashoffset}
          class="transition-all duration-300"></circle>
      </svg>
      <!-- Label Inside -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-5xl font-bold tracking-tighter text-gray-900 dark:text-white tabular-nums select-all">
          {formatTime(timeRemaining)}
        </span>
        <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mt-2">
          {t(`pomodoro.${currentPhase}`)}
        </span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-3 mt-8 w-full">
      <button onclick={toggleTimer}
        class="flex-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-colors shadow-sm text-sm"
        class:bg-amber-600={isRunning}
        class:hover:bg-amber-700={isRunning}
        class:bg-green-600={!isRunning}
        class:hover:bg-green-700={!isRunning}>
        {isRunning ? t('pomodoro.pause') : t('pomodoro.start')}
      </button>
      <button onclick={resetTimer}
        class="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
        {t('pomodoro.reset')}
      </button>
      <button onclick={skipPhase}
        class="flex-1 px-4 py-2.5 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
        {t('pomodoro.skip')}
      </button>
    </div>
  </div>

  <!-- Session Counter -->
  <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 px-5 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-800/40 text-sm">
    <div class="flex items-center gap-2">
      <span class="text-gray-500 dark:text-gray-400">{t('pomodoro.completedSessions')}:</span>
      <span class="text-lg font-bold text-gray-900 dark:text-white">{completedSessions}</span>
    </div>
    <button onclick={() => completedSessions = 0}
      class="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors">
      {t('clear')}
    </button>
  </div>

  <!-- Settings Toggle -->
  <div class="flex justify-center">
    <button onclick={() => showSettings = !showSettings}
      class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline uppercase tracking-wider">
      {showSettings ? t('pomodoro.hideSettings') : t('pomodoro.showSettings')}
    </button>
  </div>

  <!-- Settings Panel -->
  {#if showSettings}
    <div class="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/50 space-y-4">
      <h3 class="font-bold text-base text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/60 pb-2">
        {t('pomodoro.settings')}
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" for="work-duration">
            {t('pomodoro.workDuration')} ({t('pomodoro.minutes')})
          </label>
          <input type="number" id="work-duration" min="1" max="60" bind:value={workDuration}
            onchange={() => { if (currentPhase === 'work') timeRemaining = workDuration * 60; }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" for="short-break">
            {t('pomodoro.shortBreakDuration')} ({t('pomodoro.minutes')})
          </label>
          <input type="number" id="short-break" min="1" max="30" bind:value={shortBreakDuration}
            onchange={() => { if (currentPhase === 'shortBreak') timeRemaining = shortBreakDuration * 60; }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" for="long-break">
            {t('pomodoro.longBreakDuration')} ({t('pomodoro.minutes')})
          </label>
          <input type="number" id="long-break" min="1" max="60" bind:value={longBreakDuration}
            onchange={() => { if (currentPhase === 'longBreak') timeRemaining = longBreakDuration * 60; }}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1" for="sessions">
            {t('pomodoro.sessionsBeforeLongBreak')}
          </label>
          <input type="number" id="sessions" min="1" max="10" bind:value={sessionsBeforeLongBreak}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-sm" />
        </div>
      </div>
      <label class="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 cursor-pointer select-none">
        <input type="checkbox" bind:checked={soundEnabled}
          class="w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500" />
        {t('pomodoro.soundNotification')}
      </label>
    </div>
  {/if}
</div>
