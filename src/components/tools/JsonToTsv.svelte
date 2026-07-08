<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-tsv'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-tsv.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('[\n  {"name": "John", "age": 30, "city": "New York"},\n  {"name": "Jane", "age": 25, "city": "London"}\n]');

  let output = $state('');

  let error = $state('');

  let includeHeaders = $state(true);

  // Functions
  function convert() {
    try {
      const data = JSON.parse(input);
      
      if (!Array.isArray(data)) {
        error = tg('errorInvalidFormat');
        return;
      }

      if (data.length === 0) {
        output = '';
        return;
      }

      const headers = Object.keys(data[0]);
      const rows: string[] = [];

      if (includeHeaders) {
        rows.push(headers.join('\t'));
      }

      data.forEach((item: Record<string, unknown>) => {
        const values = headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        });
        rows.push(values.join('\t'));
      });

      output = rows.join('\n');
      error = '';
    } catch (_err) {
      error = tg('errorInvalidJson');
      output = '';
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div class="flex items-center gap-4 mb-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={includeHeaders}
            class="w-4 h-4 rounded"
          />
          <span>{t('includeHeaders')}</span>
        </label>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="json-to-tsv-field-4" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('jsonInput')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
            placeholder={t('jsonPlaceholder')} id="json-to-tsv-field-4"></textarea>
        </div>
        <div>
          <label for="json-to-tsv-field-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('tsvOutput')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-64 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-900 dark:text-white focus:outline-none"
            placeholder={t('tsvPlaceholder')} id="json-to-tsv-field-3"></textarea>
        </div>
      </div>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
{/if}

      <div class="flex gap-2">
        <button
          onclick={convert}
          class="btn-primary px-6 py-2 rounded-lg"
        >
          {t('convert')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  
