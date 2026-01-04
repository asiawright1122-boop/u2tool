'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { marked } from 'marked';

export default function MarkdownEditor() {
  const t = useTranslations('tools');
  
  const [markdown, setMarkdown] = useState<string>(`# Welcome to Markdown Editor

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
`);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const getHtml = useCallback(() => {
    try {
      return marked(markdown, { breaks: true, gfm: true });
    } catch {
      return '<p>Error parsing markdown</p>';
    }
  }, [markdown]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(getHtml() as string);
  };

  const handleDownload = (type: 'md' | 'html') => {
    const content = type === 'md' ? markdown : getHtml();
    const blob = new Blob([content as string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertTemplate = (template: string) => {
    setMarkdown(prev => prev + '\n' + template);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {t('markdownEditor.edit')}
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'split' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {t('markdownEditor.split')}
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded text-sm ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
          >
            {t('markdownEditor.preview')}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            {t('markdownEditor.copyMd')}
          </button>
          <button onClick={handleCopyHtml} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            {t('markdownEditor.copyHtml')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => insertTemplate('**bold**')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">B</button>
        <button onClick={() => insertTemplate('*italic*')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded italic">I</button>
        <button onClick={() => insertTemplate('# Heading')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">H1</button>
        <button onClick={() => insertTemplate('## Heading')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">H2</button>
        <button onClick={() => insertTemplate('- List item')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">List</button>
        <button onClick={() => insertTemplate('```\ncode\n```')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Code</button>
        <button onClick={() => insertTemplate('[link](url)')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Link</button>
        <button onClick={() => insertTemplate('![alt](image-url)')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Image</button>
        <button onClick={() => insertTemplate('| Col1 | Col2 |\n|------|------|\n| A    | B    |')} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Table</button>
      </div>

      <div className={`grid gap-4 ${viewMode === 'split' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('markdownEditor.markdown')}
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 font-mono text-sm resize-none"
              placeholder={t('markdownEditor.placeholder')}
            />
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('markdownEditor.previewLabel')}
            </label>
            <div
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-auto prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: getHtml() as string }}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => handleDownload('md')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('markdownEditor.downloadMd')}
        </button>
        <button onClick={() => handleDownload('html')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {t('markdownEditor.downloadHtml')}
        </button>
        <button onClick={() => setMarkdown('')} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
          {t('markdownEditor.clear')}
        </button>
      </div>
    </div>
  );
}
