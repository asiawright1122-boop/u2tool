<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import {
    buildLocalTypingTarget,
    calculateTimedTypingResult,
    clampTimedTypingElapsedMs,
    MAX_TIMED_TYPING_CHARACTERS,
    readTypingHistory,
    truncateTimedTypingText,
    writeTypingHistory,
    type TimedTypingResult,
    type TypingDuration,
    type TypingHistoryEntry,
  } from '@/lib/typing-speed-test';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  type Difficulty = 'easy' | 'medium' | 'hard';

  const durations: readonly TypingDuration[] = [15, 30, 60, 120];
  const targetContinuationBuffer = 600;

  let { locale, translations }: Props = $props();
  let difficulty = $state<Difficulty>('medium');
  let duration = $state<TypingDuration>(30);
  let targetText = $state('');
  let typedText = $state('');
  let isStarted = $state(false);
  let isFinished = $state(false);
  let startTime = $state(0);
  let activeDeadline = $state(0);
  let remainingSeconds = $state<number>(duration);
  let result = $state<TimedTypingResult | null>(null);
  let history = $state<TypingHistoryEntry[]>([]);
  let inputRef = $state<HTMLTextAreaElement | null>(null);
  let timer: ReturnType<typeof setInterval> | null = null;
  let promptSequence: string[] = [];
  let intervalCorrectCharCounts: number[] = [];
  let lastRecordedCorrectChars = 0;

  let sampleTexts = $derived({
    easy: [
      t('sampleTexts.easy.0'),
      t('sampleTexts.easy.1'),
      t('sampleTexts.easy.2'),
    ],
    medium: [
      t('sampleTexts.medium.0'),
      t('sampleTexts.medium.1'),
      t('sampleTexts.medium.2'),
    ],
    hard: [
      t('sampleTexts.hard.0'),
      t('sampleTexts.hard.1'),
      t('sampleTexts.hard.2'),
    ],
  });
  let targetChars = $derived(Array.from(targetText));
  let typedChars = $derived(Array.from(typedText));

  function t(key: string): string {
    const tools = translations['tools'] as Record<string, unknown> | undefined;
    const scope = tools?.['typing-speed-test'] as Record<string, unknown> | undefined;
    let value: unknown = scope;
    for (const segment of key.split('.')) {
      value = (value as Record<string, unknown> | undefined)?.[segment];
    }
    return typeof value === 'string'
      ? value
      : `MISSING: tools.typing-speed-test.${key}`;
  }

  function randomPromptSequence(): string[] {
    const prompts = sampleTexts[difficulty];
    const startIndex = Math.floor(Math.random() * prompts.length);
    return [...prompts.slice(startIndex), ...prompts.slice(0, startIndex)];
  }

  function resetTypingTarget(): void {
    promptSequence = randomPromptSequence();
    targetText = buildLocalTypingTarget(promptSequence, targetContinuationBuffer);
  }

  function extendTypingTarget(typedCharacterCount: number): void {
    const minimumTargetLength = typedCharacterCount + targetContinuationBuffer;
    if (targetChars.length < minimumTargetLength) {
      targetText = buildLocalTypingTarget(promptSequence, minimumTargetLength);
    }
  }

  function countCorrectCharacters(): number {
    return typedChars.reduce(
      (count, character, index) => count + (character === targetChars[index] ? 1 : 0),
      0,
    );
  }

  function clearTimer(): void {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function recordInterval(): void {
    const currentCorrectChars = countCorrectCharacters();
    const intervalCount = Math.max(0, currentCorrectChars - lastRecordedCorrectChars);
    intervalCorrectCharCounts.push(intervalCount);
    lastRecordedCorrectChars = currentCorrectChars;
  }

  function finishTest(): void {
    if (!isStarted || isFinished) return;

    recordInterval();
    clearTimer();
    remainingSeconds = 0;
    const elapsedMs = Math.max(1, clampTimedTypingElapsedMs({
      duration,
      startedAt: startTime,
      finishedAt: Date.now(),
    }));
    result = calculateTimedTypingResult({
      targetText,
      typedText,
      elapsedMs,
      intervalCorrectCharCounts,
    });
    isFinished = true;

    const entry: TypingHistoryEntry = {
      ...result,
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      locale,
      duration,
      completedAt: new Date().toISOString(),
    };
    const nextHistory = [entry, ...history];
    try {
      writeTypingHistory(window.localStorage, nextHistory);
      history = readTypingHistory(window.localStorage);
    } catch {
      history = nextHistory.slice(0, 20);
    }
  }

  function beginTimer(): void {
    isStarted = true;
    startTime = Date.now();
    activeDeadline = startTime + duration * 1000;
    remainingSeconds = duration;
    timer = setInterval(() => {
      recordInterval();
      remainingSeconds = Math.max(
        0,
        Math.ceil((activeDeadline - Date.now()) / 1000),
      );
      if (remainingSeconds === 0) finishTest();
    }, 1000);
  }

  function restartTest(): void {
    clearTimer();
    resetTypingTarget();
    typedText = '';
    isStarted = false;
    isFinished = false;
    startTime = 0;
    activeDeadline = 0;
    remainingSeconds = duration;
    result = null;
    intervalCorrectCharCounts = [];
    lastRecordedCorrectChars = 0;
    inputRef?.focus();
  }

  function selectDifficulty(nextDifficulty: Difficulty): void {
    difficulty = nextDifficulty;
    restartTest();
  }

  function selectDuration(nextDuration: TypingDuration): void {
    duration = nextDuration;
    restartTest();
  }

  function handleInputEvent(event: Event): void {
    const input = event.currentTarget as HTMLTextAreaElement;
    const boundedTypedText = truncateTimedTypingText(input.value);
    input.value = boundedTypedText;
    if (isFinished) return;
    if (isStarted && activeDeadline > 0 && Date.now() >= activeDeadline) {
      input.value = typedText;
      finishTest();
      return;
    }
    const typedCharacterCount = Array.from(boundedTypedText).length;
    typedText = boundedTypedText;
    extendTypingTarget(typedCharacterCount);
    if (!isStarted && typedCharacterCount > 0) beginTimer();
  }

  onMount(() => {
    resetTypingTarget();
    history = readTypingHistory(window.localStorage);
  });
  onDestroy(clearTimer);
</script>

{#snippet renderPrompt()}
  {#each targetChars as character, index (index)}
    <span
      class={index < typedChars.length
        ? typedChars[index] === character
          ? 'text-green-600 dark:text-green-400'
          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
        : index === typedChars.length
          ? 'bg-amber-200 text-gray-900 dark:bg-amber-800 dark:text-white'
          : 'text-gray-400'}
    >{character}</span>
  {/each}
{/snippet}

<div class="space-y-6">
  <div class="space-y-2">
    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('durationSelector')}</div>
    <div class="flex flex-wrap gap-2" role="group" aria-label={t('durationSelector')}>
      {#each durations as option (option)}
        <button
          type="button"
          data-typing-duration={option}
          aria-pressed={duration === option}
          onclick={() => selectDuration(option)}
          class={`px-4 py-2 rounded-lg transition-colors ${duration === option
            ? 'bg-amber-600 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
        >{t(`duration${option}`)}</button>
      {/each}
    </div>
  </div>

  <div class="flex flex-wrap gap-2" role="group" aria-label={t('difficulty')}>
    {#each (['easy', 'medium', 'hard'] as const) as level (level)}
      <button
        type="button"
        aria-pressed={difficulty === level}
        onclick={() => selectDifficulty(level)}
        class={`px-4 py-2 rounded-lg transition-colors ${difficulty === level
          ? 'bg-amber-600 text-white'
          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
      >{t(level)}</button>
    {/each}
  </div>

  <div class="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
    <div data-typing-prompt class="text-lg font-mono leading-relaxed">{@render renderPrompt()}</div>
    <div data-typing-countdown class="min-w-20 text-center">
      <div class="text-xs text-gray-500 dark:text-gray-400">{t('countdown')}</div>
      <div class="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
        {remainingSeconds}s
      </div>
    </div>
  </div>

  <textarea
    bind:this={inputRef}
    data-typing-input
    value={typedText}
    oninput={handleInputEvent}
    maxlength={MAX_TIMED_TYPING_CHARACTERS}
    disabled={isFinished}
    class="h-24 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
    placeholder={t('startTyping')}
  ></textarea>

  <button
    type="button"
    data-typing-restart
    onclick={restartTest}
    class="w-full rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700"
  >{isFinished ? t('tryAgain') : t('restart')}</button>

  {#if result}
    <section data-typing-result class="space-y-4" aria-label={t('completed')}>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div data-typing-metric="wpm" class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('wpm')}</div>
          <div class="text-2xl font-bold">{result.wpm}</div>
        </div>
        <div data-typing-metric="cpm" class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('cpm')}</div>
          <div class="text-2xl font-bold">{result.cpm}</div>
        </div>
        <div data-typing-metric="accuracy" class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('accuracy')}</div>
          <div class="text-2xl font-bold">{result.accuracy}%</div>
        </div>
        <div data-typing-metric="consistency" class="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('consistency')}</div>
          <div class="text-2xl font-bold">{result.consistency}%</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('correctChars')}</div>
          <div class="text-xl font-bold text-green-600 dark:text-green-400">{result.correctChars}</div>
        </div>
        <div class="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('incorrectChars')}</div>
          <div class="text-xl font-bold text-red-600 dark:text-red-400">{result.incorrectChars}</div>
        </div>
        <div data-typing-elapsed class="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-800">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('duration')}</div>
          <div class="text-xl font-bold">{result.elapsedSeconds.toFixed(1)}s</div>
        </div>
      </div>

      {#if result.errors.length > 0}
        <div class="space-y-2">
          <h3 class="font-semibold">{t('errors')}</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead><tr><th class="p-2">#</th><th class="p-2">{t('expected')}</th><th class="p-2">{t('actual')}</th></tr></thead>
              <tbody>
                {#each result.errors as error (error.index)}
                  <tr data-typing-error class="border-t border-gray-200 dark:border-gray-700">
                    <td class="p-2">{error.index + 1}</td>
                    <td class="p-2 font-mono">{error.expected || ' '}</td>
                    <td class="p-2 font-mono text-red-600 dark:text-red-400">{error.actual || ' '}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </section>
  {/if}

  <section class="space-y-3" aria-labelledby="typing-history-title">
    <div>
      <h3 id="typing-history-title" class="font-semibold">{t('history')}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">{t('historyLocalOnly')}</p>
    </div>
    {#if history.length === 0}
      <p class="text-sm text-gray-600 dark:text-gray-400">{t('historyEmpty')}</p>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead><tr><th class="p-2">{t('duration')}</th><th class="p-2">{t('wpm')}</th><th class="p-2">{t('cpm')}</th><th class="p-2">{t('accuracy')}</th><th class="p-2">{t('consistency')}</th></tr></thead>
          <tbody>
            {#each history as entry (entry.id)}
              <tr data-typing-history-entry class="border-t border-gray-200 dark:border-gray-700">
                <td class="p-2">{entry.duration}s</td>
                <td class="p-2">{entry.wpm}</td>
                <td class="p-2">{entry.cpm}</td>
                <td class="p-2">{entry.accuracy}%</td>
                <td class="p-2">{entry.consistency}%</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</div>
