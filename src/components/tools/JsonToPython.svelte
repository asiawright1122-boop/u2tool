<script lang="ts">
  import { generateDataclass, generateImports } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-python'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-python.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface PythonOptions {
  className: string;
  useDataclass: boolean;
  usePydantic: boolean;
  useTypedDict: boolean;
  useOptional: boolean;
}

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let options = $state({
    className: 'MyClass',
    useDataclass: true,
    usePydantic: false,
    useTypedDict: false,
    useOptional: true,
  });

  // Functions
  function convert() {
    error = '';
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Input must be a JSON object');
      }
      
      const hasNull = JSON.stringify(parsed).includes('null');
      const result = generateDataclass(parsed, options.className, options);
      const imports = generateImports(options, hasNull, result.nested.length > 0);
      const allClasses = [...result.nested, result.main].join('\n\n');
      output = imports + allClasses;
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
  "userName": "johnDoe",
  "email": "john@example.com",
  "isActive": true,
  "score": 95.5,
  "tags": ["developer", "admin"],
  "address": {
    "streetName": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`;
    output = '';
    error = '';
  }
  function handleStyleChange(style: 'dataclass' | 'pydantic' | 'typeddict' | 'plain') {
    options = {
      ...options,
      useDataclass: style === 'dataclass',
      usePydantic: style === 'pydantic',
      useTypedDict: style === 'typeddict',
    };
  }

</script>


    <div class="space-y-6">
      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('className')}</label>
          <input
            type="text"
            value={options.className}
            onchange={(e) => options = { ...options, className: e.target.value }}
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('style')}</label>
          <select
            value={options.useDataclass ? 'dataclass' : options.usePydantic ? 'pydantic' : options.useTypedDict ? 'typeddict' : 'plain'}
            onchange={(e) => handleStyleChange(e.target.value as 'dataclass' | 'pydantic' | 'typeddict' | 'plain')}
            class="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            <option value="dataclass">@dataclass</option>
            <option value="pydantic">Pydantic BaseModel</option>
            <option value="typeddict">TypedDict</option>
            <option value="plain">Plain Class</option>
          </select>
        </div>
        <div class="flex items-center">
          <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
            <input
              type="checkbox"
              checked={options.useOptional}
              onchange={(e) => options = { ...options, useOptional: e.target.checked }}
              class="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useOptional')}
          </label>
        </div>
      </div>

      <!-- Input/Output -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">JSON</label>
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
            class="w-full h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Python</label>
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
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
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
  
