<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-proto'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-proto.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let messageName = $state('MyMessage');

  let packageName = $state('mypackage');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function inferType(value: unknown, key: string): string {
    if (value === null) return 'string';
    if (typeof value === 'boolean') return 'bool';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        if (value > 2147483647 || value < -2147483648) return 'int64';
        return 'int32';
      }
      return 'double';
    }
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'google.protobuf.Timestamp';
      return 'string';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return 'repeated string';
      return `repeated ${inferType(value[0], key)}`;
    }
    if (typeof value === 'object') {
      return toPascalCase(key);
    }
    return 'string';
  }
  function toPascalCase(str: string): string {
    return str
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  }
  function toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }
  function generateProto(obj: Record<string, unknown>, name: string, indent: number = 0) {
    const lines: string[] = [];
    const nestedMessages: string[] = [];
    const indentStr = '  '.repeat(indent);
    
    lines.push(`${indentStr}message ${name} {`);
    
    let fieldNumber = 1;
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toSnakeCase(key);
      let fieldType = inferType(value, key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedName = toPascalCase(key);
        nestedMessages.push(...generateProto(value as Record<string, unknown>, nestedName, indent + 1));
        fieldType = nestedName;
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const nestedName = toPascalCase(key);
        nestedMessages.push(...generateProto(value[0] as Record<string, unknown>, nestedName, indent + 1));
        fieldType = `repeated ${nestedName}`;
      }
      
      lines.push(`${indentStr}  ${fieldType} ${fieldName} = ${fieldNumber};`);
      fieldNumber++;
    }
    
    if (nestedMessages.length > 0) {
      lines.push('');
      lines.push(...nestedMessages);
    }
    
    lines.push(`${indentStr}}`);
    return lines;
  }
  function convert() {
    error = '';
    output = '';
    
    if (!input.trim()) {
      error = t('errors.empty');
      return;
    }

    try {
      const json = JSON.parse(input);
      
      if (typeof json !== 'object' || json === null) {
        error = t('errors.notObject');
        return;
      }

      const lines: string[] = [
        'syntax = "proto3";',
        '',
        `package ${packageName};`,
        '',
      ];

      if (JSON.stringify(json).includes('Timestamp')) {
        lines.push('import "google/protobuf/timestamp.proto";');
        lines.push('');
      }

      const messageLines = generateProto(
        Array.isArray(json) ? json[0] : json,
        messageName
      );
      lines.push(...messageLines);

      output = lines.join('\n');
    } catch {
      error = t('errors.invalidJson');
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('messageName')}
          </label>
          <input
            type="text"
            bind:value={messageName}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('packageName')}
          </label>
          <input
            type="text"
            bind:value={packageName}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('jsonInput')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('placeholder')}
            class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('protoOutput')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>
      </div>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}

      <div class="flex gap-4">
        <button
          onclick={convert}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        {#if output}
<button
            onclick={copyToClipboard}
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>
{/if}
      </div>
    </div>
  
