<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface TimeSlot {
    start: number;
    end: number;
  }

  interface Person {
    id: string;
    name: string;
    busySlots: TimeSlot[];
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope =
      (translations['tools']['calendar-availability-finder'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return typeof value === 'string'
      ? value
      : `MISSING: tools.calendar-availability-finder.${key}`;
  }

  function tCommon(key: string): string {
    const scope = (translations['tools'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  function parseTimeToMinutes(value: string): number {
    const [hours, minutes] = value.split(':').map((part) => Number.parseInt(part, 10));
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return 0;
    }

    return hours * 60 + minutes;
  }

  function formatMinutesToTime(value: number): string {
    const safeValue = Math.max(0, Math.min(24 * 60, Math.round(value)));
    const hours = Math.floor(safeValue / 60)
      .toString()
      .padStart(2, '0');
    const minutes = (safeValue % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  function mergeBusySlots(slots: TimeSlot[]): TimeSlot[] {
    const sorted = [...slots]
      .filter((slot) => slot.end > slot.start)
      .sort((left, right) => left.start - right.start);

    if (sorted.length === 0) {
      return [];
    }

    const merged: TimeSlot[] = [sorted[0]];
    for (const slot of sorted.slice(1)) {
      const current = merged[merged.length - 1];
      if (slot.start <= current.end) {
        current.end = Math.max(current.end, slot.end);
      } else {
        merged.push({ ...slot });
      }
    }

    return merged;
  }

  function findAvailableSlots(
    people: Person[],
    workStart: number,
    workEnd: number,
    minimumDuration: number
  ): TimeSlot[] {
    const dayStart = Math.min(workStart, workEnd);
    const dayEnd = Math.max(workStart, workEnd);
    const mergedBusy = mergeBusySlots(
      people.flatMap((person) =>
        person.busySlots
          .map((slot) => ({
            start: Math.max(slot.start, dayStart),
            end: Math.min(slot.end, dayEnd),
          }))
          .filter((slot) => slot.end > slot.start)
      )
    );

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

  let people = $state<Person[]>([
    {
      id: '1',
      name: 'Alice',
      busySlots: [
        { start: 540, end: 600 },
        { start: 780, end: 840 },
      ],
    },
    {
      id: '2',
      name: 'Bob',
      busySlots: [
        { start: 600, end: 660 },
        { start: 900, end: 960 },
      ],
    },
    {
      id: '3',
      name: 'Carol',
      busySlots: [
        { start: 540, end: 570 },
        { start: 720, end: 780 },
      ],
    },
  ]);

  let workStartInput = $state('09:00');
  let workEndInput = $state('17:00');
  let duration = $state(30);
  let newSlotStart = $state('09:00');
  let newSlotEnd = $state('10:00');
  let selectedPerson = $state('1');
  let copied = $state(false);
  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  let availableSlots = $derived.by(() =>
    findAvailableSlots(
      people,
      parseTimeToMinutes(workStartInput),
      parseTimeToMinutes(workEndInput),
      Math.max(15, Number(duration) || 0)
    )
  );

  let timelineTicks = $derived.by(() => {
    const start = parseTimeToMinutes(workStartInput);
    const end = parseTimeToMinutes(workEndInput);
    const safeEnd = Math.max(start + 60, end);
    const ticks: string[] = [];

    for (let current = start; current <= safeEnd; current += 60) {
      ticks.push(formatMinutesToTime(current));
    }

    return ticks;
  });

  function addPerson() {
    const nextIndex = people.length + 1;
    people = [
      ...people,
      {
        id: crypto.randomUUID(),
        name: `Person ${nextIndex}`,
        busySlots: [],
      },
    ];
  }

  function updatePersonName(id: string, name: string) {
    people = people.map((person) => (person.id === id ? { ...person, name } : person));
  }

  function removePerson(id: string) {
    people = people.filter((person) => person.id !== id);
    if (selectedPerson === id) {
      selectedPerson = people[0]?.id || '';
    }
  }

  function addBusySlot() {
    if (!selectedPerson) {
      return;
    }

    const start = parseTimeToMinutes(newSlotStart);
    const end = parseTimeToMinutes(newSlotEnd);
    if (start >= end) {
      return;
    }

    people = people.map((person) =>
      person.id === selectedPerson
        ? {
            ...person,
            busySlots: mergeBusySlots([...person.busySlots, { start, end }]),
          }
        : person
    );
  }

  function removeBusySlot(personId: string, slotIndex: number) {
    people = people.map((person) =>
      person.id === personId
        ? {
            ...person,
            busySlots: person.busySlots.filter((_, index) => index !== slotIndex),
          }
        : person
    );
  }

  async function copySlots() {
    const output = availableSlots
      .map((slot) => `${formatMinutesToTime(slot.start)} ${t('to')} ${formatMinutesToTime(slot.end)}`)
      .join('\n');

    await navigator.clipboard.writeText(output);
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
  <div class="grid gap-4 md:grid-cols-3">
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workHoursStart')}</span>
      <input
        bind:value={workStartInput}
        type="time"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    </label>
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workHoursEnd')}</span>
      <input
        bind:value={workEndInput}
        type="time"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    </label>
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('minDuration')}</span>
      <input
        bind:value={duration}
        type="number"
        min="15"
        step="15"
        class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    </label>
  </div>

  <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
    <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
      {t('participantsBusyTimes')}
    </h3>
    <button
      onclick={addPerson}
      class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
    >
      {t('addPerson')}
    </button>
  </div>

  <div class="grid gap-4 lg:grid-cols-2">
    {#each people as person (person.id)}
      <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
        <div class="mb-3 flex items-center gap-3">
          <input
            value={person.name}
            onchange={(event) => updatePersonName(person.id, event.currentTarget.value)}
            class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <button
            onclick={() => removePerson(person.id)}
            class="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            {tCommon('remove')}
          </button>
        </div>

        {#if person.busySlots.length > 0}
          <div class="space-y-2">
            {#each person.busySlots as slot, index (index)}
              <div class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800">
                <span class="font-mono text-gray-700 dark:text-gray-200">
                  {formatMinutesToTime(slot.start)} {t('to')} {formatMinutesToTime(slot.end)}
                </span>
                <button
                  onclick={() => removeBusySlot(person.id, index)}
                  class="text-red-600 hover:text-red-700 dark:text-red-300"
                >
                  {tCommon('remove')}
                </button>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-gray-500 dark:text-gray-400">{t('noBusyTimes')}</p>
        {/if}
      </section>
    {/each}
  </div>

  <section class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
    <h3 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
      {t('addBusyTime')}
    </h3>
    <div class="grid gap-4 md:grid-cols-[minmax(0,1fr),1fr,1fr,auto]">
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('selectPerson')}</span>
        <select
          bind:value={selectedPerson}
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          {#each people as person (person.id)}
            <option value={person.id}>{person.name}</option>
          {/each}
        </select>
      </label>
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workHoursStart')}</span>
        <input
          bind:value={newSlotStart}
          type="time"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </label>
      <label class="space-y-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workHoursEnd')}</span>
        <input
          bind:value={newSlotEnd}
          type="time"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </label>
      <div class="flex items-end">
        <button
          onclick={addBusySlot}
          class="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black dark:bg-amber-600 dark:hover:bg-amber-700"
        >
          {t('addBusyTime')}
        </button>
      </div>
    </div>
  </section>

  <section class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/10">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h3 class="text-lg font-semibold text-green-900 dark:text-green-100">{t('availableSlots')}</h3>
      <button
        onclick={copySlots}
        disabled={availableSlots.length === 0}
        class="rounded-lg border border-green-300 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-900/30"
      >
        {copied ? tCommon('copied') : tCommon('copy')}
      </button>
    </div>

    {#if availableSlots.length > 0}
      <div class="mb-4 flex flex-wrap gap-2">
        {#each availableSlots as slot (slot.start)}
          <div class="rounded-full bg-white px-3 py-2 text-sm font-mono text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-100">
            {formatMinutesToTime(slot.start)} {t('to')} {formatMinutesToTime(slot.end)}
          </div>
        {/each}
      </div>

      <div class="space-y-3">
        <div class="flex justify-between text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {#each timelineTicks as tick (tick)}
            <span>{tick}</span>
          {/each}
        </div>
        <div class="relative h-16 rounded-xl bg-white shadow-inner dark:bg-gray-800">
          {#each availableSlots as slot (slot.start)}
            <div
              class="absolute top-3 h-10 rounded-lg bg-green-500/80 px-2 text-xs font-medium text-white"
              style={`left: ${((slot.start - parseTimeToMinutes(workStartInput)) / Math.max(parseTimeToMinutes(workEndInput) - parseTimeToMinutes(workStartInput), 1)) * 100}%; width: ${((slot.end - slot.start) / Math.max(parseTimeToMinutes(workEndInput) - parseTimeToMinutes(workStartInput), 1)) * 100}%`}
            >
              <span class="block truncate pt-3">{formatMinutesToTime(slot.start)} - {formatMinutesToTime(slot.end)}</span>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <p>{t('noAvailableSlots')}</p>
        <p>{t('tryAdjusting')}</p>
      </div>
    {/if}
  </section>
</div>
