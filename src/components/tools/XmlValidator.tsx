'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function XmlValidator() {
  const t = useTranslations('tools.xml-validator');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    error?: string;
    lineNumber?: number;
    columnNumber?: number;
  } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult({ valid: false, error: t('errors.empty') });
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');

      if (parseError) {
        const errorText = parseError.textContent || '';
        const lineMatch = errorText.match(/line (\d+)/i);
        const columnMatch = errorText.match(/column (\d+)/i);

        setResult({
          valid: false,
          error: errorText.split('\n')[0],
          lineNumber: lineMatch ? parseInt(lineMatch[1]) : undefined,
          columnNumber: columnMatch ? parseInt(columnMatch[1]) : undefined,
        });
      } else {
        setResult({ valid: true });
      }
    } catch (e) {
      setResult({
        valid: false,
        error: (e as Error).message,
      });
    }
  };

  const formatXml = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');

      if (parseError) {
        validate();
        return;
      }

      const serializer = new XMLSerializer();
      let formatted = serializer.serializeToString(doc);

      // Simple formatting
      formatted = formatted
        .replace(/></g, '>\n<')
        .split('\n')
        .map((line, i, arr) => {
          const indent = (line.match(/<\//) ? -1 : 0) + (arr.slice(0, i).filter(l => l.match(/<[^/!?]/) && !l.match(/\/>/)).length - arr.slice(0, i).filter(l => l.match(/<\//)).length);
          return '  '.repeat(Math.max(0, indent)) + line.trim();
        })
        .join('\n');

      setInput(formatted);
      setResult({ valid: true });
    } catch (e) {
      setResult({
        valid: false,
        error: (e as Error).message,
      });
    }
  };

  const loadExample = () => {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies.</description>
  </book>
</catalog>`;
    setInput(example);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('xmlInput')}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder={t('placeholder')}
          className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={validate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('validate')}
        </button>
        <button
          onClick={formatXml}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('format')}
        </button>
        <button
          onClick={loadExample}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {t('loadExample')}
        </button>
      </div>

      {result && (
        <div className={`p-6 rounded-xl ${
          result.valid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-3xl ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
              {result.valid ? '✓' : '✗'}
            </span>
            <span className={`text-xl font-semibold ${
              result.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {result.valid ? t('valid') : t('invalid')}
            </span>
          </div>

          {result.error && (
            <div className="space-y-2">
              <p className="text-red-600 dark:text-red-400 font-mono text-sm">{result.error}</p>
              {(result.lineNumber || result.columnNumber) && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {result.lineNumber && t('errorLine', { line: result.lineNumber })}
                  {result.lineNumber && result.columnNumber && ', '}
                  {result.columnNumber && t('errorColumn', { column: result.columnNumber })}
                </p>
              )}
            </div>
          )}

          {result.valid && (
            <p className="text-green-600 dark:text-green-400">
              {t('validMessage')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
