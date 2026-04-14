<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-php'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-php.${key}`;
  }

  let input = $state('{\n  "name": "John Doe",\n  "age": 30,\n  "active": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  }\n}');

  let output = $state('');

  let useShortSyntax = $state(true);

  // Functions
  function jsonToPhp(value: unknown, indent: number = 0): string {
    const spaces = '    '.repeat(indent);
    const nextSpaces = '    '.repeat(indent + 1);
    
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return useShortSyntax ? '[]' : 'array()';
      
      const isSimple = value.every(v => typeof v !== 'object' || v === null);
      if (isSimple && value.length <= 5) {
        const items = value.map(v => jsonToPhp(v, 0)).join(', ');
        return useShortSyntax ? `[${items}]` : `array(${items})`;
      }
      
      const items = value.map(v => `${nextSpaces}${jsonToPhp(v, indent + 1)}`).join(',\n');
      return useShortSyntax 
        ? `[\n${items}\n${spaces}]`
        : `array(\n${items}\n${spaces})`;
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return useShortSyntax ? '[]' : 'array()';
      
      const items = entries.map(([k, v]) => 
        `${nextSpaces}'${k}' => ${jsonToPhp(v, indent + 1)}`
      ).join(',\n');
      
      return useShortSyntax 
        ? `[\n${items}\n${spaces}]`
        : `array(\n${items}\n${spaces})`;
    }
    
    return 'null';
  }
  function convert() {
    try {
      const parsed = JSON.parse(input);
      const php = `<?php\n\n$data = ${jsonToPhp(parsed)};\n`;
      output = php;
    } catch {
      output = t('errorInvalidJson');
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input type="checkbox" bind:checked={useShortSyntax}
            class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          {t('useShortArraySyntax')}
        </label>
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
        <button onclick={convert}
          class="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
          {t('convert')}
        </button>
        <button onclick={copyToClipboard} disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>
    </div>
  
