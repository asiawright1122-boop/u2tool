'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToXml() {
  const t = useTranslations('tools');
  const [json, setJson] = useState('');
  const [xml, setXml] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const jsonToXml = (obj: unknown, rootName = 'root', indent = 0): string => {
    const spaces = '  '.repeat(indent);
    if (obj === null) return `${spaces}<${rootName}></${rootName}>`;
    if (typeof obj !== 'object') return `${spaces}<${rootName}>${String(obj)}</${rootName}>`;
    if (Array.isArray(obj)) {
      return obj.map(item => jsonToXml(item, 'item', indent)).join('\n');
    }
    const children = Object.entries(obj as Record<string, unknown>)
      .map(([k, v]) => jsonToXml(v, k, indent + 1))
      .join('\n');
    return `${spaces}<${rootName}>\n${children}\n${spaces}</${rootName}>`;
  };

  const convert = () => {
    try {
      const obj = JSON.parse(json);
      setXml('<?xml version="1.0" encoding="UTF-8"?>\n' + jsonToXml(obj));
      setError('');
    } catch {
      setError(t('json.invalidJson'));
      setXml('');
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">JSON</label>
          <textarea value={json} onChange={(e) => setJson(e.target.value)} className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" placeholder='{"name": "John", "age": 30}' />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">XML</label>
          <textarea value={xml} readOnly className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" />
        </div>
      </div>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
