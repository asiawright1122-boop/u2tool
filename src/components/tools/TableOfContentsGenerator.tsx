'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface TocEntry {
  title: string;
  page?: string;
  children: TocEntry[];
}

interface TocOptions {
  style: 'dotted' | 'lined' | 'simple' | 'numbered';
  showPageNumbers: boolean;
  indentSize: number;
}

function parseTocInput(input: string): TocEntry[] {
  const lines = input.split('\n').filter(line => line.trim());
  const entries: TocEntry[] = [];
  const stack: { level: number; entries: TocEntry[] }[] = [{ level: -1, entries }];
  
  for (const line of lines) {
    const match = line.match(/^(\s*)(.+?)(?:\s*\|\s*(\d+))?$/);
    if (!match) continue;
    
    const indent = match[1].length;
    const title = match[2].trim();
    const page = match[3];
    
    const level = Math.floor(indent / 2);
    const entry: TocEntry = { title, page, children: [] };
    
    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    
    stack[stack.length - 1].entries.push(entry);
    stack.push({ level, entries: entry.children });
  }
  
  return entries;
}

function generateToc(entries: TocEntry[], options: TocOptions, depth: number = 0, prefix: string = ''): string {
  let output = '';
  const baseIndent = ' '.repeat(options.indentSize * depth);
  
  entries.forEach((entry, idx) => {
    const number = options.style === 'numbered' ? `${prefix}${idx + 1}. ` : '';
    const title = `${number}${entry.title}`;
    
    if (options.showPageNumbers && entry.page) {
      if (options.style === 'dotted') {
        const dots = '.'.repeat(Math.max(3, 50 - baseIndent.length - title.length - entry.page.length));
        output += `${baseIndent}${title} ${dots} ${entry.page}\n`;
      } else if (options.style === 'lined') {
        const line = '_'.repeat(Math.max(3, 50 - baseIndent.length - title.length - entry.page.length));
        output += `${baseIndent}${title} ${line} ${entry.page}\n`;
      } else {
        output += `${baseIndent}${title}${' '.repeat(Math.max(3, 50 - baseIndent.length - title.length - entry.page.length))}${entry.page}\n`;
      }
    } else {
      output += `${baseIndent}${title}\n`;
    }
    
    if (entry.children.length > 0) {
      output += generateToc(entry.children, options, depth + 1, options.style === 'numbered' ? `${prefix}${idx + 1}.` : '');
    }
  });
  
  return output;
}

function generateHtmlToc(entries: TocEntry[], options: TocOptions, depth: number = 0): string {
  if (entries.length === 0) return '';
  
  const listType = options.style === 'numbered' ? 'ol' : 'ul';
  let html = `<${listType}>\n`;
  
  for (const entry of entries) {
    html += `  <li>`;
    if (options.showPageNumbers && entry.page) {
      html += `<span class="toc-title">${entry.title}</span><span class="toc-page">${entry.page}</span>`;
    } else {
      html += entry.title;
    }
    
    if (entry.children.length > 0) {
      html += '\n' + generateHtmlToc(entry.children, options, depth + 1);
    }
    html += `</li>\n`;
  }
  
  html += `</${listType}>`;
  return html;
}

const SAMPLE_INPUT = `Introduction | 1
Getting Started | 3
  Installation | 3
  Configuration | 5
  Quick Start | 8
Features | 12
  Core Features | 12
    Feature A | 13
    Feature B | 15
  Advanced Features | 18
API Reference | 25
  Methods | 26
  Properties | 32
Troubleshooting | 40
Appendix | 45`;

export default function TableOfContentsGenerator() {
  const t = useTranslations('tools.table-of-contents-generator');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [options, setOptions] = useState<TocOptions>({
    style: 'dotted',
    showPageNumbers: true,
    indentSize: 4,
  });
  const [outputFormat, setOutputFormat] = useState<'text' | 'html'>('text');
  const [copied, setCopied] = useState(false);

  const entries = useMemo(() => parseTocInput(input), [input]);
  const output = useMemo(() => {
    if (outputFormat === 'html') {
      return generateHtmlToc(entries, options);
    }
    return generateToc(entries, options);
  }, [entries, options, outputFormat]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const updateOption = useCallback(<K extends keyof TocOptions>(key: K, value: TocOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Style</label>
          <select
            value={options.style}
            onChange={(e) => updateOption('style', e.target.value as TocOptions['style'])}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="dotted">Dotted</option>
            <option value="lined">Lined</option>
            <option value="simple">Simple</option>
            <option value="numbered">Numbered</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Output</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as 'text' | 'html')}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="text">Plain Text</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Indent</label>
          <select
            value={options.indentSize}
            onChange={(e) => updateOption('indentSize', parseInt(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={6}>6 spaces</option>
          </select>
        </div>
        <label className="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={options.showPageNumbers} onChange={(e) => updateOption('showPageNumbers', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Page Numbers</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            TOC Entries (use indentation for hierarchy)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={14}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">Format: Title | Page (page is optional)</p>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Table of Contents
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="h-80 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre">
            {output || 'Enter entries to generate TOC'}
          </pre>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Input Format</h3>
        <div className="text-xs text-blue-700 dark:text-blue-300 font-mono">
          <p>Chapter Title | 1</p>
          <p>&nbsp;&nbsp;Section | 3 &nbsp;&nbsp;&nbsp;← 2 spaces = level 1</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;Subsection | 5 &nbsp;← 4 spaces = level 2</p>
        </div>
      </div>
    </div>
  );
}
