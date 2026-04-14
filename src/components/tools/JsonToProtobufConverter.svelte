<script lang="ts">
  import { EXAMPLE_JSON, generateProtoFile, jsonToProto } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-protobuf-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-protobuf-converter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ProtoField {
  name: string;
  type: string;
  number: number;
  repeated: boolean;
}
  interface ProtoMessage {
  name: string;
  fields: ProtoField[];
  nestedMessages: ProtoMessage[];
}

  let input = $state('');

  let packageName = $state('example');

  let messageName = $state('Root');

  let syntax = $state('proto3');

  let copied = $state(false);

  let result = $derived.by(() => {
    if (!input.trim()) return null;
    try {
      const json = JSON.parse(input);
      const message = jsonToProto(json, messageName);
      return generateProtoFile(message, packageName, syntax);
    } catch {
      return null;
    }
  });

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }
  }

  function handleClear() {
    input = '';
  }

  function loadExample() {
    input = JSON.stringify(EXAMPLE_JSON, null, 2);
  }

</script>


    <div class="space-y-6">
      <!-- Input -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">
            JSON {tCommon('input')}
          </label>
          <button
            onclick={loadExample}
            class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {t('loadExample')}
          </button>
        </div>
        <textarea
          bind:value={input}
          placeholder={'{"name": "John", "age": 30}'}
          class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
      </div>

      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('packageName')}
          </label>
          <input
            type="text"
            bind:value={packageName}
            placeholder={t("packageNamePlaceholder")}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('messageName')}
          </label>
          <input
            type="text"
            bind:value={messageName}
            placeholder={t("messageNamePlaceholder")}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('syntax')}
          </label>
          <select
            value={syntax}
            onchange={(e) => syntax = e.target.value as 'proto3' | 'proto2'}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="proto3">proto3</option>
            <option value="proto2">proto2</option>
          </select>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          onclick={handleClear}
          class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Error -->
      {#if input.trim()}
{#if !result}
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {t('invalidJson')}
        </div>
      {/if}
{/if}

      <!-- Result -->
      {#if result}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label">
              {t('protocolBuffers')}
            </label>
            <button
              onclick={handleCopy}
              class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
            {result}
          </pre>
        </div>
{/if}

      <!-- Type Mapping Reference -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">{t('typeMapping')}</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-amber-700 dark:text-amber-400">
          <div>string → string</div>
          <div>number (int) → int32/int64</div>
          <div>number (float) → double</div>
          <div>boolean → bool</div>
          <div>array → repeated</div>
          <div>object → message</div>
          <div>ISO date → Timestamp</div>
          <div>null → NullValue</div>
        </div>
      </div>
    </div>
  
