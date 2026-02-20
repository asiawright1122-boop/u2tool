<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-csharp'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-csharp.${key}`;
  }

  let input = $state('{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "isActive": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York"\n  }\n}');

  let output = $state('');

  let className = $state('Root');

  let useProperties = $state(true);

  let useNullable = $state(true);

  // Functions
  function getCSharpType(value: unknown, key: string, classes: Map<string, string>): string {
    if (value === null) return useNullable ? 'object?' : 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'double';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<object>';
      const itemType = getCSharpType(value[0], key, classes);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedClassName = key.charAt(0).toUpperCase() + key.slice(1);
      generateClass(value as Record<string, unknown>, nestedClassName, classes);
      return nestedClassName;
    }
    return 'object';
  }
  function generateClass(obj: Record<string, unknown>, name: string, classes: Map<string, string>) {
    const lines: string[] = [];
    lines.push(`public class ${name}`);
    lines.push('{');
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = key.charAt(0).toUpperCase() + key.slice(1);
      const csharpType = getCSharpType(value, key, classes);
      
      if (useProperties) {
        lines.push(`    public ${csharpType} ${propName} { get; set; }`);
      } else {
        lines.push(`    public ${csharpType} ${propName};`);
      }
    }
    
    lines.push('}');
    classes.set(name, lines.join('\n'));
  }
  function convert() {
    try {
      const parsed = JSON.parse(input);
      const classes = new Map<string, string>();
      
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateClass(parsed[0] as Record<string, unknown>, className, classes);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateClass(parsed as Record<string, unknown>, className, classes);
      }
      
      const result = Array.from(classes.values()).reverse().join('\n\n');
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
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('className')}
          </label>
          <input
            type="text"
            bind:value={className}
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              bind:checked={useProperties}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useProperties')}
          </label>
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              bind:checked={useNullable}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useNullable')}
          </label>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            class="w-full h-80 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')}></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={convert}
          class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
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
  
