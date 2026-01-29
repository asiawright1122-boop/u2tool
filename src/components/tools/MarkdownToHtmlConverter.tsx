'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ConversionOptions {
  sanitize: boolean;
  gfm: boolean;
  breaks: boolean;
  headerIds: boolean;
  codeHighlight: boolean;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function convertMarkdownToHtml(markdown: string, options: ConversionOptions): string {
  let html = markdown;
  
  // Code blocks (must be first to prevent other transformations inside)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langClass}>${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Headers with optional IDs
  html = html.replace(/^#{6}\s+(.+)$/gm, (_, text) => {
    const id = options.headerIds ? ` id="${text.toLowerCase().replace(/\s+/g, '-')}"` : '';
    return `<h6${id}>${text}</h6>`;
  });
  html = html.replace(/^#{5}\s+(.+)$/gm, (_, text) => {
    const id = options.headerIds ? ` id="${text.toLowerCase().replace(/\s+/g, '-')}"` : '';
    return `<h5${id}>${text}</h5>`;
  });
  html = html.replace(/^#{4}\s+(.+)$/gm, (_, text) => {
    const id = options.headerIds ? ` id="${text.toLowerCase().replace(/\s+/g, '-')}"` : '';
    return `<h4${id}>${text}</h4>`;
  });
  html = html.replace(/^#{3}\s+(.+)$/gm, (_, text) => {
    const id = options.headerIds ? ` id="${text.toLowerCase().replace(/\s+/g, '-')}"` : '';
    return `<h3${id}>${text}</h3>`;
  });
  html = html.replace(/^#{2}\s+(.+)$/gm, (_, text) => {
    const id = options.headerIds ? ` id="${text.toLowerCase().replace(/\s+/g, '-')}"` : '';
    return `<h2${id}>${text}</h2>`;
  });
  html = html.replace(/^#\s+(.+)$/gm, (_, text) => {
    const id = options.headerIds ? ` id="${text.toLowerCase().replace(/\s+/g, '-')}"` : '';
    return `<h1${id}>${text}</h1>`;
  });
  
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Strikethrough (GFM)
  if (options.gfm) {
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  }
  
  // Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '<hr>');
  
  // Unordered lists
  html = html.replace(/^[\*\-\+]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  
  // Task lists (GFM)
  if (options.gfm) {
    html = html.replace(/<li>\[x\]\s*/gi, '<li><input type="checkbox" checked disabled> ');
    html = html.replace(/<li>\[\s?\]\s*/g, '<li><input type="checkbox" disabled> ');
  }
  
  // Line breaks
  if (options.breaks) {
    html = html.replace(/\n/g, '<br>\n');
  }
  
  // Paragraphs (simple approach)
  html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>');
  
  // Clean up multiple <br> and empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/(<br>\s*)+/g, '<br>');
  
  return html.trim();
}

const SAMPLE_MARKDOWN = `# Welcome to Markdown

This is a **bold** and *italic* text example.

## Features

- Easy to write
- Converts to HTML
- Supports GFM

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote

[Visit GitHub](https://github.com)

---

1. First item
2. Second item
3. Third item`;

export default function MarkdownToHtmlConverter() {
  const t = useTranslations('tools.markdown-to-html-converter');
  const tCommon = useTranslations('tools');
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [options, setOptions] = useState<ConversionOptions>({
    sanitize: true,
    gfm: true,
    breaks: false,
    headerIds: true,
    codeHighlight: true,
  });
  const [viewMode, setViewMode] = useState<'html' | 'preview'>('html');
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => convertMarkdownToHtml(markdown, options), [markdown, options]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [html]);

  const updateOption = useCallback(<K extends keyof ConversionOptions>(key: K, value: ConversionOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.gfm} onChange={(e) => updateOption('gfm', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('gfm')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.breaks} onChange={(e) => updateOption('breaks', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('lineBreaks')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.headerIds} onChange={(e) => updateOption('headerIds', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('headerIds')}</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('markdownInput')}
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={16}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('html')}
                className={`px-3 py-1 text-sm rounded ${viewMode === 'html' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                HTML
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-sm rounded ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {t('preview')}
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          
          {viewMode === 'html' ? (
            <pre className="h-96 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {html}
            </pre>
          ) : (
            <div 
              className="h-96 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto prose dark:prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supportedSyntax')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div># {t('headers')}</div>
          <div>**{t('bold')}** *{t('italic')}*</div>
          <div>[{t('links')}](url)</div>
          <div>![{t('images')}](url)</div>
          <div>- {t('lists')}</div>
          <div>1. {t('ordered')}</div>
          <div>&gt; {t('quotes')}</div>
          <div>`{t('code')}`</div>
        </div>
      </div>
    </div>
  );
}
