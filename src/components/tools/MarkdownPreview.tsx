'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { sanitizeMarkdownHtml } from '@/lib/sanitize';

// Simple markdown parser (for basic features)
// 注意：为避免 SEO 问题（页面已有 H1），markdown 中的标题降级处理：
// # -> h2, ## -> h3, ### -> h4
function parseMarkdown(md: string): string {
  const html = md
    // Headers（降级处理：# -> h2, ## -> h3, ### -> h4）
    .replace(/^### (.*$)/gim, '<h4 class="text-base font-bold mt-4 mb-2">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^# (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded my-2 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 dark:bg-gray-900 px-1 rounded">$1</code>')
    // Links - 添加 rel="noopener noreferrer" 提高安全性
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Unordered lists
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
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

  // 解析 Markdown 并净化 HTML，防止 XSS 攻击
  const html = useMemo(() => sanitizeMarkdownHtml(parseMarkdown(markdown)), [markdown]);

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor 列 */}
        <div>
          <div className="flex justify-between items-center mb-2 h-8">
            <label className="text-sm font-medium">{t('markdown.editor')}</label>
          </div>
          <textarea
            className="h-96 w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 resize-none"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t('inputPlaceholder')}
          />
        </div>

        {/* Preview 列 */}
        <div>
          <div className="flex justify-between items-center mb-2 h-8">
            <label className="text-sm font-medium">{t('markdown.preview')}</label>
            <button
              onClick={copyHtml}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('markdown.exportHtml')}
            </button>
          </div>
          <div
            className="h-96 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-4 overflow-auto text-gray-900 dark:text-gray-100"
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
