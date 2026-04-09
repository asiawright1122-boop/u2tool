<script lang="ts">
  import { onDestroy } from 'svelte';
  import { generateFullSchema } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-schema-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-schema-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
  interface SchemaOptions {
  draft: 'draft-07' | 'draft-2020-12';
  includeExamples: boolean;
  markAllRequired: boolean;
}

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let copied = $state(false);

  let options = $state({
    draft: 'draft-07',
    includeExamples: false,
    markAllRequired: false,
  });

  let timerRef = $state(null);

  function handleGenerate() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const schema = generateFullSchema(parsed, options);
      output = JSON.stringify(schema, null, 2);
      error = '';
    } catch (e) {
      error = tg('errorInvalidJson') + ': ' + (e as Error).message;
      output = '';
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function handleCopy() {
    if (output) {
      await navigator.clipboard.writeText(output);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }
  function handleClear() {
    input = '';
    output = '';
    error = '';
  }

</script>


    <div class="space-y-4">
      <!-- Input Section -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tg('input')} (JSON)
        </label>
        <textarea
          class="tool-textarea font-mono"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          rows={10}></textarea>
      </div>

      <!-- Options Section -->
      <div class="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('draft')}
          </label>
          <select
            value={options.draft}
            onchange={(e) => options = { ...options, draft: e.target.value as SchemaOptions['draft'] }}
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="draft-07">Draft-07</option>
            <option value="draft-2020-12">Draft-2020-12</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeExamples"
            checked={options.includeExamples}
            onchange={(e) => options = { ...options, includeExamples: e.target.checked }}
            class="rounded border-gray-300 dark:border-gray-600"
          />
          <label for="includeExamples" class="text-sm text-gray-700 dark:text-gray-300">
            {t('includeExamples')}
          </label>
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="markRequired"
            checked={options.markAllRequired}
            onchange={(e) => options = { ...options, markAllRequired: e.target.checked }}
            class="rounded border-gray-300 dark:border-gray-600"
          />
          <label for="markRequired" class="text-sm text-gray-700 dark:text-gray-300">
            {t('markRequired')}
          </label>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button onclick={handleGenerate} class="btn-primary">
          {t('generate')}
        </button>
        <button onclick={handleClear} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Error Section -->
      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      <!-- Output Section -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('generatedSchema')}
            </label>
            <button
              onclick={handleCopy}
              class={`text-sm px-3 py-1 rounded ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
              }`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <textarea
            class="tool-textarea font-mono"
            value={output}
            readOnly
            rows={15}></textarea>
        </div>
{/if}
    </div>
  
