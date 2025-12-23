'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// Simple markdown parser (for basic features)
function parseMarkdown(md: string): string {
  const html = md
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/gim, '<code class="bg-gray-900 px-1 rounded">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-400 hover:underline" target="_blank">$1</a>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    // Line breaks
    .replace(/\n/gim, '<br>');

  return html;
}

export default function MarkdownPreview() {
  const t = useTranslations('tools');
  const [markdown, setMarkdown] = useState(`# Hello World

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
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => parseMarkdown(markdown), [markdown]);

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('markdown.editor')}</label>
          <textarea
            className="tool-textarea h-96"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t('inputPlaceholder')}
          />
        </div>

        {/* Preview */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('markdown.preview')}</label>
            <button
              onClick={copyHtml}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('markdown.exportHtml')}
            </button>
          </div>
          <div
            className="h-96 bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-auto prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <button onClick={() => setMarkdown('')} className="btn-secondary">
        {t('clear')}
      </button>
    </div>
  );
}
