'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function StringEscape() {
  const t = useTranslations('tools.stringEscape');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'json' | 'html' | 'url' | 'js'>('json');

  const escape = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let result = '';
    switch (format) {
      case 'json':
        result = JSON.stringify(input).slice(1, -1);
        break;
      case 'html':
        result = input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        break;
      case 'url':
        result = encodeURIComponent(input);
        break;
      case 'js':
        result = input
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        break;
    }
    setOutput(result);
  };

  const unescape = () => {
    if (!input) {
      setOutput('');
      return;
    }

    let result = '';
    try {
      switch (format) {
        case 'json':
          result = JSON.parse(`"${input}"`);
          break;
        case 'html':
          const doc = new DOMParser().parseFromString(input, 'text/html');
          result = doc.documentElement.textContent || '';
          break;
        case 'url':
          result = decodeURIComponent(input);
          break;
        case 'js':
          result = input
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
          break;
      }
    } catch {
      result = t('error');
    }
    setOutput(result);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as typeof format)}
          className="bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="url">URL</option>
          <option value="js">JavaScript</option>
        </select>
        <button
          onClick={escape}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {t('escape')}
        </button>
        <button
          onClick={unescape}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          {t('unescape')}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {tg('copy')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
