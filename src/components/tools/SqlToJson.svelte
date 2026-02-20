<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sql-to-json'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sql-to-json.${key}`;
  }

  // Types
  interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

  let input = $state(`INSERT INTO users (id, name, email, age) VALUES (1, 'John', 'john@example.com', 30);
INSERT INTO users (id, name, email, age) VALUES (2, 'Jane', 'jane@example.com', 25);`);

  let output = $state('');

  let error = $state('');

  // Functions
  function handleConvert() {
    try {
      error = '';
      const result = sqlToJson(input);
      if (result.length === 0) {
        error = t('noInsertFound');
        output = '';
        return;
      }
      output = JSON.stringify(result, null, 2);
    } catch (_e) {
      error = _e instanceof Error ? _e.message : 'Parse error';
      output = '';
    }
  }
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('sqlInput')}</label>
        <textarea bind:value={input}
          class="w-full h-40 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('placeholder')}></textarea>
      </div>
      
      <button onclick={handleConvert}
        class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {t('convert')}
      </button>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400">{error}</div>
{/if}

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">JSON</label>
            <button onclick={handleCopy} class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">{t('copy')}</button>
          </div>
          <pre class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-green-600 dark:text-green-400 font-mono text-sm overflow-auto max-h-64">
            {output}
          </pre>
        </div>
{/if}

      <div class="text-sm text-gray-500 dark:text-gray-400">
        <p>{t('supportedFormat')}</p>
        <code class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-white">INSERT INTO table (col1, col2) VALUES (val1, val2);</code>
      </div>
    </div>
  
