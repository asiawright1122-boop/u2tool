<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface ConversionResult {
    date: string;
    time: string;
    full: string;
  }

  interface WorldClockItem {
    timezone: string;
    label: string;
  }

  const FALLBACK_TIMEZONES = [
    'UTC',
    'America/Los_Angeles',
    'America/New_York',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Australia/Sydney',
  ];

  const WORLD_CLOCK: WorldClockItem[] = [
    { timezone: 'UTC', label: 'UTC' },
    { timezone: 'America/New_York', label: 'New York' },
    { timezone: 'Europe/London', label: 'London' },
    { timezone: 'Asia/Shanghai', label: 'Shanghai' },
    { timezone: 'Asia/Tokyo', label: 'Tokyo' },
    { timezone: 'Australia/Sydney', label: 'Sydney' },
  ];

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = (translations['tools'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  function tz(key: string): string {
    const scope = (translations['tools']['timezone-converter'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return typeof value === 'string' ? value : `MISSING: tools.timezone-converter.${key}`;
  }

  function getTimezones(): string[] {
    if (typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }

    return FALLBACK_TIMEZONES;
  }

  function getTimeZoneOffsetMs(date: Date, timeZone: string): number {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(date);

    const lookup = Object.fromEntries(
      parts
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, Number.parseInt(part.value, 10)])
    );

    const asUtc = Date.UTC(
      lookup.year,
      lookup.month - 1,
      lookup.day,
      lookup.hour,
      lookup.minute,
      lookup.second
    );

    return asUtc - date.getTime();
  }

  function zonedDateTimeToUtc(dateValue: string, timeValue: string, timeZone: string): Date | null {
    if (!dateValue || !timeValue) {
      return null;
    }

    const [year, month, day] = dateValue.split('-').map((part) => Number.parseInt(part, 10));
    const [hour, minute] = timeValue.split(':').map((part) => Number.parseInt(part, 10));

    if (![year, month, day, hour, minute].every(Number.isFinite)) {
      return null;
    }

    const baseUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
    let candidate = new Date(baseUtc);
    let offset = getTimeZoneOffsetMs(candidate, timeZone);
    candidate = new Date(baseUtc - offset);

    const refinedOffset = getTimeZoneOffsetMs(candidate, timeZone);
    if (refinedOffset !== offset) {
      candidate = new Date(baseUtc - refinedOffset);
    }

    return candidate;
  }

  function formatForTimeZone(date: Date, timeZone: string, options: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(locale || 'en-US', { ...options, timeZone }).format(date);
  }

  const TIMEZONES = getTimezones();

  let sourceTimezone = $state('UTC');
  let targetTimezone = $state('Asia/Shanghai');
  let inputDate = $state('');
  let inputTime = $state('');
  let result = $state<ConversionResult | null>(null);
  let copied = $state(false);
  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);
  let currentTime = $state(new Date());

  $effect(() => {
    if (!inputDate || !inputTime) {
      const now = new Date();
      inputDate = now.toISOString().slice(0, 10);
      inputTime = now.toTimeString().slice(0, 5);
    }
  });

  $effect(() => {
    const interval = setInterval(() => {
      currentTime = new Date();
    }, 1000);

    return () => clearInterval(interval);
  });

  $effect(() => {
    const converted = zonedDateTimeToUtc(inputDate, inputTime, sourceTimezone);
    if (!converted) {
      result = null;
      return;
    }

    result = {
      date: formatForTimeZone(converted, targetTimezone, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      time: formatForTimeZone(converted, targetTimezone, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      full: formatForTimeZone(converted, targetTimezone, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
    };
  });

  onDestroy(() => {
    if (timerRef) {
      clearTimeout(timerRef);
    }
  });

  function useNow() {
    const now = new Date();
    inputDate = now.toISOString().slice(0, 10);
    inputTime = now.toTimeString().slice(0, 5);
  }

  function swapTimezones() {
    const nextSource = targetTimezone;
    targetTimezone = sourceTimezone;
    sourceTimezone = nextSource;
  }

  async function copyResult() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(result.full);
    copied = true;
    if (timerRef) {
      clearTimeout(timerRef);
    }
    timerRef = setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<div class="space-y-6">
  <div class="grid gap-4 md:grid-cols-2">
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{tz('date')}</span>
      <input
        bind:value={inputDate}
        type="date"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    </label>
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{tz('time')}</span>
      <input
        bind:value={inputTime}
        type="time"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    </label>
  </div>

  <div class="grid gap-4 md:grid-cols-2">
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{tz('fromTimezone')}</span>
      <select
        bind:value={sourceTimezone}
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {#each TIMEZONES as timezone (timezone)}
          <option value={timezone}>{timezone}</option>
        {/each}
      </select>
    </label>
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{tz('toTimezone')}</span>
      <select
        bind:value={targetTimezone}
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {#each TIMEZONES as timezone (timezone)}
          <option value={timezone}>{timezone}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="flex flex-wrap gap-3">
    <button
      onclick={useNow}
      class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
    >
      {tz('now')}
    </button>
    <button
      onclick={swapTimezones}
      class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {tz('swapTimezones')}
    </button>
  </div>

  <section class="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-5 text-amber-950 shadow-lg dark:from-slate-900 dark:to-amber-900 dark:text-white">
    <div class="flex items-center justify-between gap-3">
      <div>
        <div class="text-sm uppercase tracking-wide text-amber-700 dark:text-amber-100">{tz('convertedTime')}</div>
        {#if result}
          <div class="mt-2 text-3xl font-bold">{result.time}</div>
          <div class="mt-1 text-amber-700 dark:text-amber-100">{result.date}</div>
          <div class="mt-3 text-sm text-amber-700 dark:text-amber-100">{targetTimezone}</div>
        {:else}
          <div class="mt-2 text-lg font-medium text-amber-700 dark:text-amber-100">-</div>
        {/if}
      </div>
      <button
        onclick={copyResult}
        disabled={!result}
        class="rounded-lg border border-amber-300/40 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copied ? tz('copied') : tz('copy')}
      </button>
    </div>
  </section>

  <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
    <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{tz('worldClock')}</h3>
    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {#each WORLD_CLOCK as entry (entry.timezone)}
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
          <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{entry.label}</div>
          <div class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatForTimeZone(currentTime, entry.timezone, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </div>
          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{entry.timezone}</div>
        </div>
      {/each}
    </div>
  </section>
</div>
