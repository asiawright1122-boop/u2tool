<script lang="ts">
  import { onDestroy } from 'svelte';
  import { formatTime, fromSeconds, toSeconds } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['time-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.time-calculator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Operation = 'add' | 'subtract' | 'difference';
  interface TimeValue {
    hours: number;
    minutes: number;
    seconds: number;
    negative?: boolean;
  }

  let time1 = $state<TimeValue>({ hours: 0, minutes: 0, seconds: 0 });

  let time2 = $state<TimeValue>({ hours: 0, minutes: 0, seconds: 0 });

  let operation = $state<Operation>('add');

  let result = $state<TimeValue | null>(null);

  let format = $state<'24h' | '12h'>('24h');

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  function handleCalculate() {
    const seconds1 = toSeconds(time1);
    const seconds2 = toSeconds(time2);
    
    let resultSeconds = 0;
    
    switch (operation) {
      case 'add':
        resultSeconds = seconds1 + seconds2;
        break;
      case 'subtract':
        resultSeconds = seconds1 - seconds2;
        break;
      case 'difference':
        resultSeconds = Math.abs(seconds1 - seconds2);
        break;
    }
    
    result = fromSeconds(resultSeconds) as TimeValue;
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function handleCopy() {
    if (result) {
      const text = formatTime(result, format);
      await navigator.clipboard.writeText(text);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }
  function handleClear() {
    time1 = { hours: 0, minutes: 0, seconds: 0 };
    time2 = { hours: 0, minutes: 0, seconds: 0 };
    result = null;
  }

</script>

{#snippet TimeInput(value: TimeValue, onChange: (value: TimeValue) => void, label: string)}
<div class="space-y-2">
      <label class="tool-label">
        {label}
      </label>
      <div class="flex gap-2 items-center">
        <div class="flex-1">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('hours')}</label>
          <input
            type="number"
            min="0"
            max="999"
            value={value.hours}
            onchange={(e) => onChange({ ...value, hours: Math.max(0, parseInt(e.currentTarget.value, 10) || 0) })}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <span class="text-2xl text-gray-400 mt-5">:</span>
        <div class="flex-1">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('minutes')}</label>
          <input
            type="number"
            min="0"
            max="59"
            value={value.minutes}
            onchange={(e) => onChange({ ...value, minutes: Math.min(59, Math.max(0, parseInt(e.currentTarget.value, 10) || 0)) })}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <span class="text-2xl text-gray-400 mt-5">:</span>
        <div class="flex-1">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('seconds')}</label>
          <input
            type="number"
            min="0"
            max="59"
            value={value.seconds}
            onchange={(e) => onChange({ ...value, seconds: Math.min(59, Math.max(0, parseInt(e.currentTarget.value, 10) || 0)) })}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
{/snippet}


    <div class="space-y-6">
      <!-- Time Inputs -->
      <div class="grid md:grid-cols-2 gap-6">
        {@render TimeInput(time1, (value) => (time1 = value), t('time1'))}
        {@render TimeInput(time2, (value) => (time2 = value), t('time2'))}
      </div>

      <!-- Operation Selection -->
      <div>
        <label class="tool-label">
          {t('operation')}
        </label>
        <div class="flex gap-2">
          {#each (['add', 'subtract', 'difference'] as Operation[]) as op (op)}
<button 
              onclick={() => operation = op}
              class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                operation === op
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(op)}
            </button>
{/each}
        </div>
      </div>

      <!-- Format Selection -->
      <div>
        <label class="tool-label">
          {t('format')}
        </label>
        <div class="flex gap-2">
          <button
            onclick={() => format = '24h'}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              format === '24h'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('format24h')}
          </button>
          <button
            onclick={() => format = '12h'}
            class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              format === '12h'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('format12h')}
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button onclick={handleCalculate} class="btn-primary">
          {t('calculate')}
        </button>
        <button onclick={handleClear} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Result Section -->
      {#if result}
<div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {t('result')}
            </h3>
            <button
              onclick={handleCopy}
              class={`text-sm px-3 py-1 rounded ${
                copied 
                  ? 'btn-success' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
              }`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          
          <div class="text-3xl font-mono text-center text-amber-600 dark:text-amber-400 mb-4">
            {formatTime(result, format)}
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="p-3 bg-white dark:bg-gray-700 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400">{t('totalMinutes')}</div>
              <div class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {Math.floor(toSeconds(result) / 60)}
              </div>
            </div>
            <div class="p-3 bg-white dark:bg-gray-700 rounded-lg">
              <div class="text-gray-500 dark:text-gray-400">{t('totalSeconds')}</div>
              <div class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {toSeconds(result)}
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
