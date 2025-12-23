'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type MergeStrategy = 'shallow' | 'deep' | 'concat';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        result[key] = [...(target[key] as unknown[]), ...(source[key] as unknown[])];
      } else if (!Array.isArray(source[key]) && !Array.isArray(target[key])) {
        result[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        result[key] = source[key];
      }
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function mergeJsonObjects(json1: string, json2: string, strategy: MergeStrategy): string {
  const obj1 = JSON.parse(json1);
  const obj2 = JSON.parse(json2);
  
  let merged;
  switch (strategy) {
    case 'shallow':
      merged = { ...obj1, ...obj2 };
      break;
    case 'deep':
      merged = deepMerge(obj1, obj2);
      break;
    case 'concat':
      if (Array.isArray(obj1) && Array.isArray(obj2)) {
        merged = [...obj1, ...obj2];
      } else {
        merged = { ...obj1, ...obj2 };
      }
      break;
  }
  
  return JSON.stringify(merged, null, 2);
}

export default function JsonMerger() {
  const t = useTranslations('tools.json-merger');
  const [json1, setJson1] = useState('{\n  "name": "John",\n  "age": 30\n}');
  const [json2, setJson2] = useState('{\n  "age": 31,\n  "city": "NYC"\n}');
  const [strategy, setStrategy] = useState<MergeStrategy>('deep');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleMerge = () => {
    try {
      setError('');
      const result = mergeJsonObjects(json1, json2, strategy);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <label className="text-sm text-gray-300">{t('strategy')}:</label>
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as MergeStrategy)}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
        >
          <option value="shallow">{t('shallow')}</option>
          <option value="deep">{t('deep')}</option>
          <option value="concat">{t('concat')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            JSON 1
          </label>
          <textarea
            value={json1}
            onChange={(e) => setJson1(e.target.value)}
            className="w-full h-48 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            JSON 2
          </label>
          <textarea
            value={json2}
            onChange={(e) => setJson2(e.target.value)}
            className="w-full h-48 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder={t('inputPlaceholder')}
          />
        </div>
      </div>

      <button
        onClick={handleMerge}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('merge')}
      </button>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">{t('result')}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {t('copy')}
            </button>
          </div>
          <pre className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-green-400 font-mono text-sm overflow-auto max-h-64">
            {output}
          </pre>
        </div>
      )}

      <div className="text-sm text-gray-400 space-y-1">
        <p><strong>{t('shallow')}:</strong> {t('shallowDesc')}</p>
        <p><strong>{t('deep')}:</strong> {t('deepDesc')}</p>
        <p><strong>{t('concat')}:</strong> {t('concatDesc')}</p>
      </div>
    </div>
  );
}
