<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-rust'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-rust.${key}`;
  }

  let input = $state('{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "is_active": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York"\n  }\n}');

  let output = $state('');

  let structName = $state('Root');

  let useSerde = $state(true);

  let useOption = $state(true);

  // Functions
  function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }
  function toPascalCase(str: string): string {
    return str.split(/[_-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  }
  function getRustType(value: unknown, key: string, structs: Map<string, string>): string {
    if (value === null) return useOption ? 'Option<serde_json::Value>' : 'serde_json::Value';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'i64' : 'f64';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vec<serde_json::Value>';
      const itemType = getRustType(value[0], key, structs);
      return `Vec<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedStructName = toPascalCase(key);
      generateStruct(value as Record<string, unknown>, nestedStructName, structs);
      return nestedStructName;
    }
    return 'serde_json::Value';
  }
  function generateStruct(obj: Record<string, unknown>, name: string, structs: Map<string, string>) {
    const lines: string[] = [];
    
    if (useSerde) {
      lines.push('#[derive(Debug, Clone, Serialize, Deserialize)]');
    } else {
      lines.push('#[derive(Debug, Clone)]');
    }
    lines.push(`pub struct ${name} {`);
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toSnakeCase(key);
      const rustType = getRustType(value, key, structs);
      
      if (useSerde && fieldName !== key) {
        lines.push(`    #[serde(rename = "${key}")]`);
      }
      lines.push(`    pub ${fieldName}: ${rustType},`);
    }
    
    lines.push('}');
    structs.set(name, lines.join('\n'));
  }
  function convert() {
    try {
      const parsed = JSON.parse(input);
      const structs = new Map<string, string>();
      
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateStruct(parsed[0] as Record<string, unknown>, structName, structs);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateStruct(parsed as Record<string, unknown>, structName, structs);
      }
      
      let result = '';
      if (useSerde) {
        result = 'use serde::{Deserialize, Serialize};\n\n';
      }
      result += Array.from(structs.values()).reverse().join('\n\n');
      output = result;
    } catch {
      output = t('errorInvalidJson');
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="json-to-rust-field-6" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('structName')}
          </label>
          <input
            type="text"
            bind:value={structName}
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white" id="json-to-rust-field-6" />
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              bind:checked={useSerde}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useSerde')}
          </label>
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              bind:checked={useOption}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useOptionForNull')}
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="json-to-rust-field-5" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            class="w-full h-80 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')} id="json-to-rust-field-5"></textarea>
        </div>
        <div>
          <label for="json-to-rust-field-4" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')} id="json-to-rust-field-4"></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={convert}
          class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
        >
          {t('convert')}
        </button>
        <button
          onclick={copyToClipboard}
          disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  
