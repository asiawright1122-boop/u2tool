'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToGo() {
  const t = useTranslations('tools.json-to-go');
  const tg = useTranslations('tools');
  const [json, setJson] = useState('');
  const [goCode, setGoCode] = useState('');
  const [structName, setStructName] = useState('Root');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toGoType = (val: unknown): string => {
    if (val === null) return 'interface{}';
    if (typeof val === 'string') return 'string';
    if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64';
    if (typeof val === 'boolean') return 'bool';
    if (Array.isArray(val)) return val.length > 0 ? `[]${toGoType(val[0])}` : '[]interface{}';
    return 'interface{}';
  };

  const toPascalCase = (s: string): string => s.replace(/(^|[_-])(\w)/g, (_, __, c) => c.toUpperCase());

  const convert = () => {
    try {
      const obj = JSON.parse(json);
      if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        setError(tg('errorInvalidFormat'));
        return;
      }
      const lines: string[] = [`type ${structName} struct {`];
      for (const [key, val] of Object.entries(obj)) {
        const goKey = toPascalCase(key);
        const goType = toGoType(val);
        lines.push(`\t${goKey} ${goType} \`json:"${key}"\``);
      }
      lines.push('}');
      setGoCode(lines.join('\n'));
      setError('');
    } catch {
      setError(tg('json.invalidJson'));
      setGoCode('');
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(goCode);
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
      <div className="flex gap-4 items-center">
        <label className="text-sm text-gray-600 dark:text-white">{t('structName')}:</label>
        <input type="text" value={structName} onChange={(e) => setStructName(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-white">{t('input')}</label>
          <textarea value={json} onChange={(e) => setJson(e.target.value)} className="w-full h-64 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder='{"name": "John", "age": 30}' />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-white">{t('output')}</label>
          <textarea value={goCode} readOnly className="w-full h-64 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" />
        </div>
      </div>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{tg('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? tg('copied') : tg('copy')}</button>
      </div>
    </div>
  );
}
