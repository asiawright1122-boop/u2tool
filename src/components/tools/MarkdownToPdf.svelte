<script lang="ts">
  import { onDestroy } from 'svelte';
  import { renderMarkdownHtml } from '@/lib/markdown-html';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['markdown-to-pdf'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.markdown-to-pdf.${key}`;
  }

  let markdown = $state(`# Sample Document

## Introduction

This is a **sample markdown** document that demonstrates the *Markdown to PDF* converter.

### Features

- Convert markdown to PDF
- Support for headings, lists, and formatting
- Code blocks with syntax highlighting
- Tables and blockquotes

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Table Example

| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |

> This is a blockquote that can span multiple lines.

---

**Thank you for using our tool!**
`);

  let title = $state('Document');

  let fontSize = $state(12);

  let pageSize = $state('a4');

  let timerRef = $state(null);

  let previewRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const allowedPageSizes = new Set(['a4', 'letter', 'legal']);
  const allowedFontSizes = new Set([10, 11, 12, 14, 16]);

  function getPrintTitle(): string {
    return title.trim() || 'Document';
  }
  function getPrintPageSize(): string {
    return allowedPageSizes.has(pageSize) ? pageSize : 'a4';
  }
  function getPrintFontSize(): number {
    return allowedFontSizes.has(fontSize) ? fontSize : 12;
  }
  function getPrintStyles(): string {
    return `
      @page { size: ${getPrintPageSize()}; margin: 2cm; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: ${getPrintFontSize()}pt;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 { font-size: 2em; border-bottom: 2px solid #333; padding-bottom: 0.3em; }
      h2 { font-size: 1.5em; border-bottom: 1px solid #ddd; padding-bottom: 0.3em; }
      h3 { font-size: 1.25em; }
      code {
        background: #f4f4f4;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
      }
      pre {
        background: #f4f4f4;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
      }
      pre code { background: none; padding: 0; }
      blockquote {
        border-left: 4px solid #ddd;
        margin: 0;
        padding-left: 16px;
        color: #666;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px 12px;
        text-align: left;
      }
      th { background: #f4f4f4; }
      hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
      ul { padding-left: 24px; }
      li { margin: 4px 0; }
    `;
  }
  async function generatePdf() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = renderMarkdownHtml(markdown);
    const printDocument = printWindow.document;
    const head = printDocument.head ?? printDocument.documentElement.appendChild(printDocument.createElement('head'));
    const body = printDocument.body ?? printDocument.documentElement.appendChild(printDocument.createElement('body'));

    head.replaceChildren();
    body.replaceChildren();
    printDocument.documentElement.lang = locale;
    printDocument.title = getPrintTitle();

    const meta = printDocument.createElement('meta');
    meta.setAttribute('charset', 'utf-8');
    const style = printDocument.createElement('style');
    style.textContent = getPrintStyles();
    head.append(meta, style);

    body.innerHTML = htmlContent;
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="markdown-to-pdf-field-9" class="tool-label">
            {t('documentTitle')}
          </label>
          <input
            type="text"
            bind:value={title}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="markdown-to-pdf-field-9" />
        </div>
        <div>
          <label for="markdown-to-pdf-field-8" class="tool-label">
            {t('fontSize')}
          </label>
          <select
            value={fontSize}
            onchange={(e) => fontSize = parseInt(e.target.value)}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="markdown-to-pdf-field-8">
            <option value={10}>10pt</option>
            <option value={11}>11pt</option>
            <option value={12}>12pt</option>
            <option value={14}>14pt</option>
            <option value={16}>16pt</option>
          </select>
        </div>
        <div>
          <label for="markdown-to-pdf-field-7" class="tool-label">
            {t('pageSize')}
          </label>
          <select
            bind:value={pageSize}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="markdown-to-pdf-field-7">
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="markdown-to-pdf-field-6" class="tool-label">
            {t('markdownInput')}
          </label>
          <textarea
            bind:value={markdown}
            class="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')} id="markdown-to-pdf-field-6"></textarea>
        </div>

        <div>
          <div class="tool-label">
            {t('preview')}
          </div>
          <div
            bind:this={previewRef}
            class="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-auto prose prose-sm dark:prose-invert max-w-none"
            style="font-size: {fontSize}px">{@html renderMarkdownHtml(markdown)}</div>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={generatePdf}
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> {t('generatePdf')}
        </button>
        <button
          onclick={() => markdown = ''}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('clear')}
        </button>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('supportedSyntax')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-amber-700 dark:text-amber-400">
          <div>• {t('headings')}</div>
          <div>• {t('boldItalic')}</div>
          <div>• {t('lists')}</div>
          <div>• {t('codeBlocks')}</div>
          <div>• {t('tables')}</div>
          <div>• {t('blockquotes')}</div>
          <div>• {t('horizontalRules')}</div>
          <div>• {t('inlineCode')}</div>
        </div>
      </div>
    </div>
  
