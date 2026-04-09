<script lang="ts">
  import { onDestroy } from 'svelte';
  import { detectFormat, formatDate, parseTimestamp } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['batch-timestamp-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.batch-timestamp-converter.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type TimestampFormat = 'seconds' | 'milliseconds' | 'iso8601' | 'unknown';
  interface TimestampEntry {
  input: string;
  detected: TimestampFormat;
  output: string;
  isValid: boolean;
}

  let input = $state('');

  let entries = $state([]);

  let timezone = $state('UTC');

  let outputFormat = $state('local');

  let copied = $state(false);

  let timerRef = $state(null);

  function handleConvert() {
    if (!input.trim()) {
      entries = [];
      return;
    }

    const lines = input.split('\n').filter(line => line.trim());
    const results: TimestampEntry[] = lines.map(line => {
      const trimmed = line.trim();
      const detected = detectFormat(trimmed);
      const date = parseTimestamp(trimmed, detected);
      
      return {
        input: trimmed,
        detected,
        output: date ? formatDate(date, timezone, outputFormat) : 'Invalid',
        isValid: date !== null && !isNaN(date.getTime()),
      };
    });

    entries = results;
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handleClear() {
    input = '';
    entries = [];
  }
  function exportCsv() {
    const header = 'Input,Detected Format,Output\n';
    const rows = entries.map(e => `"${e.input}","${e.detected}","${e.output}"`).join('\n');
    const csv = header + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timestamps.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  function exportJson() {
    const json = JSON.stringify(entries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timestamps.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  async function handleCopyAll() {
    const text = entries.map(e => `${e.input} → ${e.output}`).join('\n');
    await navigator.clipboard.writeText(text);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <!-- Input Section -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tg('input')}
        </label>
        <textarea
          class="tool-textarea font-mono"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          rows={6}></textarea>
      </div>

      <!-- Options Section -->
      <div class="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('timezone')}
          </label>
          <select
            bind:value={timezone}
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {#each TIMEZONES as tz (tz)}
<option  value={tz}>{tz}</option>
{/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('outputFormat')}
          </label>
          <select
            bind:value={outputFormat}
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="local">Local Format</option>
            <option value="iso">ISO 8601</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button onclick={handleConvert} class="btn-primary">
          {t('convert')}
        </button>
        <button onclick={handleClear} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Results Table -->
      {#if entries.length > 0}
<div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tg('output')} ({entries.length})
            </h3>
            <div class="flex gap-2">
              <button
                onclick={handleCopyAll}
                class={`text-sm px-3 py-1 rounded ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                {copied ? tg('copied') : tg('copy')}
              </button>
              <button
                onclick={exportCsv}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportCsv')}
              </button>
              <button
                onclick={exportJson}
                class="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportJson')}
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('input')}</th>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('detected')}</th>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('output')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each entries as entry, index (index)}
<tr 
                    class={!entry.isValid ? 'bg-red-50 dark:bg-red-900/20' : ''}
                  >
                    <td class="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {entry.input}
                    </td>
                    <td class="px-4 py-2">
                      <span class={`px-2 py-1 rounded text-xs ${
                        entry.detected === 'unknown' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {t(entry.detected)}
                      </span>
                    </td>
                    <td class="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {#if entry.isValid}
{entry.output}
{:else}
<span class="text-red-600 dark:text-red-400">{t('invalid')}</span>
{/if}
                    </td>
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
        </div>
{/if}
    </div>
  
