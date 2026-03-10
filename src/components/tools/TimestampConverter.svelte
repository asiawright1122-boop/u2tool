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

  let timestamp = $state(Math.floor(Date.now() / 1000));

  let dateString = $state('');

  let currentTime = $state(Date.now());

  let copied = $state('');

  $effect(() => {
    const interval = setInterval(() => {
      currentTime = Date.now();
    }, 1000);
    return () => clearInterval(interval);
  });

  $effect(() => {
    const date = new Date(timestamp * 1000);
    dateString = date.toISOString().slice(0, 16);
  });

  // Functions
  function updateFromDate(dateStr: string) {
    dateString = dateStr;
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      timestamp = Math.floor(date.getTime() / 1000);
    }
  }
  function setNow() {
    timestamp = Math.floor(Date.now() / 1000);
  }
  async function copyValue(type: string, value: string) {
    await navigator.clipboard.writeText(value);
    copied = type;
    setTimeout(() => copied = '', 2000);
  }
  function formatDate(ts: number) {
    const date = new Date(ts * 1000);
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    };
  }
  const formatted = formatDate(timestamp);

</script>


    <div class="space-y-6">
      <!-- Current Time -->
      <div class="p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg text-center">
        <div class="text-sm text-blue-600 dark:text-blue-400 mb-1">{t('timestamp.currentTime')}</div>
        <div class="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">{Math.floor(currentTime / 1000)}</div>
      </div>

      <!-- Unix Timestamp Input -->
      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label for="timestamp-unix" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('timestamp.unixTimestamp')}</label>
        <div class="flex gap-2">
          <input
            id="timestamp-unix"
            name="unixTimestamp"
            type="number"
            value={timestamp}
            onchange={(e) => timestamp = parseInt(e.target.value) || 0}
            class="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-gray-900 dark:text-gray-100"
          />
          <button onclick={setNow} class="btn-secondary">
            {t('timestamp.currentTime')}
          </button>
        </div>
      </div>

      <!-- Date Input -->
      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label for="timestamp-date" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('timestamp.dateTime')}</label>
        <input
          id="timestamp-date"
          name="dateTimeValue"
          type="datetime-local"
          value={dateString}
          onchange={(e) => updateFromDate(e.target.value)}
          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
        />
      </div>

      <!-- Formatted Outputs -->
      <div class="space-y-3">
        {#each Object.entries(formatted) as [key, value] (key)}
<div  class="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">{key}</span>
              <button
                onclick={() => copyValue(key, value)}
                class={`text-xs px-2 py-1 rounded ${copied === key ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
              >
                {copied === key ? t('copied') : t('copy')}
              </button>
            </div>
            <div class="font-mono text-sm break-all text-gray-900 dark:text-gray-100">{value}</div>
          </div>
{/each}
      </div>
    </div>
  
