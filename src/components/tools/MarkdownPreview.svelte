<script lang="ts">
  import { onDestroy } from 'svelte';
  import { parseMarkdown } from '@/lib/tool-stubs';

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

  // Imports
  import { sanitizeMarkdownHtml } from '@/lib/sanitize';

  let markdown = $state(`# Hello World

This is a **markdown** preview tool.

## Features

- Write markdown on the left
- See preview on the right
- *Italic* and **bold** text
- \`inline code\`

\`\`\`
code blocks
\`\`\`

[Link example](https://example.com)
`);

  let copied = $state(false);

  let timerRef = $state(null);

  let html = $derived(sanitizeMarkdownHtml(parseMarkdown(markdown)));  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyHtml() {
    await navigator.clipboard.writeText(html);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Editor 列 -->
        <div>
          <div class="flex justify-between items-center mb-2 h-8">
            <label class="text-sm font-medium">{t('markdown.editor')}</label>
          </div>
          <textarea
            class="h-96 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500 resize-none"
            bind:value={markdown}
            placeholder={t('inputPlaceholder')}></textarea>
        </div>

        <!-- Preview 列 -->
        <div>
          <div class="flex justify-between items-center mb-2 h-8">
            <label class="text-sm font-medium">{t('markdown.preview')}</label>
            <button
              onclick={copyHtml}
              class={`text-sm px-3 py-1 rounded ${copied ? 'bg-emerald-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('markdown.exportHtml')}
            </button>
          </div>
          <div
            class="h-96 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-auto text-gray-900 dark:text-gray-100">{@html html}</div>
        </div>
      </div>

      <button onclick={() => markdown = ''} class="btn-secondary">
        {t('clear')}
      </button>
    </div>
  
