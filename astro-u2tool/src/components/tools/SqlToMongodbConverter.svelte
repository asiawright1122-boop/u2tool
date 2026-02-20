<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sql-to-mongodb-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sql-to-mongodb-converter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ConversionResult {
  collection: string;
  operation: string;
  query: string;
  options?: string;
}

  let sql = $state('');

  let copied = $state(false);

  let result = $derived.by(() => {
    if (!sql.trim()) return null;
    return convertSqlToMongo(sql);
  });

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result.query);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

  function handleClear() {
    sql = '';
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SQL Query
          </label>
          <div class="flex gap-2">
            {#each EXAMPLES.slice(0, 4) as ex (ex.label)}
<button 
                onclick={() => sql = ex.sql}
                class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {ex.label}
              </button>
{/each}
          </div>
        </div>
        <textarea
          bind:value={sql}
          placeholder={t("inputPlaceholder")}
          class="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <div class="flex gap-3">
        <button
          onclick={handleClear}
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Error -->
      {#if sql.trim()}
!result && (
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          Unable to convert SQL query. Please check the syntax.
        </div>
      )
{/if}

      <!-- Result -->
      {#if result}
<div class="space-y-4">
          <div class="flex items-center gap-4">
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
              {result.operation}
            </span>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Collection: <span class="font-mono">{result.collection}</span>
            </span>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                MongoDB Query
              </label>
              <button
                onclick={handleCopy}
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {result.query}
            </pre>
          </div>
        </div>
{/if}

      <!-- Examples -->
      <div>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          More Examples
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          {#each EXAMPLES as ex (ex.sql)}
<button 
              onclick={() => sql = ex.sql}
              class="p-3 text-left text-xs bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <span class="font-medium text-blue-600 dark:text-blue-400">{ex.label}</span>
              <span class="block font-mono text-gray-600 dark:text-gray-400 mt-1 truncate">
                {ex.sql}
              </span>
            </button>
{/each}
        </div>
      </div>

      <!-- Reference -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Supported SQL Operations</h4>
        <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• SELECT with WHERE, ORDER BY, LIMIT, OFFSET</li>
          <li>• INSERT INTO ... VALUES</li>
          <li>• UPDATE ... SET ... WHERE</li>
          <li>• DELETE FROM ... WHERE</li>
          <li>• COUNT(*) queries</li>
          <li>• Operators: =, !=, &gt;, &lt;, &gt;=, &lt;=, IN, NOT IN, LIKE, IS NULL</li>
        </ul>
      </div>
    </div>
  
