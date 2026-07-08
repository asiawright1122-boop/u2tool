<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-zod'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-zod.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let schemaName = $state('MySchema');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function inferZodType(value: unknown, key: string, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    
    if (value === null) {
      return 'z.null()';
    }
    
    if (typeof value === 'undefined') {
      return 'z.undefined()';
    }
    
    if (typeof value === 'boolean') {
      return 'z.boolean()';
    }
    
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return 'z.number().int()';
      }
      return 'z.number()';
    }
    
    if (typeof value === 'string') {
      // Check for common patterns
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return 'z.string().email()';
      }
      if (/^https?:\/\//.test(value)) {
        return 'z.string().url()';
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return 'z.string().datetime()';
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        return 'z.string().uuid()';
      }
      return 'z.string()';
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'z.array(z.unknown())';
      }
      const itemType = inferZodType(value[0], key, indent);
      return `z.array(${itemType})`;
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return 'z.object({})';
      }
      
      const fields = entries.map(([k, v]) => {
        const fieldType = inferZodType(v, k, indent + 1);
        return `${indentStr}  ${k}: ${fieldType}`;
      });
      
      return `z.object({\n${fields.join(',\n')}\n${indentStr}})`;
    }
    
    return 'z.unknown()';
  }
  function convert() {
    error = '';
    output = '';

    if (!input.trim()) {
      error = 'Input is empty';
      return;
    }

    try {
      const json = JSON.parse(input);
      
      const zodSchema = inferZodType(json, schemaName, 0);
      
      const lines = [
        "import { z } from 'zod';",
        '',
        `export const ${schemaName} = ${zodSchema};`,
        '',
        `export type ${schemaName}Type = z.infer<typeof ${schemaName}>;`,
      ];
      
      output = lines.join('\n');
    } catch {
      error = 'Invalid JSON';
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadExample() {
    input = JSON.stringify({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      website: "https://example.com",
      createdAt: "2024-01-15T10:30:00Z",
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
      }
    }, null, 2);
    schemaName = 'UserSchema';
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label for="json-to-zod-field-5" class="tool-label">
              {t('schemaName')}
            </label>
            <input
              type="text"
              bind:value={schemaName}
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono" id="json-to-zod-field-5" />
          </div>

          <div>
            <label for="json-to-zod-field-4" class="tool-label">
              {t('jsonInput')}
            </label>
            <textarea
              bind:value={input}
              placeholder={t('placeholder')}
              class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm" id="json-to-zod-field-4"></textarea>
          </div>

          {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
{/if}

          <div class="flex gap-4">
            <button
              onclick={convert}
              class="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              {t('convert')}
            </button>
            <button
              onclick={loadExample}
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('zodOutput')}
            </div>
            {#if output}
<button
                onclick={copyToClipboard}
                class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                {copied ? t('copied') : t('copy')}
              </button>
{/if}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h4 class="font-medium text-amber-800 dark:text-amber-200 mb-2">
          {t('whatIsZod')}
        </h4>
        <p class="text-sm text-amber-700 dark:text-amber-300">
          {t('zodExplanation')}
        </p>
      </div>
    </div>
  
