<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-diff'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-diff.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let json1 = $state('');

  let json2 = $state('');

  let diff = $state([]);

  let error = $state('');

  // Functions
  function compare() {
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      const diffs: { path: string; type: string; val1?: string; val2?: string }[] = [];
      
      const findDiffs = (o1: unknown, o2: unknown, path: string) => {
        if (typeof o1 !== typeof o2) {
          diffs.push({ path, type: 'type', val1: typeof o1, val2: typeof o2 });
          return;
        }
        if (o1 === null || o2 === null) {
          if (o1 !== o2) diffs.push({ path, type: 'value', val1: String(o1), val2: String(o2) });
          return;
        }
        if (typeof o1 !== 'object') {
          if (o1 !== o2) diffs.push({ path, type: 'value', val1: String(o1), val2: String(o2) });
          return;
        }
        const keys = new Set([...Object.keys(o1 as object), ...Object.keys(o2 as object)]);
        keys.forEach(key => {
          const newPath = path ? `${path}.${key}` : key;
          if (!(key in (o1 as object))) diffs.push({ path: newPath, type: 'added', val2: JSON.stringify((o2 as Record<string, unknown>)[key]) });
          else if (!(key in (o2 as object))) diffs.push({ path: newPath, type: 'removed', val1: JSON.stringify((o1 as Record<string, unknown>)[key]) });
          else findDiffs((o1 as Record<string, unknown>)[key], (o2 as Record<string, unknown>)[key], newPath);
        });
      };
      
      findDiffs(obj1, obj2, '');
      diff = diffs;
      error = '';
    } catch {
      error = tg('json.invalidJson');
      diff = [];
    }
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('json1')}</label>
          <textarea bind:value={json1} class="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('placeholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('json2')}</label>
          <textarea bind:value={json2} class="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('placeholder')}></textarea>
        </div>
      </div>
      <button onclick={compare} class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">{t('compare')}</button>
      {#if error}
<p class="text-red-600 dark:text-red-400">{error}</p>
{/if}
      {#if diff.length > 0}
<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('differences')}: {diff.length}</h3>
          <div class="space-y-2 max-h-64 overflow-auto">
            {#each diff as d, i (i)}
<div  class={`p-2 rounded text-sm ${d.type === 'added' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : d.type === 'removed' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'}`}>
                <span class="font-mono">{d.path}</span>: {d.type === 'added' ? `+ ${d.val2}` : d.type === 'removed' ? `- ${d.val1}` : `${d.val1} → ${d.val2}`}
              </div>
{/each}
          </div>
        </div>
{/if}
      {#if diff.length === 0}
!error && json1 && json2 && <p class="text-green-600 dark:text-green-400">{t('identical')}</p>
{/if}
    </div>
  
