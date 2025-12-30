'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToYaml() {
  const t = useTranslations('tools');
  const [json, setJson] = useState('');
  const [yaml, setYaml] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const jsonToYaml = (obj: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent);
    if (obj === null) return 'null';
    if (typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) {
      return obj.map(item => `${spaces}- ${typeof item === 'object' ? '\n' + jsonToYaml(item, indent + 1) : jsonToYaml(item, 0)}`).join('\n');
    }
    return Object.entries(obj as Record<string, unknown>).map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        return `${spaces}${k}:\n${jsonToYaml(v, indent + 1)}`;
      }
      return `${spaces}${k}: ${jsonToYaml(v, 0)}`;
    }).join('\n');
  };

  const convert = () => {
    try {
      const obj = JSON.parse(json);
      setYaml(jsonToYaml(obj));
      setError('');
    } catch {
      setError(t('json.invalidJson'));
      setYaml('');
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">JSON</label>
          <textarea value={json} onChange={(e) => setJson(e.target.value)} className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" placeholder='{"name": "John", "age": 30}' />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">YAML</label>
          <textarea value={yaml} readOnly className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" />
        </div>
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
