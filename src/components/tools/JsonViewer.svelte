<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-viewer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-viewer.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface TreeNodeProps {
  keyName: string;
  value: unknown;
  depth: number;
  expanded: Set<string>;
  toggleExpand: (path: string) => void;
  path: string;
  itemsLabel: (count: number) => string;
}

  let input = $state('{\n  "name": "John",\n  "age": 30,\n  "active": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  }\n}');

  let parsed = $state(null);

  let error = $state('');

  let expanded = $state(new Set(['root']));

  function toggleExpand(path: string) {
    {
    const next = new Set(expanded);
      if (next.has(path)) next.delete(path);
      else next.add(path);
    expanded = next;
  };
  }

  // Functions
  function parse() {
    try {
      const data = JSON.parse(input);
      parsed = data;
      error = '';
      expanded = new Set(['root']);
    } catch (_e) {
      error = _e instanceof Error ? _e.message : tg('errorInvalidJson');
      parsed = null;
    }
  }
  function expandAll() {
    const paths = new Set<string>();
    const traverse = (obj: unknown, path: string) => {
      paths.add(path);
      if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([k, v]) => traverse(v, `${path}.${k}`));
      }
    };
    if (parsed) traverse(parsed, 'root');
    expanded = paths;
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea bind:value={input}
          class="w-full h-48 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="flex gap-4">
        <button onclick={parse} class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
          {t('parseView')}
        </button>
        <button onclick={expandAll} disabled={!parsed}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('expandAll')}
        </button>
        <button onclick={() => expanded = new Set(['root'])} disabled={!parsed}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('collapseAll')}
        </button>
      </div>

      {#if error}
<div class="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg p-4">{error}</div>
{/if}

      {#if parsed !== null}
<div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <TreeNode keyName="root" value={parsed} depth={0} expanded={expanded} toggleExpand={toggleExpand} path="root" itemsLabel={(count) => t('items', { count })} />
        </div>
{/if}
    </div>
  
