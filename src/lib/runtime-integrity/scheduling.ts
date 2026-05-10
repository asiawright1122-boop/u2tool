export interface TimeSlot {
  start: number;
  end: number;
  label?: string;
  source?: string;
}

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const MINUTES_PER_DAY = 24 * 60;

function clampMinutes(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(value)));
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function parseTimeValue(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? clampMinutes(value) : null;
  }

  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return null;

  const match = text.match(/^([+-]?\d{1,2})(?::([0-5]?\d))?\s*(am|pm)?$/);
  if (!match) return null;

  let hours = Number.parseInt(match[1], 10);
  const minutes = match[2] === undefined ? 0 : Number.parseInt(match[2], 10);
  const meridiem = match[3];

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (meridiem === 'pm' ? 12 : 0);
  }

  if (hours === 24 && minutes === 0) return MINUTES_PER_DAY;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function normalizeSlot(value: unknown, source?: string): TimeSlot | null {
  if (!isRecord(value)) return null;

  const start = parseTimeValue(value.start);
  const end = parseTimeValue(value.end);
  if (start === null || end === null || end <= start) return null;

  const label = typeof value.label === 'string' ? value.label : undefined;
  return { start, end, label, source };
}

function getZonedParts(date: Date, timeZone: string): ZonedParts | null {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((part) => [part.type, part.value])
    );

    return {
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour: Number(parts.hour),
      minute: Number(parts.minute),
      second: Number(parts.second),
    };
  } catch {
    return null;
  }
}

function getTimeZoneOffsetMinutes(timeZone: string, date: Date): number | null {
  const parts = getZonedParts(date, timeZone);
  if (!parts) return null;

  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return Math.round((asUtc - date.getTime()) / 60000);
}

function stableDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

export function parseTimeToMinutes(value: unknown = ''): number {
  return parseTimeValue(value) ?? 0;
}

export function formatMinutesToTime(value: unknown = 0): string {
  const safeValue = clampMinutes(Number(value));
  const hours = Math.floor(safeValue / 60);
  const minutes = safeValue % 60;
  return `${pad2(hours)}:${pad2(minutes)}`;
}

export function formatHour(value: unknown = 0): string {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '00:00';

  const hour = ((Math.trunc(numeric) % 24) + 24) % 24;
  return `${pad2(hour)}:00`;
}

export function mergeBusySlots(slots: unknown[] = []): TimeSlot[] {
  const sorted = slots
    .map((slot) => normalizeSlot(slot))
    .filter((slot): slot is TimeSlot => Boolean(slot))
    .sort((left, right) => left.start - right.start || left.end - right.end);

  const merged: TimeSlot[] = [];
  for (const slot of sorted) {
    const current = merged[merged.length - 1];
    if (current && slot.start <= current.end) {
      current.end = Math.max(current.end, slot.end);
      continue;
    }
    merged.push({ ...slot });
  }

  return merged;
}

export function parseConflicts(input: unknown = []): TimeSlot[] {
  if (Array.isArray(input)) {
    return input.flatMap((item) => parseConflicts(item));
  }

  if (isRecord(input)) {
    const source =
      typeof input.name === 'string'
        ? input.name
        : typeof input.label === 'string'
          ? input.label
          : undefined;
    const nested = input.busySlots ?? input.conflicts;
    if (Array.isArray(nested)) {
      return nested
        .map((slot) => normalizeSlot(slot, source))
        .filter((slot): slot is TimeSlot => Boolean(slot));
    }

    const slot = normalizeSlot(input, source);
    return slot ? [slot] : [];
  }

  const text = String(input ?? '').trim();
  if (!text) return [];

  const conflicts: TimeSlot[] = [];
  const segments = text.split(/[\n;]+/);
  const rangePattern =
    /(\d{1,2}(?::[0-5]?\d)?\s*(?:am|pm)?)\s*(?:-|–|—|\bto\b|\buntil\b)\s*(\d{1,2}(?::[0-5]?\d)?\s*(?:am|pm)?)/gi;

  for (const segment of segments) {
    for (const match of segment.matchAll(rangePattern)) {
      const start = parseTimeValue(match[1]);
      const end = parseTimeValue(match[2]);
      if (start === null || end === null || end <= start) continue;

      const label = segment.replace(match[0], '').replace(/^[\s,:-]+|[\s,:-]+$/g, '') || undefined;
      conflicts.push({ start, end, label });
    }
  }

  return conflicts.sort((left, right) => left.start - right.start || left.end - right.end);
}

export function findAvailableSlots(
  peopleOrSlots: unknown = [],
  workStartInput: unknown = '09:00',
  workEndInput: unknown = '17:00',
  minimumDurationInput: unknown = 30
): TimeSlot[] {
  const workStart = parseTimeToMinutes(workStartInput);
  const workEnd = parseTimeToMinutes(workEndInput);
  const dayStart = Math.min(workStart, workEnd);
  const dayEnd = Math.max(workStart, workEnd);
  const minimumDuration = Math.max(0, Number(minimumDurationInput) || 0);

  if (dayEnd <= dayStart) return [];

  const busySlots = parseConflicts(peopleOrSlots)
    .map((slot) => ({
      start: Math.max(slot.start, dayStart),
      end: Math.min(slot.end, dayEnd),
    }))
    .filter((slot) => slot.end > slot.start);
  const mergedBusy = mergeBusySlots(busySlots);

  const available: TimeSlot[] = [];
  let cursor = dayStart;
  for (const slot of mergedBusy) {
    if (slot.start - cursor >= minimumDuration) {
      available.push({ start: cursor, end: slot.start });
    }
    cursor = Math.max(cursor, slot.end);
  }

  if (dayEnd - cursor >= minimumDuration) {
    available.push({ start: cursor, end: dayEnd });
  }

  return available;
}

export function convertTime(
  time: unknown = '00:00',
  fromTimeZone: string = 'UTC',
  toTimeZone: string = 'UTC',
  referenceDate?: unknown
): string {
  const parsed = parseTimeValue(time);
  if (parsed === null) return String(time || '00:00');

  const fromTz = fromTimeZone || 'UTC';
  const toTz = toTimeZone || 'UTC';
  const anchor = stableDate(referenceDate);
  const sourceDateParts = getZonedParts(anchor, fromTz) ?? getZonedParts(anchor, 'UTC');
  if (!sourceDateParts) return formatMinutesToTime(parsed);

  const sourceWallUtc = Date.UTC(
    sourceDateParts.year,
    sourceDateParts.month - 1,
    sourceDateParts.day,
    Math.floor(parsed / 60),
    parsed % 60,
    0
  );

  const initialOffset = getTimeZoneOffsetMinutes(fromTz, new Date(sourceWallUtc)) ?? 0;
  let instant = new Date(sourceWallUtc - initialOffset * 60000);
  const correctedOffset = getTimeZoneOffsetMinutes(fromTz, instant);
  if (correctedOffset !== null && correctedOffset !== initialOffset) {
    instant = new Date(sourceWallUtc - correctedOffset * 60000);
  }

  const targetParts = getZonedParts(instant, toTz);
  if (!targetParts) return formatMinutesToTime(parsed);

  return `${pad2(targetParts.hour)}:${pad2(targetParts.minute)}`;
}
