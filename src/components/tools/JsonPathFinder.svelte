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

  // Types
  interface PathResult {
  path: string;
  value: unknown;
  type: string;
}

  let input = $state('');

  let searchValue = $state('');

  let results = $state([]);

  let error = $state('');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function findPaths(obj: unknown, currentPath: string = '$') {
    const paths: PathResult[] = [];
    
    if (obj === null) {
      paths.push({ path: currentPath, value: null, type: 'null' });
    } else if (Array.isArray(obj)) {
      paths.push({ path: currentPath, value: `Array[${obj.length}]`, type: 'array' });
      obj.forEach((item, index) => {
        paths.push(...findPaths(item, `${currentPath}[${index}]`));
      });
    } else if (typeof obj === 'object') {
      paths.push({ path: currentPath, value: 'Object', type: 'object' });
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) 
          ? `${currentPath}.${key}` 
          : `${currentPath}["${key}"]`;
        paths.push(...findPaths(value, newPath));
      });
    } else {
      paths.push({ path: currentPath, value: obj, type: typeof obj });
    }
    
    return paths;
  }
  function handleAnalyze() {
    error = '';
    results = [];
    try {
      const parsed = JSON.parse(input);
      const allPaths = findPaths(parsed);
      results = allPaths;
    } catch {
      error = t('json.invalidJson');
    }
  }
  const filteredResults = searchValue
    ? results.filter(r => 
        r.path.toLowerCase().includes(searchValue.toLowerCase()) ||
        String(r.value).toLowerCase().includes(searchValue.toLowerCase())
      )
    : results;
  function copyPath(path: string) {
    navigator.clipboard.writeText(path);
    copied = path;
    setTimeout(() => copied = '', 2000);
  }
  function loadSample() {
    input = JSON.stringify({
      user: {
        name: "John Doe",
        email: "john@example.com",
        address: { city: "New York", zip: "10001" }
      },
      orders: [
        { id: 1, total: 99.99 },
        { id: 2, total: 149.99 }
      ]
    }, null, 2);
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-3">
        <button onclick={loadSample} class="btn-secondary text-sm">
          {t('jsonPathFinder.loadSample')}
        </button>
      </div>

      <div>
        <label class="tool-label">{t('input')}</label>
        <textarea
          bind:value={input}
          placeholder={t('jsonPathFinder.placeholder')}
          class="tool-textarea"></textarea>
      </div>

      <button
        onclick={handleAnalyze}
        class="btn-primary"
      >
        {t('jsonPathFinder.analyze')}
      </button>

      {#if error}
<div class="tool-error">{error}</div>
{/if}

      {#if results.length > 0}

          <input
            type="text"
            bind:value={searchValue}
            placeholder={t('jsonPathFinder.search')}
            class="tool-input"
          />
          <div class="text-sm text-gray-600 dark:text-gray-300">{filteredResults.length} {t('jsonPathFinder.paths')}</div>
          <div class="max-h-96 overflow-y-auto space-y-1">
            {#each filteredResults as item, i (i)}
<div  class="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-700 group">
                <code class="flex-1 text-sm font-mono text-blue-600 dark:text-blue-400">{item.path}</code>
                <span class="text-xs text-gray-500 dark:text-gray-300">{item.type}</span>
                <span class="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{String(item.value)}</span>
                <button
                  onclick={() => copyPath(item.path)}
                  class="opacity-0 group-hover:opacity-100 px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded text-xs"
                >
                  {copied === item.path ? '✓' : t('copy')}
                </button>
              </div>
{/each}
          </div>
        
{/if}
    </div>
  
