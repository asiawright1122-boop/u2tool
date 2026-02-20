<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['timezone-meeting-scheduler'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.timezone-meeting-scheduler.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Participant {
  id: string;
  name: string;
  timezone: string;
  workStart: number;
  workEnd: number;
}

  let participants = $state([
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
    participants = participants.map(p => p.id === id ? { ...p, [field]: value } : p);
  }

  function removeParticipant(id: string) {
    participants = participants.filter(p => p.id !== id);
  }

  let availableSlots = $derived.by(() => {
    const slots: { hour: number; score: number; times: { name: string; time: string; isWorking: boolean }[] }[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let score = 0;
      const times = participants.map(p => {
        const localHour = convertTime(hour, baseTimezone, p.timezone);
        const isWorking = isWorkingHour(localHour, p.workStart, p.workEnd);
        if (isWorking) score += 2;
        else if (localHour >= 7 && localHour <= 22) score += 1;
        return { name: p.name, time: formatHour(localHour), isWorking };
      });
      
      slots.push({ hour, score, times });
    }
    
    return slots.sort((a, b) => b.score - a.score);
  });

  function handleCopy() {
    const best = bestSlots[0];
    if (!best) return;
    const text = `Best meeting time: ${formatHour(best.hour)} (${TIMEZONES.find(t => t.value === baseTimezone)?.label})\n\nLocal times:\n${best.times.map(t => `${t.name}: ${t.time}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  // Functions
  const bestSlots = availableSlots.slice(0, 5);

</script>


              <div class={`p-3 rounded-lg border ${
                idx === 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                allWorking ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}>
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {formatHour(slot.hour)} ({TIMEZONES.find(tz => tz.value === baseTimezone)?.label.split(' ')[0]})
                  </span>
                  {#if idx === 0}
<span class="text-xs px-2 py-0.5 bg-green-500 text-white rounded">{t('best')}</span>
{/if}
                  {#if allWorking}
idx !== 0 && <span class="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">{t('allWorking')}</span>
{/if}
                </div>
                <div class="flex flex-wrap gap-3 text-sm">
                  {#each slot.times as time (time.name)}
<span  class={time.isWorking ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                      {time.name}: {time.time} {time.isWorking ? '✓' : ''}
                    </span>
{/each}
                </div>
              </div>
            
