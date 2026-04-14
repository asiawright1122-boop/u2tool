<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['yaml-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.yaml-formatter.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state(`name: John Doe
age: 30
address:
  street: 123 Main St
  city: New York
hobbies:
  - reading
  - coding
  - gaming`);

  let output = $state('');

  let error = $state('');

  let indentSize = $state(2);

  let copied = $state(false);

  let timerRef = $state(null);

  async function format() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const yaml = await import('js-yaml');
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed, { indent: indentSize, lineWidth: -1 });
      output = formatted;
      error = '';
    } catch (e) {
      error = (e as Error).message;
      output = '';
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="yaml-indent" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('indentSize')}</label>
          <select
            id="yaml-indent"
            name="indentSize"
            value={indentSize}
            onchange={(e) => indentSize = Number(e.target.value)}
            class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={format} class="btn-primary">
          {tg('format')}
        </button>
        <button onclick={copyOutput} disabled={!output} class="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
        <button onclick={() => { input = ''; output = ''; error = ''; }} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {#if error}
<div class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="yaml-input" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            id="yaml-input"
            name="yamlInput"
            bind:value={input}
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label for="yaml-output" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            id="yaml-output"
            name="yamlOutput"
            value={output}
            readOnly
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  
