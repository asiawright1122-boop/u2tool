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

  let csv = $state('');

  let json = $state('');

  let delimiter = $state(',');

  let hasHeader = $state(true);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert() {
    try {
      const lines = csv.trim().split('\n').map(line => line.split(delimiter));
      if (lines.length === 0) return;
      
      if (hasHeader) {
        const headers = lines[0];
        const data = lines.slice(1).map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim() || '');
          return obj;
        });
        json = JSON.stringify(data, null, 2);
      } else {
        json = JSON.stringify(lines, null, 2);
      }
    } catch {
      json = t('csvToJson.error');
    }
  }
  async function copy() {
    await navigator.clipboard.writeText(json);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <label for="csv-to-json-field-6" class="text-sm text-gray-700 dark:text-gray-300">{t('csvJson.delimiter')}:</label>
          <select bind:value={delimiter} class="tool-select-sm" id="csv-to-json-field-6">
            <option value=",">,</option>
            <option value=";">;</option>
            <option value="\t">{t('csvToJson.delimiterTab')}</option>
            <option value="|">|</option>
          </select>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" bind:checked={hasHeader} class="tool-checkbox" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('csvJson.hasHeader')}</span>
        </label>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="csv-to-json-field-5" class="tool-label">{t('csvToJson.csv')}</label>
          <textarea bind:value={csv} class="tool-textarea-tall" placeholder={t('csvToJson.csvPlaceholder')} id="csv-to-json-field-5"></textarea>
        </div>
        <div>
          <label for="csv-to-json-field-4" class="tool-label">{t('csvToJson.json')}</label>
          <textarea value={json} readOnly class="tool-textarea-tall" id="csv-to-json-field-4"></textarea>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick={convert} class="btn-primary">{t('convert')}</button>
        <button onclick={copy} class="btn-secondary">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  
