<script lang="ts">
  import { onDestroy } from 'svelte';

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
  function parseMarkdown(md: string): string {
    let html = md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`{3}(\w+)?\n([\s\S]*?)`{3}/gim, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/^---$/gim, '<hr>')
      .replace(/\n/gim, '<br>');

    html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
    html = html.replace(/<\/ul><br><ul>/gim, '');

    const tableRegex = /\|(.+)\|[\r\n]+\|[-:| ]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/g;
    html = html.replace(tableRegex, (match, header, body) => {
      const headers = header.split('|').filter((h: string) => h.trim());
      const rows = body.trim().split(/[\r\n]+/).map((row: string) => 
        row.split('|').filter((c: string) => c.trim())
      );
      
      let table = '<table><thead><tr>';
      headers.forEach((h: string) => { table += `<th>${h.trim()}</th>`; });
      table += '</tr></thead><tbody>';
      rows.forEach((row: string[]) => {
        table += '<tr>';
        row.forEach((cell: string) => { table += `<td>${cell.trim()}</td>`; });
        table += '</tr>';
      });
      table += '</tbody></table>';
      return table;
    });

    return html;
  }
  async function generatePdf() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = parseMarkdown(markdown);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: ${pageSize}; margin: 2cm; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${fontSize}pt;
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
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('documentTitle')}
          </label>
          <input
            type="text"
            bind:value={title}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('fontSize')}
          </label>
          <select
            value={fontSize}
            onchange={(e) => fontSize = parseInt(e.target.value)}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={10}>10pt</option>
            <option value={11}>11pt</option>
            <option value={12}>12pt</option>
            <option value={14}>14pt</option>
            <option value={16}>16pt</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('pageSize')}
          </label>
          <select
            bind:value={pageSize}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="legal">Legal</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('markdownInput')}
          </label>
          <textarea
            bind:value={markdown}
            class="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('preview')}
          </label>
          <div
            bind:this={previewRef}
            class="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-auto prose prose-sm dark:prose-invert max-w-none"
            style="font-size: {fontSize}px">{@html parseMarkdown(markdown)}</div>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={generatePdf}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          📄 {t('generatePdf')}
        </button>
        <button
          onclick={() => markdown = ''}
          class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('clear')}
        </button>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('supportedSyntax')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700 dark:text-blue-400">
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
  
