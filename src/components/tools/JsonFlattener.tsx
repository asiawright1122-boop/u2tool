'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonFlattener() {
  const t = useTranslations('tools.json-flattener');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('{\n  "user": {\n    "name": "John",\n    "address": {\n      "city": "New York",\n      "zip": "10001"\n    },\n    "tags": ["developer", "designer"]\n  },\n  "active": true\n}');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState('.');
  const [mode, setMode] = useState<'flatten' | 'unflatten'>('flatten');

  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(result, flattenObject(item as Record<string, unknown>, `${newKey}[${index}]`));
          } else {
            result[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        result[newKey] = value;
      }
    }
    return result;
  };

  const unflattenObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const keys = key.split(delimiter);
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!(k in current)) {
          current[k] = {};
        }
        current = current[k] as Record<string, unknown>;
      }
      current[keys[keys.length - 1]] = value;
    }
    return result;
  };

  const process = () => {
    try {
      const parsed = JSON.parse(input);
      let result;
      
      if (mode === 'flatten') {
        result = flattenObject(parsed);
      } else {
        result = unflattenObject(parsed);
      }
      
      setOutput(JSON.stringify(result, null, 2));
    } catch {
      setOutput(`${tg('error')}: ${tg('errorInvalidJson')}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('mode')}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'flatten' | 'unflatten')}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
            <option value="flatten">{t('flatten')}</option>
            <option value="unflatten">{t('unflatten')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('delimiter')}</label>
          <input type="text" value={delimiter} onChange={(e) => setDelimiter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('output')}</label>
          <textarea value={output} readOnly
            className="w-full h-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')} />
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={process}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
          {mode === 'flatten' ? t('flatten') : t('unflatten')}
        </button>
        <button onClick={copyToClipboard} disabled={!output}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
