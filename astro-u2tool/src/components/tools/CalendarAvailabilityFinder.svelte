<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['calendar-availability-finder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.calendar-availability-finder.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface TimeSlot {
  start: number;
  end: number;
}
  interface Person {
  id: string;
  name: string;
  busySlots: TimeSlot[];
}

  let people = $state([
    { id: '1', name: 'Alice', busySlots: [{ start: 540, end: 600 }, { start: 780, end: 840 }] },
    { id: '2', name: 'Bob', busySlots: [{ start: 600, end: 660 }, { start: 900, end: 960 }] },
    { id: '3', name: 'Carol', busySlots: [{ start: 540, end: 570 }, { start: 720, end: 780 }] },
  ]);

  let workStart = $state(540);

  let workEnd = $state(1020);

  let duration = $state(30);

  let newSlotStart = $state('09:00');

  let newSlotEnd = $state('10:00');

  let selectedPerson = $state('');

  let copied = $state(false);

  function addPerson() {
    people = [...people, {
      id: Date.now().toString(),
      name: `Person ${people.length + 1}`,
      busySlots: [],
    }];
  }

  function updatePersonName(id: string, name: string) {
    people = people.map(p => p.id === id ? { ...p, name } : p);
  }

  function removePerson(id: string) {
    people = people.filter(p => p.id !== id);
  }

  function addBusySlot() {
    if (!selectedPerson) return;
    const start = parseTimeToMinutes(newSlotStart);
    const end = parseTimeToMinutes(newSlotEnd);
    if (start >= end) return;
    
    people = people.map(p => {
      if (p.id === selectedPerson) {
        return { ...p, busySlots: [...p.busySlots, { start, end }].sort((a, b) => a.start - b.start) };
      }
      return p;
    });
  }

  function removeBusySlot(personId: string, slotIdx: number) {
    people = people.map(p => {
      if (p.id === personId) {
        return { ...p, busySlots: p.busySlots.filter((_, i) => i !== slotIdx) };
      }
      return p;
    });
  }

  let availableSlots = $derived(findAvailableSlots(people, workStart, workEnd, duration));

  function handleCopy() {
    const text = availableSlots.map(slot => 
      `${formatMinutesToTime(slot.start)} - ${formatMinutesToTime(slot.end)}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


                  <div
                    class="absolute h-full bg-green-400 dark:bg-green-600 opacity-70"
                    style="left: {left}%; width: {width}%"></div>
                
