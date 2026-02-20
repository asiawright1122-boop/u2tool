<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['meeting-room-finder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.meeting-room-finder.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  amenities: string[];
  bookings: { start: number; end: number; title: string }[];
}

  let rooms = $state([
    { id: '1', name: 'Conference Room A', capacity: 10, floor: '1st', amenities: ['Projector', 'Whiteboard', 'Video Conference'], bookings: [{ start: 540, end: 600, title: 'Team Standup' }, { start: 780, end: 840, title: 'Client Call' }] },
    { id: '2', name: 'Meeting Room B', capacity: 6, floor: '1st', amenities: ['TV Screen', 'Whiteboard'], bookings: [{ start: 600, end: 660, title: 'Design Review' }] },
    { id: '3', name: 'Board Room', capacity: 20, floor: '2nd', amenities: ['Projector', 'Video Conference', 'Phone'], bookings: [{ start: 840, end: 960, title: 'Board Meeting' }] },
    { id: '4', name: 'Huddle Space', capacity: 4, floor: '1st', amenities: ['TV Screen'], bookings: [] },
    { id: '5', name: 'Training Room', capacity: 30, floor: '3rd', amenities: ['Projector', 'Whiteboard', 'Standing Desk'], bookings: [{ start: 540, end: 720, title: 'Workshop' }] },
  ]);

  let filters = $state({
    minCapacity: 1,
    requiredAmenities: [] as string[],
  });

  let bookingRoom = $state(null);

  let bookingTitle = $state('');

  function updateFilter(key: string, value: any) {
    filters = ({ ...filters, [key]: value });
  }

  function toggleAmenity(amenity: string) {
    filters = ({
      ...filters,
      requiredAmenities: filters.requiredAmenities.includes(amenity)
        ? filters.requiredAmenities.filter(a => a !== amenity)
        : [...filters.requiredAmenities, amenity],
    });
  }

  let filteredRooms = $derived.by(() => {
    return rooms.filter(room => {
      if (room.capacity < filters.minCapacity) return false;
      if (filters.floor && room.floor !== filters.floor) return false;
      if (!filters.requiredAmenities.every(a => room.amenities.includes(a))) return false;
      return true;
    }).map(room => ({
      ...room,
      available: isAvailable(room, filters.startTime, filters.endTime),
    })).sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.capacity - b.capacity;
    });
  });

  function bookRoom(roomId: string) {
    if (!bookingTitle.trim()) return;
    rooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          bookings: [...room.bookings, { start: filters.startTime, end: filters.endTime, title: bookingTitle }].sort((a, b) => a.start - b.start),
        };
      }
      return room;
    });
    bookingRoom = null;
    bookingTitle = '';
  }

  let floors = $derived([...new Set(rooms.map(r => r.floor))]);

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('startTime')}</label>
          <select
            value={filters.startTime}
            onchange={(e) => updateFilter('startTime', parseInt(e.target.value))}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each Array.from({ length: 24 }, (_, i) => i * 60) as m (m)}
<option  value={m}>{formatTime(m)}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('endTime')}</label>
          <select
            value={filters.endTime}
            onchange={(e) => updateFilter('endTime', parseInt(e.target.value))}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each Array.from({ length: 24 }, (_, i) => i * 60) as m (m)}
<option  value={m}>{formatTime(m)}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('minCapacity')}</label>
          <select
            value={filters.minCapacity}
            onchange={(e) => updateFilter('minCapacity', parseInt(e.target.value))}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each [1, 2, 4, 6, 8, 10, 15, 20, 30] as n (n)}
<option  value={n}>{n}+ {t('people')}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('floor')}</label>
          <select
            value={filters.floor}
            onchange={(e) => updateFilter('floor', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">{t('anyFloor')}</option>
            {#each floors as f (f)}
<option  value={f}>{f}</option>
{/each}
          </select>
        </div>
        <div class="flex items-end">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {filteredRooms.filter(r => r.available).length} {t('available')}
          </span>
        </div>
      </div>

      <div>
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">{t('requiredAmenities')}</label>
        <div class="flex flex-wrap gap-2">
          {#each AMENITIES as amenity (amenity)}
<button 
              onclick={() => toggleAmenity(amenity)}
              class={`px-3 py-1 text-sm rounded-full ${
                filters.requiredAmenities.includes(amenity)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {amenity}
            </button>
{/each}
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filteredRooms as room (room.id)}
<div  class={`p-4 rounded-lg border ${
            room.available 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
          }`}>
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-white">{room.name}</h3>
                <p class="text-xs text-gray-500">{room.floor} Floor • {room.capacity} people</p>
              </div>
              {#if room.available}
<span class="text-xs px-2 py-1 bg-green-500 text-white rounded">{t('available')}</span>
{:else}
<span class="text-xs px-2 py-1 bg-red-500 text-white rounded">{t('busy')}</span>
{/if}
            </div>
            
            <div class="flex flex-wrap gap-1 mb-3">
              {#each room.amenities as a (a)}
<span  class="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  {a}
                </span>
{/each}
            </div>

            {#if room.bookings.length > 0}
<div class="mb-3">
                <p class="text-xs text-gray-500 mb-1">{t('todaysBookings')}:</p>
                <div class="space-y-1">
                  {#each room.bookings.slice(0, 3) as b, idx (idx)}
<div  class="text-xs text-gray-600 dark:text-gray-400">
                      {formatTime(b.start)} - {formatTime(b.end)}: {b.title}
                    </div>
{/each}
                </div>
              </div>
{/if}

            {#if room.available}
bookingRoom === room.id ? (
                <div class="flex gap-2">
                  <input
                    type="text"
                    bind:value={bookingTitle}
                    placeholder={t("titlePlaceholder")}
                    class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onclick={() => bookRoom(room.id)}
                    class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {t('book')}
                  </button>
                  <button
                    onclick={() => bookingRoom = null}
                    class="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onclick={() => bookingRoom = room.id}
                  class="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t('bookRoom')}
                </button>
              )
{/if}
          </div>
{/each}
      </div>

      {#if filteredRooms.length === 0}
<div class="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p class="text-gray-500">{t('noRoomsMatch')}</p>
          <p class="text-xs text-gray-400 mt-1">{t('tryAdjusting')}</p>
        </div>
{/if}
    </div>
  
