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

  let jsonInput = $state('');

  let output = $state('');

  let interfaceName = $state('Root');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function getType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const types = [...new Set(value.map(getType))];
      return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`;
    }
    if (typeof value === 'object') return 'object';
    return typeof value;
  }
  function jsonToInterface(obj: Record<string, unknown>, name: string, interfaces: string[] = []): string {
    const lines: string[] = [`interface ${name} {`];
    
    for (const [key, value] of Object.entries(obj)) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      
      if (value === null) {
        lines.push(`  ${safeKey}: null;`);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const itemName = name + key.charAt(0).toUpperCase() + key.slice(1) + 'Item';
          jsonToInterface(value[0] as Record<string, unknown>, itemName, interfaces);
          lines.push(`  ${safeKey}: ${itemName}[];`);
        } else {
          lines.push(`  ${safeKey}: ${getType(value)};`);
        }
      } else if (typeof value === 'object') {
        const nestedName = name + key.charAt(0).toUpperCase() + key.slice(1);
        jsonToInterface(value as Record<string, unknown>, nestedName, interfaces);
        lines.push(`  ${safeKey}: ${nestedName};`);
      } else {
        lines.push(`  ${safeKey}: ${typeof value};`);
      }
    }
    
    lines.push('}');
    interfaces.push(lines.join('\n'));
    return interfaces.join('\n\n');
  }
  function convert() {
    try {
      const parsed = JSON.parse(jsonInput);
      if (typeof parsed !== 'object' || parsed === null) {
        output = `type ${interfaceName} = ${typeof parsed};`;
        return;
      }
      const interfaces: string[] = [];
      jsonToInterface(parsed, interfaceName, interfaces);
      output = interfaces.reverse().join('\n\n');
    } catch {
      output = t('json.invalidJson');
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <label class="text-sm text-gray-600 dark:text-gray-300">{t('jsonTs.interfaceName')}:</label>
        <input
          type="text"
          value={interfaceName}
          onchange={(e) => interfaceName = e.target.value || 'Root'}
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-gray-900 dark:text-white"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">JSON</label>
          <textarea
            bind:value={jsonInput}
            class="w-full h-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-white"
            placeholder={t('jsonTs.jsonPlaceholder')}></textarea>
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-sm text-gray-600 dark:text-gray-300">TypeScript</label>
            <button onclick={copyOutput} class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            class="w-full h-64 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"></textarea>
        </div>
      </div>

      <button
        onclick={convert}
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
      >
        {t('convert')}
      </button>
    </div>
  
