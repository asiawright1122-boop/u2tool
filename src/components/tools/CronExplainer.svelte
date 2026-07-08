<script lang="ts">
  import { getNextRuns, parseCronExpression } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function tc(key: string): string {
    const scope = translations['tools']['cron-explainer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.cron-explainer.${key}`;
  }

  // Types
  type TranslateFunc = (key: string, values?: Record<string, string | number>) => string;

  let cron = $state('0 9 * * 1-5');

  let explanation = $state('');

  let nextRuns = $state([]);

  $effect(() => {
    explanation = parseCronExpression(cron, tc);
    nextRuns = getNextRuns(cron);
  });

  // Functions
  const examples = [
    { cron: '* * * * *', descKey: 'everyMinute' },
    { cron: '0 * * * *', descKey: 'everyHour' },
    { cron: '0 0 * * *', descKey: 'everyDayMidnight' },
    { cron: '0 9 * * 1-5', descKey: 'weekdays9am' },
    { cron: '0 0 1 * *', descKey: 'firstDayMonth' },
    { cron: '*/15 * * * *', descKey: 'every15min' },
    { cron: '0 0 * * 0', descKey: 'everySunday' },
    { cron: '0 6,18 * * *', descKey: 'at6amAnd6pm' },
  ];

</script>


    <div class="space-y-6">
      <div>
        <label for="cron-explainer-field-2" class="block text-sm font-medium mb-2">{tc('expression')}</label>
        <input
          type="text"
          bind:value={cron}
          class="tool-input font-mono text-lg"
          placeholder="* * * * *" id="cron-explainer-field-2" />
      </div>

      <!-- Field Labels -->
      <div class="grid grid-cols-5 gap-2 text-center text-sm">
        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div class="font-mono text-amber-600 dark:text-amber-400">{cron.split(/\s+/)[0] || '*'}</div>
          <div class="text-gray-600 dark:text-gray-300 text-xs mt-1">{tc('minute')}</div>
          <div class="text-gray-500 dark:text-gray-300 text-xs">0-59</div>
        </div>
        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div class="font-mono text-green-600 dark:text-green-400">{cron.split(/\s+/)[1] || '*'}</div>
          <div class="text-gray-600 dark:text-gray-300 text-xs mt-1">{tc('hour')}</div>
          <div class="text-gray-500 dark:text-gray-300 text-xs">0-23</div>
        </div>
        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div class="font-mono text-yellow-600 dark:text-yellow-400">{cron.split(/\s+/)[2] || '*'}</div>
          <div class="text-gray-600 dark:text-gray-300 text-xs mt-1">{tc('day')}</div>
          <div class="text-gray-500 dark:text-gray-300 text-xs">1-31</div>
        </div>
        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div class="font-mono text-slate-600 dark:text-slate-400">{cron.split(/\s+/)[3] || '*'}</div>
          <div class="text-gray-600 dark:text-gray-300 text-xs mt-1">{tc('month')}</div>
          <div class="text-gray-500 dark:text-gray-300 text-xs">1-12</div>
        </div>
        <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div class="font-mono text-red-600 dark:text-red-400">{cron.split(/\s+/)[4] || '*'}</div>
          <div class="text-gray-600 dark:text-gray-300 text-xs mt-1">{tc('weekday')}</div>
          <div class="text-gray-500 dark:text-gray-300 text-xs">0-6</div>
        </div>
      </div>

      <!-- Explanation -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h3 class="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">{tc('explanation')}</h3>
        <p class="text-lg text-gray-900 dark:text-white">{explanation}</p>
      </div>

      <!-- Next Runs -->
      {#if nextRuns.length > 0}
<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">{tc('nextRuns')}</h3>
          <div class="space-y-2">
            {#each nextRuns as date, i (i)}
<div  class="text-sm text-gray-600 dark:text-gray-300 font-mono">
                {date.toLocaleString()}
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Examples -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">{tc('examples')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          {#each examples as ex, i (i)}
<button 
              onclick={() => cron = ex.cron}
              class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <code class="text-amber-600 dark:text-amber-400">{ex.cron}</code>
              <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">{tc(ex.descKey)}</div>
            </button>
{/each}
        </div>
      </div>

      <!-- Special Characters -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{tc('specialChars')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-600 dark:text-gray-300">
          <div><code class="text-amber-600 dark:text-amber-400">*</code> - {tc('anyValue')}</div>
          <div><code class="text-amber-600 dark:text-amber-400">,</code> - {tc('valueList')}</div>
          <div><code class="text-amber-600 dark:text-amber-400">-</code> - {tc('range')}</div>
          <div><code class="text-amber-600 dark:text-amber-400">/</code> - {tc('stepValues')}</div>
        </div>
      </div>
    </div>
  
