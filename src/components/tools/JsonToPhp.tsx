'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToPhp() {
  const t = useTranslations('tools.json-to-php');
  const [input, setInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "active": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  }\n}');
  const [output, setOutput] = useState('');
  const [useShortSyntax, setUseShortSyntax] = useState(true);

  const jsonToPhp = (value: unknown, indent: number = 0): string => {
    const spaces = '    '.repeat(indent);
    const nextSpaces = '    '.repeat(indent + 1);
    
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return useShortSyntax ? '[]' : 'array()';
      
      const isSimple = value.every(v => typeof v !== 'object' || v === null);
      if (isSimple && value.length <= 5) {
        const items = value.map(v => jsonToPhp(v, 0)).join(', ');
        return useShortSyntax ? `[${items}]` : `array(${items})`;
      }
      
      const items = value.map(v => `${nextSpaces}${jsonToPhp(v, indent + 1)}`).join(',\n');
      return useShortSyntax 
        ? `[\n${items}\n${spaces}]`
        : `array(\n${items}\n${spaces})`;
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return useShortSyntax ? '[]' : 'array()';
      
      const items = entries.map(([k, v]) => 
        `${nextSpaces}'${k}' => ${jsonToPhp(v, indent + 1)}`
      ).join(',\n');
      
      return useShortSyntax 
        ? `[\n${items}\n${spaces}]`
        : `array(\n${items}\n${spaces})`;
    }
    
    return 'null';
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      const php = `<?php\n\n$data = ${jsonToPhp(parsed)};\n`;
      setOutput(php);
    } catch {
      setOutput(t('errorInvalidJson'));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" checked={useShortSyntax}
            onChange={(e) => setUseShortSyntax(e.target.checked)}
            className="rounded bg-gray-700 border-gray-600" />
          {t('useShortArraySyntax')}
        </label>
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
        <button onClick={convert}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
          {t('convert')}
        </button>
        <button onClick={copyToClipboard} disabled={!output}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
