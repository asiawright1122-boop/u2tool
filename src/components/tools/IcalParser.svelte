<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ical-parser'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ical-parser.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { parseICal, type ICalEvent } from '@/lib/ical-parser';

  let input = $state('');

  let events = $state([]);

  let error = $state('');

  let fileInputRef = $state(null);

  function parse() {
    if (!input.trim()) {
      events = [];
      error = '';
      return;
    }

    try {
      const result = parseICal(input);
      events = result.events;
      error = '';
    } catch (e) {
      error = (e as Error).message;
      events = [];
    }
  }

  // Functions
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      input = content;
    };
    reader.readAsText(file);
  }
  function formatDate(date: Date | null | undefined) {
    if (!date) return '-';
    return date.toLocaleString();
  }
  function exportToJSON() {
    const json = JSON.stringify(events, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.json';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button onclick={parse} class="btn-primary">
          {t('parse')}
        </button>
        <button
          onclick={() => fileInputRef?.click()}
          class="btn-secondary"
        >
          {t('uploadFile')}
        </button>
        <input
          bind:this={fileInputRef}
          type="file"
          accept=".ics,.ical"
          onchange={handleFileUpload}
          class="hidden"
        />
        {#if events.length > 0}
<button onclick={exportToJSON} class="btn-secondary">
            {t('exportJSON')}
          </button>
{/if}
        <button onclick={() => { input = ''; events = []; error = ''; }} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div>
        <label for="ical-parser-field-2" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('icsContent')}</label>
        <textarea
          bind:value={input}
          class="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
          placeholder={t('inputPlaceholder')} id="ical-parser-field-2"></textarea>
      </div>

      {#if error}
<div class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
{/if}

      {#if events.length > 0}
<div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            {t('foundEvents')}: {events.length}
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-100 dark:bg-gray-700">
                  <th class="text-left p-2">{t('summary')}</th>
                  <th class="text-left p-2">{t('start')}</th>
                  <th class="text-left p-2">{t('end')}</th>
                  <th class="text-left p-2">{t('location')}</th>
                </tr>
              </thead>
              <tbody>
                {#each events as event, index (index)}
<tr  class="border-b border-gray-200 dark:border-gray-600">
                    <td class="p-2">{event.summary || '-'}</td>
                    <td class="p-2 whitespace-nowrap">{formatDate(event.dtstart)}</td>
                    <td class="p-2 whitespace-nowrap">{formatDate(event.dtend)}</td>
                    <td class="p-2">{event.location || '-'}</td>
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
        </div>
{/if}
    </div>
  
