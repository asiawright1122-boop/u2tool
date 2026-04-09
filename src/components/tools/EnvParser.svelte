<script lang="ts">
  import { onDestroy } from 'svelte';
  import { parseEnvContent, toEnv, toJson, toYaml } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['env-parser'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.env-parser.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface EnvEntry {
  key: string;
  value: string;
  line: number;
  isValid: boolean;
  isDuplicate: boolean;
  isEmpty: boolean;
  error?: string;
}
  interface ParseResult {
  entries: EnvEntry[];
  errors: string[];
}

  let input = $state('');

  let parseResult = $state({ entries: [], errors: [] });

  let outputFormat = $state('env');

  let showValues = $state(false);

  let copied = $state(false);

  let timerRef = $state(null);

  function handleParse() {
    if (!input.trim()) {
      parseResult = { entries: [], errors: [] };
      return;
    }
    const result = parseEnvContent(input);
    parseResult = result;
  }

  function getOutput() {
    const { entries } = parseResult;
    if (entries.length === 0) return '';
    
    switch (outputFormat) {
      case 'json':
        return toJson(entries);
      case 'yaml':
        return toYaml(entries);
      default:
        return toEnv(entries);
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function handleCopy() {
    const output = getOutput();
    if (output) {
      await navigator.clipboard.writeText(output);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }
  function handleClear() {
    input = '';
    parseResult = { entries: [], errors: [] };
  }
  const output = getOutput();

</script>


    <div class="space-y-4">
      <!-- Input Section -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tg('input')}
        </label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          rows={8}></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button onclick={handleParse} class="btn-primary">
          {t('parse')}
        </button>
        <button onclick={handleClear} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Errors Section -->
      {#if parseResult.errors.length > 0}
<div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            {t('issues')} ({parseResult.errors.length})
          </h3>
          <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {#each parseResult.errors as error, index (index)}
<li >• {error}</li>
{/each}
          </ul>
        </div>
{/if}

      <!-- Parsed Entries Table -->
      {#if parseResult.entries.length > 0}
<div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('parsedEntries')} ({parseResult.entries.length})
            </h3>
            <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                bind:checked={showValues}
                class="rounded border-gray-300 dark:border-gray-600"
              />
              {t('showValues')}
            </label>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('line')}</th>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('key')}</th>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('value')}</th>
                  <th class="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('status')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each parseResult.entries as entry, index (index)}
<tr 
                    class={
                      entry.isDuplicate ? 'bg-red-50 dark:bg-red-900/20' :
                      entry.isEmpty ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      !entry.isValid ? 'bg-red-50 dark:bg-red-900/20' :
                      ''
                    }
                  >
                    <td class="px-4 py-2 text-gray-600 dark:text-gray-400">{entry.line}</td>
                    <td class="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">{entry.key}</td>
                    <td class="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {showValues 
                        ? entry.value 
                        : isSensitiveKey(entry.key) 
                          ? maskValue(entry.value)
                          : entry.value
                      }
                    </td>
                    <td class="px-4 py-2">
                      {#if entry.error}
<span class="text-red-600 dark:text-red-400">{entry.error}</span>
{:else}
<span class="text-green-600 dark:text-green-400">✓</span>
{/if}
                    </td>
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
        </div>
{/if}

      <!-- Output Format Selection -->
      {#if parseResult.entries.length > 0}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('outputFormat')}
          </label>
          <div class="flex gap-2">
            {#each (['env', 'json', 'yaml'] as const) as format (format)}
<button 
                onclick={() => outputFormat = format}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  outputFormat === format
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {format.toUpperCase()}
              </button>
{/each}
          </div>
        </div>
{/if}

      <!-- Output Section -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tg('output')}
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
            rows={10}></textarea>
        </div>
{/if}
    </div>
  
