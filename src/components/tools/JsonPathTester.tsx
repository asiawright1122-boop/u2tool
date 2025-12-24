'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonPathTester() {
  const t = useTranslations('tools.json-path-tester');
  const tg = useTranslations('tools');
  const [json, setJson] = useState('');
  const [path, setPath] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const evaluatePath = () => {
    if (!json.trim()) {
      setError(tg('errorInvalidInput'));
      setResult('');
      return;
    }
    if (!path.trim()) {
      setError(tg('errorInvalidInput'));
      setResult('');
      return;
    }
    try {
      const data = JSON.parse(json);
      const pathParts = path
        .replace(/^\$\.?/, '') // Remove leading $. or $
        .split(/\.|\[|\]/)
        .filter(Boolean);

      let current: unknown = data;

      for (const part of pathParts) {
        if (current === null || current === undefined) {
          throw new Error(`Cannot access property "${part}" of ${current}`);
        }

        if (typeof current === 'object') {
          // Handle array index or object property
          const index = parseInt(part);
          if (!isNaN(index) && Array.isArray(current)) {
            current = current[index];
          } else {
            current = (current as Record<string, unknown>)[part];
          }
        } else {
          throw new Error(`Cannot access property "${part}" of non-object`);
        }
      }

      setResult(JSON.stringify(current, null, 2));
      setError('');
    } catch (_e) {
      setError((_e as Error).message);
      setResult('');
    }
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { path: '$.name', descKey: 'exGetName' },
    { path: '$.users[0]', descKey: 'exFirstUser' },
    { path: '$.users[0].name', descKey: 'exFirstUserName' },
    { path: '$.data.items', descKey: 'exNestedItems' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('jsonData')}</label>
        <textarea
          className="tool-textarea"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder={t('jsonPlaceholder')}
          rows={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('expression')}</label>
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder={t('expressionPlaceholder')}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {examples.map((ex) => (
            <button
              key={ex.path}
              onClick={() => setPath(ex.path)}
              className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
              title={t(ex.descKey)}
            >
              {ex.path}
            </button>
          ))}
        </div>
      </div>

      <button onClick={evaluatePath} className="btn-primary">
        {t('evaluate')}
      </button>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('result')}</label>
            <button
              onClick={copyResult}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
