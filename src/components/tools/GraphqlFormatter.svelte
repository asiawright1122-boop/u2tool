<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['graphql-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.graphql-formatter.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  function prettyPrintGraphQL(source: string): string {
    const input = source.replace(/\r\n/g, '\n').trim();
    if (!input) return '';

    let formatted = '';
    let indent = 0;
    let inString = false;
    let quote = '';
    let escaped = false;

    const appendIndent = () => {
      formatted += '  '.repeat(Math.max(0, indent));
    };

    for (const char of input) {
      if (inString) {
        formatted += char;
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          inString = false;
          quote = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quote = char;
        formatted += char;
        continue;
      }

      if (char === '{' || char === '[') {
        formatted = formatted.trimEnd();
        if (formatted && !formatted.endsWith('\n') && !formatted.endsWith('(')) {
          formatted += ' ';
        }
        formatted += `${char}\n`;
        indent += 1;
        appendIndent();
        continue;
      }

      if (char === '}' || char === ']') {
        formatted = formatted.trimEnd();
        indent = Math.max(0, indent - 1);
        formatted += `\n${'  '.repeat(indent)}${char}`;
        continue;
      }

      if (char === ',') {
        formatted += ',\n';
        appendIndent();
        continue;
      }

      if (char === '\n') {
        formatted = formatted.trimEnd();
        formatted += '\n';
        appendIndent();
        continue;
      }

      if (/\s/.test(char)) {
        if (formatted && !/\s$/.test(formatted)) {
          formatted += ' ';
        }
        continue;
      }

      formatted += char;
    }

    return formatted.trim();
  }

  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function formatGraphQL() {
    if (!input.trim()) return;
    error = '';

    try {
      const formatted = prettyPrintGraphQL(input);
      output = formatted;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Invalid GraphQL';
    }
  }
  function minifyGraphQL() {
    if (!input.trim()) return;
    error = '';

    try {
      // Remove comments and extra whitespace
        const minified = input
        .replace(/#[^\n]*/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}():,])\s*/g, '$1') // Remove space around punctuation
        .trim();
      output = minified;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Invalid GraphQL';
    }
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Input -->
        <div>
          <label class="tool-label">
            {tc('input')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t('placeholder')}
            rows={15}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>

        <!-- Output -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tc('output')}
            </label>
            {#if output}
<button
                onclick={copyToClipboard}
                class={`px-3 py-1 rounded text-sm ${
                  copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'
                }`}
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
{/if}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={tc('outputPlaceholder')}
            rows={15}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
        </div>
      </div>

      <!-- Error -->
      {#if error}
<div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
{/if}

      <!-- Buttons -->
      <div class="flex gap-3">
        <button
          onclick={formatGraphQL}
          disabled={!input.trim()}
          class="flex-1 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50"
        >
          {tc('format')}
        </button>
        <button
          onclick={minifyGraphQL}
          disabled={!input.trim()}
          class="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {t('minify')}
        </button>
      </div>

      <!-- Example -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">{t('example')}</h4>
        <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      title
      createdAt
    }
  }
}`}
        </pre>
      </div>
    </div>
  
