<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-flattener'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-flattener.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('{\n  "user": {\n    "name": "John",\n    "address": {\n      "city": "New York",\n      "zip": "10001"\n    },\n    "tags": ["developer", "designer"]\n  },\n  "active": true\n}');

  let output = $state('');

  let delimiter = $state('.');

  let mode = $state('flatten');

  // Functions
  function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(result, flattenObject(item as Record<string, unknown>, `${newKey}[${index}]`));
          } else {
            result[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        result[newKey] = value;
      }
    }
    return result;
  }
  function unflattenObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const keys = key.split(delimiter);
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in current)) {
          current[k] = {};
        }
        current = current[k] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value;
    }
    return result;
  }
  function process() {
    try {
      const parsed = JSON.parse(input);
      let result;
      
      if (mode === 'flatten') {
        result = flattenObject(parsed);
      } else {
        result = unflattenObject(parsed);
      }
      
      output = JSON.stringify(result, null, 2);
    } catch {
      output = `${tg('error')}: ${tg('errorInvalidJson')}`;
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('mode')}</label>
          <select value={mode} onchange={(e) => mode = e.target.value as 'flatten' | 'unflatten'}
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white">
            <option value="flatten">{t('flatten')}</option>
            <option value="unflatten">{t('unflatten')}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('delimiter')}</label>
          <input type="text" bind:value={delimiter}
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
          <textarea bind:value={input}
            class="w-full h-80 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea value={output} readOnly
            class="w-full h-80 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')}></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button onclick={process}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
          {mode === 'flatten' ? t('flatten') : t('unflatten')}
        </button>
        <button onclick={copyToClipboard} disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>
    </div>
  
