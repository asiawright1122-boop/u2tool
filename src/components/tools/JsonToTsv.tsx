'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToTsv() {
  const t = useTranslations('tools.json-to-tsv');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('[\n  {"name": "John", "age": 30, "city": "New York"},\n  {"name": "Jane", "age": 25, "city": "London"}\n]');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const convert = () => {
    try {
      const data = JSON.parse(input);
      
      if (!Array.isArray(data)) {
        setError(tg('errorInvalidFormat'));
        return;
      }

      if (data.length === 0) {
        setOutput('');
        return;
      }

      const headers = Object.keys(data[0]);
      const rows: string[] = [];

      if (includeHeaders) {
        rows.push(headers.join('\t'));
      }

      data.forEach((item: Record<string, unknown>) => {
        const values = headers.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        });
        rows.push(values.join('\t'));
      });

      setOutput(rows.join('\n'));
      setError('');
    } catch (_err) {
      setError(tg('errorInvalidJson'));
      setOutput('');
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHeaders}
            onChange={(e) => setIncludeHeaders(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span>{t('includeHeaders')}</span>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('jsonInput')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder={t('jsonPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('tsvOutput')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none"
            placeholder={t('tsvPlaceholder')}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={convert}
          className="btn-primary px-6 py-2 rounded-lg"
        >
          {t('convert')}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="btn-secondary px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
