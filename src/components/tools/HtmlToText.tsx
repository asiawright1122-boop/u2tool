'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlToText() {
  const t = useTranslations('tools.html-to-text');
  const [html, setHtml] = useState('');
  const [text, setText] = useState('');
  const [preserveLinks, setPreserveLinks] = useState(false);
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);
  const [preserveLists, setPreserveLists] = useState(true);

  const htmlToText = useCallback((input: string): string => {
    if (!input) return '';

    let result = input;

    // Handle links
    if (preserveLinks) {
      result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)');
    } else {
      result = result.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
    }

    // Handle lists
    if (preserveLists) {
      result = result.replace(/<li[^>]*>/gi, '• ');
      result = result.replace(/<\/li>/gi, '\n');
      result = result.replace(/<ol[^>]*>/gi, '\n');
      result = result.replace(/<\/ol>/gi, '\n');
      result = result.replace(/<ul[^>]*>/gi, '\n');
      result = result.replace(/<\/ul>/gi, '\n');
    }

    // Handle line breaks
    if (preserveLineBreaks) {
      result = result.replace(/<br\s*\/?>/gi, '\n');
      result = result.replace(/<\/p>/gi, '\n\n');
      result = result.replace(/<\/div>/gi, '\n');
      result = result.replace(/<\/h[1-6]>/gi, '\n\n');
      result = result.replace(/<\/tr>/gi, '\n');
      result = result.replace(/<\/td>/gi, '\t');
      result = result.replace(/<\/th>/gi, '\t');
    }

    // Handle common block elements
    result = result.replace(/<(p|div|h[1-6]|blockquote|pre)[^>]*>/gi, '\n');
    
    // Handle horizontal rules
    result = result.replace(/<hr\s*\/?>/gi, '\n---\n');

    // Remove script and style content
    result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove all remaining HTML tags
    result = result.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&mdash;': '—',
      '&ndash;': '–',
      '&hellip;': '…',
      '&lsquo;': '\u2018',
      '&rsquo;': '\u2019',
      '&ldquo;': '\u201C',
      '&rdquo;': '\u201D',
    };

    for (const [entity, char] of Object.entries(entities)) {
      result = result.replace(new RegExp(entity, 'gi'), char);
    }

    // Decode numeric entities
    result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)));
    result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // Clean up whitespace
    result = result.replace(/[ \t]+/g, ' ');
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
    result = result.trim();

    return result;
  }, [preserveLinks, preserveLineBreaks, preserveLists]);

  const handleConvert = () => {
    setText(htmlToText(html));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const loadSample = () => {
    setHtml(`<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>This is a <strong>sample</strong> paragraph with <em>formatted</em> text.</p>
  <p>Visit our <a href="https://example.com">website</a> for more information.</p>
  <h2>Features</h2>
  <ul>
    <li>Easy to use</li>
    <li>Fast and reliable</li>
    <li>Free forever</li>
  </ul>
  <p>Contact us at: info@example.com</p>
  <hr>
  <p>&copy; 2024 Example Company. All rights reserved.</p>
</body>
</html>`);
    setText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={preserveLinks}
            onChange={(e) => setPreserveLinks(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('preserveLinks')}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={preserveLineBreaks}
            onChange={(e) => setPreserveLineBreaks(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('preserveLineBreaks')}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={preserveLists}
            onChange={(e) => setPreserveLists(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('preserveLists')}</span>
        </label>

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('htmlInput')}
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder={t('htmlPlaceholder')}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('textOutput')}
            </label>
            {text && (
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={text}
            readOnly
            placeholder={t('textPlaceholder')}
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('convert')}
        </button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('features')}</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• {t('feature1')}</li>
          <li>• {t('feature2')}</li>
          <li>• {t('feature3')}</li>
          <li>• {t('feature4')}</li>
        </ul>
      </div>
    </div>
  );
}
