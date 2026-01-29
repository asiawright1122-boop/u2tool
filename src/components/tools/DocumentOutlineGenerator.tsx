'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface OutlineItem {
  level: number;
  text: string;
  id: string;
  children: OutlineItem[];
}

interface OutlineOptions {
  format: 'markdown' | 'html' | 'text';
  numbered: boolean;
  maxDepth: number;
  includeLinks: boolean;
}

function extractHeadings(content: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  
  // Markdown headers
  const mdRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }
  
  // HTML headers
  const htmlRegex = /<h([1-6])[^>]*>([^<]+)<\/h\1>/gi;
  while ((match = htmlRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].trim(),
    });
  }
  
  return headings;
}

function buildOutlineTree(headings: { level: number; text: string }[]): OutlineItem[] {
  const root: OutlineItem[] = [];
  const stack: { level: number; items: OutlineItem[] }[] = [{ level: 0, items: root }];
  
  for (const heading of headings) {
    const item: OutlineItem = {
      level: heading.level,
      text: heading.text,
      id: heading.text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      children: [],
    };
    
    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    
    stack[stack.length - 1].items.push(item);
    stack.push({ level: heading.level, items: item.children });
  }
  
  return root;
}

function generateOutline(items: OutlineItem[], options: OutlineOptions, depth: number = 0, prefix: string = ''): string {
  if (depth >= options.maxDepth) return '';
  
  let output = '';
  const indent = '  '.repeat(depth);
  
  items.forEach((item, idx) => {
    const number = options.numbered ? `${prefix}${idx + 1}. ` : '';
    const bullet = options.numbered ? '' : '- ';
    
    if (options.format === 'markdown') {
      if (options.includeLinks) {
        output += `${indent}${bullet}${number}[${item.text}](#${item.id})\n`;
      } else {
        output += `${indent}${bullet}${number}${item.text}\n`;
      }
    } else if (options.format === 'html') {
      const link = options.includeLinks ? `<a href="#${item.id}">${item.text}</a>` : item.text;
      output += `${indent}<li>${number}${link}`;
      if (item.children.length > 0 && depth + 1 < options.maxDepth) {
        output += `\n${indent}  <ul>\n`;
        output += generateOutline(item.children, options, depth + 1, options.numbered ? `${prefix}${idx + 1}.` : '');
        output += `${indent}  </ul>\n${indent}`;
      }
      output += `</li>\n`;
    } else {
      output += `${indent}${number}${item.text}\n`;
    }
    
    if (options.format !== 'html' && item.children.length > 0) {
      output += generateOutline(item.children, options, depth + 1, options.numbered ? `${prefix}${idx + 1}.` : '');
    }
  });
  
  if (options.format === 'html' && depth === 0) {
    output = `<ul>\n${output}</ul>`;
  }
  
  return output;
}

const SAMPLE_CONTENT = `# Introduction

This is the introduction section.

## Getting Started

Learn how to get started.

### Installation

Install the package.

### Configuration

Configure your settings.

## Features

### Feature One

Description of feature one.

### Feature Two

Description of feature two.

## API Reference

### Methods

#### Method A

#### Method B

### Properties

## Conclusion`;

export default function DocumentOutlineGenerator() {
  const t = useTranslations('tools.document-outline-generator');
  const tCommon = useTranslations('tools');
  const [content, setContent] = useState(SAMPLE_CONTENT);
  const [options, setOptions] = useState<OutlineOptions>({
    format: 'markdown',
    numbered: false,
    maxDepth: 6,
    includeLinks: true,
  });
  const [copied, setCopied] = useState(false);

  const headings = useMemo(() => extractHeadings(content), [content]);
  const outlineTree = useMemo(() => buildOutlineTree(headings), [headings]);
  const outline = useMemo(() => generateOutline(outlineTree, options), [outlineTree, options]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(outline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [outline]);

  const updateOption = useCallback(<K extends keyof OutlineOptions>(key: K, value: OutlineOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Format</label>
          <select
            value={options.format}
            onChange={(e) => updateOption('format', e.target.value as OutlineOptions['format'])}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="text">Plain Text</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max Depth</label>
          <select
            value={options.maxDepth}
            onChange={(e) => updateOption('maxDepth', parseInt(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>H1-H{n}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={options.numbered} onChange={(e) => updateOption('numbered', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Numbered</span>
        </label>
        <label className="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={options.includeLinks} onChange={(e) => updateOption('includeLinks', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Include Links</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={16}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Outline ({headings.length} headings)
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="h-96 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {outline || 'No headings found'}
          </pre>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Supported Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-blue-700 dark:text-blue-300">
          <div>
            <strong>Markdown:</strong>
            <code className="block mt-1 bg-blue-100 dark:bg-blue-800/30 p-1 rounded"># Heading 1<br/>## Heading 2</code>
          </div>
          <div>
            <strong>HTML:</strong>
            <code className="block mt-1 bg-blue-100 dark:bg-blue-800/30 p-1 rounded">&lt;h1&gt;Heading&lt;/h1&gt;<br/>&lt;h2&gt;Heading&lt;/h2&gt;</code>
          </div>
        </div>
      </div>
    </div>
  );
}
