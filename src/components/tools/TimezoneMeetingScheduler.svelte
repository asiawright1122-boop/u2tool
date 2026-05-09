<script lang="ts">
  import { TIMEZONES, convertTime, formatHour } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = translations['tools']['timezone-meeting-scheduler'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.timezone-meeting-scheduler.${key}`;
  }

  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  interface Participant {
    id: string;
    name: string;
    timezone: string;
    workStart: number;
    workEnd: number;
  }

  let participants = $state<Participant[]>([
    { id: '1', name: 'Alice', timezone: 'America/New_York', workStart: 9, workEnd: 17 },
    { id: '2', name: 'Bob', timezone: 'Europe/London', workStart: 9, workEnd: 17 },
    { id: '3', name: 'Carol', timezone: 'Asia/Tokyo', workStart: 9, workEnd: 18 },
  ]);

  let baseTimezone = $state('America/New_York');
  let meetingDuration = $state(1);
  let copied = $state(false);

  function addParticipant() {
    participants = [...participants, {
      id: Date.now().toString(),
      name: `Person ${participants.length + 1}`,
      timezone: 'America/New_York',
      workStart: 9,
      workEnd: 17,
    }];
  }

  function updateParticipant(id: string, field: keyof Participant, value: string | number) {
    participants = participants.map(participant => participant.id === id ? { ...participant, [field]: value } : participant);
  }

  function removeParticipant(id: string) {
    participants = participants.filter(participant => participant.id !== id);
  }

  function localHourFor(hour: number, timezone: string) {
    const localTime = convertTime(`${String(hour).padStart(2, '0')}:00`, baseTimezone, timezone);
    const parsedHour = parseInt(String(localTime).split(':')[0], 10);
    return Number.isFinite(parsedHour) ? parsedHour % 24 : hour;
  }

  function isParticipantWorking(hour: number, participant: Participant) {
    return hour >= participant.workStart && hour + meetingDuration <= participant.workEnd;
  }

  let availableSlots = $derived.by(() => {
    const slots: { hour: number; score: number; times: { name: string; time: string; isWorking: boolean }[] }[] = [];

    for (let hour = 0; hour < 24; hour++) {
      let score = 0;
      const times = participants.map(participant => {
        const localHour = localHourFor(hour, participant.timezone);
        const isWorking = isParticipantWorking(localHour, participant);
        if (isWorking) score += 2;
        else if (localHour >= 7 && localHour <= 22) score += 1;
        return { name: participant.name, time: formatHour(localHour), isWorking };
      });

      slots.push({ hour, score, times });
    }

    return slots.sort((a, b) => b.score - a.score);
  });

  let bestSlots = $derived(availableSlots.slice(0, 5));

  function handleCopy() {
    const best = bestSlots[0];
    if (!best) return;
    const baseLabel = TIMEZONES.find(tz => tz.value === baseTimezone)?.label || baseTimezone;
    const text = `Best meeting time: ${formatHour(best.hour)} (${baseLabel})\n\nLocal times:\n${best.times.map(time => `${time.name}: ${time.time}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label for="timezone-meeting-base" class="tool-label">{t('baseTimezone')}</label>
      <select
        id="timezone-meeting-base"
        name="baseTimezone"
        bind:value={baseTimezone}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        {#each TIMEZONES as timezone (timezone.value)}
          <option value={timezone.value}>{timezone.label}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="timezone-meeting-duration" class="tool-label">{t('duration')}</label>
      <input
        id="timezone-meeting-duration"
        name="meetingDuration"
        type="number"
        min="0.5"
        max="8"
        step="0.5"
        bind:value={meetingDuration}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
    <div class="flex items-end">
      <button onclick={handleCopy} class="btn-secondary w-full">{copied ? tCommon('copied') : t('copyBestTime')}</button>
    </div>
  </div>

  <section class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <h3 class="font-medium text-gray-900 dark:text-white">{t('participants')}</h3>
      <button onclick={addParticipant} class="btn-primary text-sm">{t('addParticipant')}</button>
    </div>

    <div class="space-y-2">
      {#each participants as participant (participant.id)}
        <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_90px_90px_32px] gap-2 items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <input
            aria-label={t('participants')}
            type="text"
            value={participant.name}
            onchange={(e) => updateParticipant(participant.id, 'name', e.currentTarget.value)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <select
            aria-label={t('baseTimezone')}
            value={participant.timezone}
            onchange={(e) => updateParticipant(participant.id, 'timezone', e.currentTarget.value)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each TIMEZONES as timezone (timezone.value)}
              <option value={timezone.value}>{timezone.label}</option>
            {/each}
          </select>
          <input
            aria-label={`${t('work')} start`}
            type="number"
            min="0"
            max="23"
            value={participant.workStart}
            onchange={(e) => updateParticipant(participant.id, 'workStart', parseInt(e.currentTarget.value, 10) || 0)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <input
            aria-label={`${t('work')} end`}
            type="number"
            min="1"
            max="24"
            value={participant.workEnd}
            onchange={(e) => updateParticipant(participant.id, 'workEnd', parseInt(e.currentTarget.value, 10) || 0)}
            class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button onclick={() => removeParticipant(participant.id)} class="text-red-500 hover:text-red-700" aria-label={tCommon('clear')}>x</button>
        </div>
      {/each}
    </div>
  </section>

  <section class="space-y-3">
    <h3 class="font-medium text-gray-900 dark:text-white">{t('bestMeetingTimes')}</h3>
    <div class="space-y-3">
      {#each bestSlots as slot, idx (slot.hour)}
        {@const allWorking = slot.times.every(time => time.isWorking)}
        <div class={`p-3 rounded-lg border ${
          idx === 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
          allWorking ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
          'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
        }`}>
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium text-gray-900 dark:text-white">
              {formatHour(slot.hour)} ({TIMEZONES.find(tz => tz.value === baseTimezone)?.label.split(' ')[0]})
            </span>
            {#if idx === 0}
              <span class="text-xs px-2 py-0.5 bg-green-500 text-white rounded">{t('best')}</span>
            {:else if allWorking}
              <span class="text-xs px-2 py-0.5 bg-amber-500 text-white rounded">{t('allWorking')}</span>
            {/if}
          </div>
          <div class="flex flex-wrap gap-3 text-sm">
            {#each slot.times as time (time.name)}
              <span class={time.isWorking ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                {time.name}: {time.time} {time.isWorking ? '✓' : ''}
              </span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
