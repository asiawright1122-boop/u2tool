'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface FormatOptions {
  trimLines: boolean;
  removeExtraSpaces: boolean;
  removeBlankLines: boolean;
  normalizeLineBreaks: boolean;
  capitalizeFirst: boolean;
  fixPunctuation: boolean;
  lineWidth: number;
  indentStyle: 'none' | 'spaces' | 'tabs';
  indentSize: number;
}

function formatDocument(text: string, options: FormatOptions): string {
  let result = text;
  
  // Normalize line breaks
  if (options.normalizeLineBreaks) {
    result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }
  
  // Trim each line
  if (options.trimLines) {
    result = result.split('\n').map(line => line.trim()).join('\n');
  }
  
  // Remove extra spaces
  if (options.removeExtraSpaces) {
    result = result.replace(/[ \t]+/g, ' ');
  }
  
  // Remove blank lines
  if (options.removeBlankLines) {
    result = result.replace(/\n{3,}/g, '\n\n');
  }
  
  // Fix punctuation spacing
  if (options.fixPunctuation) {
    result = result.replace(/\s+([.,!?;:])/g, '$1');
    result = result.replace(/([.,!?;:])(?=[^\s\d])/g, '$1 ');
  }
  
  // Capitalize first letter of sentences
  if (options.capitalizeFirst) {
    result = result.replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
  }
  
  // Word wrap
  if (options.lineWidth > 0) {
    const paragraphs = result.split(/\n\n+/);
    result = paragraphs.map(para => {
      if (para.trim().length === 0) return para;
      const words = para.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        if (currentLine.length + word.length + 1 <= options.lineWidth) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines.join('\n');
    }).join('\n\n');
  }
  
  // Add indentation
  if (options.indentStyle !== 'none') {
    const indent = options.indentStyle === 'tabs' ? '\t' : ' '.repeat(options.indentSize);
    const paragraphs = result.split(/\n\n+/);
    result = paragraphs.map(para => {
      const lines = para.split('\n');
      return lines.map((line, idx) => idx === 0 ? indent + line : line).join('\n');
    }).join('\n\n');
  }
  
  return result;
}

const SAMPLE_TEXT = `this is a sample   text with    extra spaces.it also has punctuation issues.

there are multiple


blank lines here.

and some lines need to be capitalized properly.the formatting is quite messy overall.`;

export default function DocumentFormatter() {
  const t = useTranslations('tools.document-formatter');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [options, setOptions] = useState<FormatOptions>({
    trimLines: true,
    removeExtraSpaces: true,
    removeBlankLines: true,
    normalizeLineBreaks: true,
    capitalizeFirst: true,
    fixPunctuation: true,
    lineWidth: 0,
    indentStyle: 'none',
    indentSize: 4,
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => formatDocument(input, options), [input, options]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const updateOption = useCallback(<K extends keyof FormatOptions>(key: K, value: FormatOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.trimLines} onChange={(e) => updateOption('trimLines', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('trimLines')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.removeExtraSpaces} onChange={(e) => updateOption('removeExtraSpaces', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('removeExtraSpaces')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.removeBlankLines} onChange={(e) => updateOption('removeBlankLines', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('removeBlankLines')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.normalizeLineBreaks} onChange={(e) => updateOption('normalizeLineBreaks', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('normalizeLineBreaks')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.capitalizeFirst} onChange={(e) => updateOption('capitalizeFirst', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('capitalizeSentences')}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={options.fixPunctuation} onChange={(e) => updateOption('fixPunctuation', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('fixPunctuation')}</span>
        </label>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('lineWidth')}</label>
          <input
            type="number"
            value={options.lineWidth}
            onChange={(e) => updateOption('lineWidth', parseInt(e.target.value) || 0)}
            min={0}
            max={200}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('indentStyle')}</label>
          <select
            value={options.indentStyle}
            onChange={(e) => updateOption('indentStyle', e.target.value as FormatOptions['indentStyle'])}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="none">{t('none')}</option>
            <option value="spaces">{t('spaces')}</option>
            <option value="tabs">{t('tabs')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('inputText')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            rows={14}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('formattedOutput')}
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
