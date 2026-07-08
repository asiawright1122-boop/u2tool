<script lang="ts">
  import { generateKotlinClass } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-kotlin'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-kotlin.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface KotlinOptions {
  className: string;
  packageName: string;
  useDataClass: boolean;
  useNullable: boolean;
  useMoshi: boolean;
  useGson: boolean;
  useKotlinx: boolean;
}

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let options = $state({
    className: 'MyClass',
    packageName: 'com.example',
    useDataClass: true,
    useNullable: true,
    useMoshi: false,
    useGson: false,
    useKotlinx: false,
  });

  // Functions
  function convert() {
    error = '';
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Input must be a JSON object');
      }
      
      const result = generateKotlinClass(parsed, options.className, options);
      const allClasses = [result.main, ...result.nested].join('\n\n');
      output = allClasses;
    } catch (_err) {
      error = _err instanceof Error ? _err.message : tg('errorProcessing');
      output = '';
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }
  function loadSample() {
    input = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "score": 95.5,
  "tags": ["developer", "admin"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`;
    output = '';
    error = '';
  }
  function handleSerializerChange(serializer: 'none' | 'moshi' | 'gson' | 'kotlinx') {
    options = {
      ...options,
      useMoshi: serializer === 'moshi',
      useGson: serializer === 'gson',
      useKotlinx: serializer === 'kotlinx',
    };
  }

</script>


    <div class="space-y-6">
      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="json-to-kotlin-field-8" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('className')}</label>
          <input
            type="text"
            value={options.className}
            onchange={(e) => options = { ...options, className: e.target.value }}
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white" id="json-to-kotlin-field-8" />
        </div>
        <div>
          <label for="json-to-kotlin-field-7" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('packageName')}</label>
          <input
            type="text"
            value={options.packageName}
            onchange={(e) => options = { ...options, packageName: e.target.value }}
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white" id="json-to-kotlin-field-7" />
        </div>
        <div>
          <label for="json-to-kotlin-field-6" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('serializer')}</label>
          <select
            value={options.useMoshi ? 'moshi' : options.useGson ? 'gson' : options.useKotlinx ? 'kotlinx' : 'none'}
            onchange={(e) => handleSerializerChange(e.target.value as 'none' | 'moshi' | 'gson' | 'kotlinx')}
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white" id="json-to-kotlin-field-6">
            <option value="none">{t('noSerializer')}</option>
            <option value="moshi">Moshi</option>
            <option value="gson">Gson</option>
            <option value="kotlinx">Kotlinx Serialization</option>
          </select>
        </div>
        <div class="flex flex-col gap-2 justify-center">
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
            <input
              type="checkbox"
              checked={options.useDataClass}
              onchange={(e) => options = { ...options, useDataClass: e.target.checked }}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useDataClass')}
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
            <input
              type="checkbox"
              checked={options.useNullable}
              onchange={(e) => options = { ...options, useNullable: e.target.checked }}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useNullable')}
          </label>
        </div>
      </div>

      <!-- Input/Output -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('input')}</div>
            <button
              onclick={loadSample}
              class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-xs"
            >
              {t('loadSample')}
            </button>
          </div>
          <textarea
            bind:value={input}
            placeholder={t('inputPlaceholder')}
            class="w-full h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('output')}</div>
            <button
              onclick={copyOutput}
              disabled={!output}
              class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-xs disabled:opacity-50"
            >
              {t('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-96 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white resize-none"></textarea>
        </div>
      </div>

      <!-- Convert Button -->
      <div class="flex justify-center">
        <button
          onclick={convert}
          disabled={!input.trim()}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
        >
          {t('convert')}
        </button>
      </div>

      <!-- Error -->
      {#if error}
<div class="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
{/if}
    </div>
  
