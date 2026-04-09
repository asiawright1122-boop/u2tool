<script lang="ts">
  import { onDestroy } from 'svelte';
  import { generateGraphQLSchema } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools']['json-to-graphql'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-graphql.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let typeName = $state('User');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert() {
    if (!input.trim()) {
      output = '';
      error = '';
      return;
    }
    try {
      const json = JSON.parse(input);
      const schema = generateGraphQLSchema(json, typeName);
      output = schema;
      error = '';
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : t('errorInvalidJson');
      output = '';
    }
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadSample() {
    input = JSON.stringify({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      balance: 1234.56,
      createdAt: "2024-01-15T10:30:00Z",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      tags: ["developer", "designer"]
    }, null, 2);
    typeName = 'User';
  }

</script>


    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-2">{tg('typeName')}</label>
          <input
            type="text"
            bind:value={typeName}
            class="tool-input"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <button onclick={loadSample} class="btn-secondary mt-6">
          {tg('loadSample')}
        </button>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">{tg('jsonInput')}</label>
        <textarea
          class="tool-textarea font-mono"
          bind:value={input}
          placeholder={tg('placeholder')}
          rows={10}></textarea>
      </div>

      {#if error}
<div class="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
{/if}

      <div class="flex gap-2">
        <button onclick={convert} class="btn-primary">{t('convert')}</button>
        <button onclick={() => { input = ''; output = ''; error = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium">{tg('graphqlOutput')}</label>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <pre class="tool-textarea font-mono text-sm whitespace-pre">{output}</pre>
        </div>
{/if}

      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm">
        <h3 class="font-medium mb-2 text-gray-900 dark:text-white">{tg('typeInference')}</h3>
        <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
          <div>String → <code class="text-green-600 dark:text-green-400">String</code></div>
          <div>Integer → <code class="text-green-600 dark:text-green-400">Int</code></div>
          <div>Float → <code class="text-green-600 dark:text-green-400">Float</code></div>
          <div>Boolean → <code class="text-green-600 dark:text-green-400">Boolean</code></div>
          <div>UUID → <code class="text-green-600 dark:text-green-400">ID</code></div>
          <div>ISO Date → <code class="text-green-600 dark:text-green-400">DateTime</code></div>
        </div>
      </div>
    </div>
  
