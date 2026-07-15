export type TypingDuration = 15 | 30 | 60 | 120;

export interface TypingErrorSummary {
  index: number;
  expected: string;
  actual: string;
}

export interface TimedTypingResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  elapsedSeconds: number;
  errors: TypingErrorSummary[];
}

export interface TypingHistoryEntry extends TimedTypingResult {
  id: string;
  locale: string;
  duration: TypingDuration;
  completedAt: string;
}

const TYPING_HISTORY_STORAGE_KEY = 'u2tool:typing-speed-test:history';
const TYPING_DURATIONS: readonly TypingDuration[] = [15, 30, 60, 120];

// 250 WPM × 5 characters × 2 minutes = 2,500 characters, plus 20% headroom.
export const MAX_TIMED_TYPING_CHARACTERS = 3_000;

function takeTypingCharacterPrefix(
  value: string,
  maximumCharacters = MAX_TIMED_TYPING_CHARACTERS,
): string[] {
  const characters: string[] = [];
  for (const character of value) {
    if (characters.length >= maximumCharacters) break;
    characters.push(character);
  }
  return characters;
}

export function truncateTimedTypingText(value: string): string {
  return takeTypingCharacterPrefix(value).join('');
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isTypingErrorSummary(value: unknown): value is TypingErrorSummary {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const error = value as Record<string, unknown>;
  return Number.isInteger(error.index)
    && (error.index as number) >= 0
    && typeof error.expected === 'string'
    && typeof error.actual === 'string';
}

function isTypingHistoryEntry(value: unknown): value is TypingHistoryEntry {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return typeof entry.id === 'string'
    && entry.id.length > 0
    && typeof entry.locale === 'string'
    && entry.locale.length > 0
    && TYPING_DURATIONS.includes(entry.duration as TypingDuration)
    && typeof entry.completedAt === 'string'
    && Number.isFinite(Date.parse(entry.completedAt))
    && isFiniteNumber(entry.wpm)
    && entry.wpm >= 0
    && isFiniteNumber(entry.cpm)
    && entry.cpm >= 0
    && isFiniteNumber(entry.accuracy)
    && entry.accuracy >= 0
    && entry.accuracy <= 100
    && isFiniteNumber(entry.consistency)
    && entry.consistency >= 0
    && entry.consistency <= 100
    && isFiniteNumber(entry.correctChars)
    && entry.correctChars >= 0
    && isFiniteNumber(entry.incorrectChars)
    && entry.incorrectChars >= 0
    && isFiniteNumber(entry.elapsedSeconds)
    && entry.elapsedSeconds >= 0
    && Array.isArray(entry.errors)
    && entry.errors.every(isTypingErrorSummary);
}

function latestValidHistory(entries: readonly unknown[]): TypingHistoryEntry[] {
  return entries
    .filter(isTypingHistoryEntry)
    .sort(
      (left, right) => Date.parse(right.completedAt) - Date.parse(left.completedAt),
    )
    .slice(0, 20);
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildLocalTypingTarget(
  prompts: readonly string[],
  minimumCharacters: number,
): string {
  const usablePrompts = prompts
    .map((prompt) => truncateTimedTypingText(prompt).trim())
    .filter((prompt) => prompt.length > 0);
  const requiredCharacters = Number.isFinite(minimumCharacters)
    ? Math.min(
        MAX_TIMED_TYPING_CHARACTERS,
        Math.max(0, Math.ceil(minimumCharacters)),
      )
    : 0;
  if (usablePrompts.length === 0 || requiredCharacters === 0) {
    return '';
  }

  const targetCharacters: string[] = [];
  let promptIndex = 0;
  while (targetCharacters.length < requiredCharacters) {
    const prompt = usablePrompts[promptIndex % usablePrompts.length];
    if (targetCharacters.length > 0) {
      targetCharacters.push(' ');
    }
    for (const character of prompt) {
      if (targetCharacters.length >= requiredCharacters) break;
      targetCharacters.push(character);
    }
    promptIndex += 1;
  }

  return targetCharacters.join('');
}

export function clampTimedTypingElapsedMs(input: {
  duration: TypingDuration;
  startedAt: number;
  finishedAt: number;
}): number {
  const durationMs = input.duration * 1000;
  const observedElapsedMs = Number.isFinite(input.startedAt)
    && Number.isFinite(input.finishedAt)
    ? Math.max(0, input.finishedAt - input.startedAt)
    : durationMs;

  return Math.min(durationMs, observedElapsedMs);
}

function calculateConsistency(intervalCorrectCharCounts: number[]): number {
  const populatedIntervals = intervalCorrectCharCounts.filter(
    (count) => Number.isFinite(count) && count > 0,
  );
  if (populatedIntervals.length < 2) {
    return 100;
  }

  const mean = populatedIntervals.reduce((sum, count) => sum + count, 0)
    / populatedIntervals.length;
  const variance = populatedIntervals.reduce(
    (sum, count) => sum + (count - mean) ** 2,
    0,
  ) / populatedIntervals.length;
  const coefficientOfVariation = Math.sqrt(variance) / mean;

  return roundToTwo(Math.min(100, Math.max(0, 100 - coefficientOfVariation * 100)));
}

export function calculateTimedTypingResult(input: {
  targetText: string;
  typedText: string;
  elapsedMs: number;
  intervalCorrectCharCounts: number[];
}): TimedTypingResult {
  const targetChars = takeTypingCharacterPrefix(input.targetText);
  const typedChars = takeTypingCharacterPrefix(input.typedText);
  const errors: TypingErrorSummary[] = [];
  let correctChars = 0;

  typedChars.forEach((actual, index) => {
    const expected = targetChars[index] ?? '';
    if (actual === expected) {
      correctChars += 1;
    } else {
      errors.push({ index, expected, actual });
    }
  });

  const incorrectChars = errors.length;
  const safeElapsedMs = Number.isFinite(input.elapsedMs)
    ? Math.max(0, input.elapsedMs)
    : 0;
  const elapsedSeconds = safeElapsedMs / 1000;
  const elapsedMinutes = elapsedSeconds / 60;
  const cpm = elapsedMinutes > 0 ? Math.round(correctChars / elapsedMinutes) : 0;
  const wpm = elapsedMinutes > 0
    ? Math.round((correctChars / 5) / elapsedMinutes)
    : 0;
  const accuracy = typedChars.length > 0
    ? roundToTwo((correctChars / typedChars.length) * 100)
    : 0;

  return {
    wpm,
    cpm,
    accuracy,
    consistency: calculateConsistency(input.intervalCorrectCharCounts),
    correctChars,
    incorrectChars,
    elapsedSeconds,
    errors,
  };
}

export function readTypingHistory(
  storage: Pick<Storage, 'getItem'>,
): TypingHistoryEntry[] {
  try {
    const parsed: unknown = JSON.parse(
      storage.getItem(TYPING_HISTORY_STORAGE_KEY) ?? '[]',
    );
    return Array.isArray(parsed) ? latestValidHistory(parsed) : [];
  } catch {
    return [];
  }
}

export function writeTypingHistory(
  storage: Pick<Storage, 'setItem'>,
  entries: TypingHistoryEntry[],
): void {
  storage.setItem(
    TYPING_HISTORY_STORAGE_KEY,
    JSON.stringify(latestValidHistory(entries)),
  );
}
