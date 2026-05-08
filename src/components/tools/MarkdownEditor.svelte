<script lang="ts">
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

  import { renderMarkdownHtml } from '@/lib/markdown-html';

  let markdown = $state(`# Welcome to Markdown Editor

## Features
- **Bold** and *italic* text
- Lists and checkboxes
- Code blocks
- Links and images

## Example Code
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Checklist
- [x] Write markdown
- [ ] Preview result
- [ ] Export content

> This is a blockquote

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
` as string);

  let viewMode = $state('split');

  function getHtml() {
    return renderMarkdownHtml(markdown);
  }

  // Functions
  function handleCopy() {
    navigator.clipboard.writeText(markdown);
  }
  function handleCopyHtml() {
    navigator.clipboard.writeText(getHtml());
  }
  function handleDownload(type: 'md' | 'html') {
    const content = type === 'md' ? markdown : getHtml();
    const blob = new Blob([content as string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function insertTemplate(template: string) {
    markdown = markdown + '\n' + template;
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <div class="flex gap-2">
          <button
            onclick={() => viewMode = 'edit'}
            class={`px-3 py-1 rounded text-sm ${viewMode === 'edit' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {t('markdownEditor.edit')}
          </button>
          <button
            onclick={() => viewMode = 'split'}
            class={`px-3 py-1 rounded text-sm ${viewMode === 'split' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {t('markdownEditor.split')}
          </button>
          <button
            onclick={() => viewMode = 'preview'}
            class={`px-3 py-1 rounded text-sm ${viewMode === 'preview' ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {t('markdownEditor.preview')}
          </button>
        </div>
        <div class="flex gap-2">
          <button onclick={handleCopy} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            {t('markdownEditor.copyMd')}
          </button>
          <button onclick={handleCopyHtml} class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            {t('markdownEditor.copyHtml')}
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={() => insertTemplate('**bold**')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">B</button>
        <button onclick={() => insertTemplate('*italic*')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded italic">I</button>
        <button onclick={() => insertTemplate('# Heading')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">H1</button>
        <button onclick={() => insertTemplate('## Heading')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">H2</button>
        <button onclick={() => insertTemplate('- List item')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">List</button>
        <button onclick={() => insertTemplate('```\ncode\n```')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Code</button>
        <button onclick={() => insertTemplate('[link](url)')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Link</button>
        <button onclick={() => insertTemplate('![alt](image-url)')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Image</button>
        <button onclick={() => insertTemplate('| Col1 | Col2 |\n|------|------|\n| A    | B    |')} class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Table</button>
      </div>

      <div class={`grid gap-4 ${viewMode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {#if viewMode === 'edit' || viewMode === 'split'}
<div class="space-y-2">
            <label class="tool-label">
              {t('markdownEditor.markdown')}
            </label>
            <textarea
              bind:value={markdown}
              class="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm resize-none"
              placeholder={t('markdownEditor.placeholder')}></textarea>
          </div>
{/if}

        {#if viewMode === 'preview' || viewMode === 'split'}
<div class="space-y-2">
            <label class="tool-label">
              {t('markdownEditor.previewLabel')}
            </label>
            <div
              class="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-auto prose dark:prose-invert max-w-none">{@html getHtml() as string}</div>
          </div>
{/if}
      </div>

      <div class="flex gap-2">
        <button onclick={() => handleDownload('md')} class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          {t('markdownEditor.downloadMd')}
        </button>
        <button onclick={() => handleDownload('html')} class="px-4 py-2 btn-success rounded-lg hover:bg-green-700">
          {t('markdownEditor.downloadHtml')}
        </button>
        <button onclick={() => markdown = ''} class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
          {t('markdownEditor.clear')}
        </button>
      </div>
    </div>
  
