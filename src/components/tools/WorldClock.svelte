<script lang="ts">
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
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ClockCity {
  id: string;
  name: string;
  timezone: string;
  offset: string;
}

  let cities = $state(DEFAULT_CITIES);

  let currentTime = $state(new Date());

  let is24Hour = $state(true);

  let showSeconds = $state(true);

  let selectedTimezone = $state('');

  $effect(() => {
    const timer = setInterval(() => {
      currentTime = new Date();
    }, 1000);
    return () => clearInterval(timer);
  });

  // Functions
  function formatTime(timezone: string) {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: !is24Hour,
      };
      return currentTime.toLocaleTimeString('en-US', options);
    } catch {
      return '--:--:--';
    }
  }
  function formatDate(timezone: string) {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      return currentTime.toLocaleDateString('en-US', options);
    } catch {
      return '---';
    }
  }
  function getTimezoneOffset(timezone: string) {
    try {
      const date = new Date();
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
      const sign = offset >= 0 ? '+' : '';
      return `UTC${sign}${offset}`;
    } catch {
      return 'UTC';
    }
  }
  function addCity() {
    if (!selectedTimezone) return;
    const tz = AVAILABLE_TIMEZONES.find(t => t.timezone === selectedTimezone);
    if (!tz) return;
    if (cities.some(c => c.timezone === selectedTimezone)) return;
    
    const newCity: ClockCity = {
      id: Date.now().toString(),
      name: tz.name,
      timezone: tz.timezone,
      offset: getTimezoneOffset(tz.timezone),
    };
    cities = [...cities, newCity];
    selectedTimezone = '';
  }
  function removeCity(id: string) {
    cities = cities.filter(c => c.id !== id);
  }
  function isDaytime(timezone: string) {
    try {
      const hour = parseInt(currentTime.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', hour12: false }));
      return hour >= 6 && hour < 18;
    } catch {
      return true;
    }
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              bind:checked={is24Hour}
              class="rounded"
            />
            <span class="text-sm">{t('worldClock.format24h')}</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              bind:checked={showSeconds}
              class="rounded"
            />
            <span class="text-sm">{t('worldClock.showSeconds')}</span>
          </label>
        </div>
      </div>

      <div class="flex gap-2">
        <select
          bind:value={selectedTimezone}
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">{t('worldClock.selectCity')}</option>
          {#each AVAILABLE_TIMEZONES.filter(tz => !cities.some(c => c.timezone === tz.timezone)) as tz (tz.timezone)}
<option  value={tz.timezone}>{tz.name}</option>
{/each}
        </select>
        <button
          onclick={addCity}
          disabled={!selectedTimezone}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {t('worldClock.addCity')}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each cities as city (city.id)}
<div 
            class={`relative p-4 rounded-xl border ${
              isDaytime(city.timezone)
                ? 'bg-gradient-to-br from-blue-50 to-yellow-50 dark:from-blue-900/20 dark:to-yellow-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <button
              onclick={() => removeCity(city.id)}
              class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
            >
              ×
            </button>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">{isDaytime(city.timezone) ? '☀️' : '🌙'}</span>
              <div>
                <h3 class="font-semibold text-gray-800 dark:text-gray-200">{city.name}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">{getTimezoneOffset(city.timezone)}</p>
              </div>
            </div>
            <div class="text-3xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(city.timezone)}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(city.timezone)}
            </div>
          </div>
{/each}
      </div>

      {#if cities.length === 0}
<div class="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('worldClock.noCities')}
        </div>
{/if}
    </div>
  
