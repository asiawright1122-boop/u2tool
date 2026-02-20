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

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convertToCsv() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const data = JSON.parse(input);
      const array = Array.isArray(data) ? data : [data];
      
      if (array.length === 0) {
        output = '';
        return;
      }

      // Get all unique keys
      const keys = [...new Set(array.flatMap(obj => Object.keys(obj)))];
      
      // Create CSV header
      const header = keys.map(k => `"${k}"`).join(',');
      
      // Create CSV rows
      const rows = array.map(obj => 
        keys.map(key => {
          const val = obj[key];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      );

      output = [header, ...rows].join('\n');
      error = '';
    } catch (_e) {
      error = t('errorInvalidJson');
      output = '';
    }
  }
  function convertToJson() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        error = 'CSV must have header and at least one row';
        return;
      }

      const parseCSVLine = (line: string) => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      const headers = parseCSVLine(lines[0]);
      const data = lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        return obj;
      });

      output = JSON.stringify(data, null, 2);
      error = '';
    } catch (_e) {
      error = t('errorInvalidFormat');
      output = '';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function downloadCsv() {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">{t('input')} (JSON or CSV)</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={'[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'}
          rows={8}></textarea>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={convertToCsv} class="btn-primary">
          JSON → CSV
        </button>
        <button onclick={convertToJson} class="btn-secondary">
          CSV → JSON
        </button>
      </div>

      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
            <div class="flex gap-2">
              <button
                onclick={copyOutput}
                class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
              {#if output.includes(',')}
!output.startsWith('[') && (
                <button onclick={downloadCsv} class="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded">
                  {t('download')} CSV
                </button>
              )
{/if}
            </div>
          </div>
          <textarea
            class="tool-textarea"
            value={output}
            readOnly
            rows={8}></textarea>
        </div>
{/if}
    </div>
  
