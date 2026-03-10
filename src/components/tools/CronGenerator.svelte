<script lang="ts">
  import { onDestroy } from 'svelte';

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
  function tc(key: string): string {
    const scope = translations['tools']['cron-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.cron-generator.${key}`;
  }

  let minute = $state('*');

  let hour = $state('*');

  let dayOfMonth = $state('*');

  let month = $state('*');

  let dayOfWeek = $state('*');

  let expression = $state('* * * * *');

  let description = $state('');

  let copied = $state(false);

  let timerRef = $state(null);

  $effect(() => {
    const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    expression = cron;
    description = describeCron(cron);
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function describeCron(cron: string): string {
    const [min, hr, dom, mon, dow] = cron.split(' ');
    const parts: string[] = [];

    if (min === '*' && hr === '*' && dom === '*' && mon === '*' && dow === '*') {
      return tc('everyMinute');
    }

    if (min !== '*') parts.push(tc('atMinute', { min }));
    if (hr !== '*') parts.push(tc('atHour', { hr }));
    if (dom !== '*') parts.push(tc('onDay', { dom }));
    if (mon !== '*') parts.push(tc('inMonth', { mon }));
    if (dow !== '*') {
      const days = [tc('sunday'), tc('monday'), tc('tuesday'), tc('wednesday'), tc('thursday'), tc('friday'), tc('saturday')];
      const dayNum = parseInt(dow);
      parts.push(tc('onWeekday', { day: days[dayNum] || dow }));
    }

    return parts.join(', ') || tc('everyMinute');
  }
  const presets = [
    { label: tc('everyMinute'), value: '* * * * *' },
    { label: tc('everyHour'), value: '0 * * * *' },
    { label: tc('everyDayMidnight'), value: '0 0 * * *' },
    { label: tc('everyDayNoon'), value: '0 12 * * *' },
    { label: tc('everyMonday'), value: '0 0 * * 1' },
    { label: tc('everyWeekday'), value: '0 0 * * 1-5' },
    { label: tc('firstDayOfMonth'), value: '0 0 1 * *' },
    { label: tc('every5Minutes'), value: '*/5 * * * *' },
    { label: tc('every30Minutes'), value: '*/30 * * * *' },
  ];
  function applyPreset(value: string) {
    const [min, hr, dom, mon, dow] = value.split(' ');
    minute = min;
    hour = hr;
    dayOfMonth = dom;
    month = mon;
    dayOfWeek = dow;
  }
  async function copyExpression() {
    await navigator.clipboard.writeText(expression);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Presets -->
      <div>
        <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{tc('presets')}</label>
        <div class="flex flex-wrap gap-2">
          {#each presets as preset (preset.value)}
<button 
              onclick={() => applyPreset(preset.value)}
              class="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              {preset.label}
            </button>
{/each}
        </div>
      </div>

      <!-- Fields -->
      <div class="grid grid-cols-5 gap-4">
        <div>
          <label for="cron-minute" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('minute')}</label>
          <input
            id="cron-minute"
            name="minuteValue"
            type="text"
            bind:value={minute}
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cron-hour" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('hour')}</label>
          <input
            id="cron-hour"
            name="hourValue"
            type="text"
            bind:value={hour}
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cron-day" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('day')}</label>
          <input
            id="cron-day"
            name="dayValue"
            type="text"
            bind:value={dayOfMonth}
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cron-month" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('month')}</label>
          <input
            id="cron-month"
            name="monthValue"
            type="text"
            bind:value={month}
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label for="cron-weekday" class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('weekday')}</label>
          <input
            id="cron-weekday"
            name="weekdayValue"
            type="text"
            bind:value={dayOfWeek}
            class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Result -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-gray-600 dark:text-gray-300">{tc('expression')}</span>
          <button
            onclick={copyExpression}
            class={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-green-600' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <div class="text-2xl font-mono text-center mb-4 text-gray-900 dark:text-white">{expression}</div>
        <div class="text-center text-gray-600 dark:text-gray-300">{description}</div>
      </div>

      <!-- Reference -->
      <div class="text-xs text-gray-600 dark:text-gray-300">
        <p class="mb-2">{tc('specialChars')}:</p>
        <ul class="list-disc list-inside space-y-1">
          <li><code class="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">*</code> - {tc('anyValue')}</li>
          <li><code class="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">,</code> - {tc('valueList')}</li>
          <li><code class="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">-</code> - {tc('range')}</li>
          <li><code class="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">/</code> - {tc('step')}</li>
        </ul>
      </div>
    </div>
  
