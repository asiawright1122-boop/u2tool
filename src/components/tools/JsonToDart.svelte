<script lang="ts">
  import { jsonToDart } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-dart'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-dart.${key}`;
  }

  let input = $state('{\n  "id": 1,\n  "name": "John",\n  "email": "john@example.com",\n  "is_active": true\n}');

  let className = $state('User');

  let output = $state('');

  let error = $state('');

  // Functions
  function handleConvert() {
    try {
      error = '';
      output = jsonToDart(input, className);
    } catch (_e) {
      error = _e instanceof Error ? _e.message : 'Invalid JSON';
      output = '';
    }
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-4 items-end">
        <div class="flex-1">
          <label for="json-to-dart-field-6" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('className')}</label>
          <input type="text" bind:value={className}
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white" id="json-to-dart-field-6" />
        </div>
        <button onclick={handleConvert} class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          {t('convert')}
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="json-to-dart-field-5" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">JSON</label>
          <textarea bind:value={input}
            class="w-full h-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm" id="json-to-dart-field-5"></textarea>
        </div>
        <div>
          <label for="json-to-dart-field-4" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Dart</label>
          <textarea value={output} readOnly
            class="w-full h-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-green-600 dark:text-green-400 font-mono text-sm" id="json-to-dart-field-4"></textarea>
        </div>
      </div>
      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">{error}</div>
{/if}
    </div>
  
