'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToTypescript() {
  const t = useTranslations('tools');
  const [jsonInput, setJsonInput] = useState('');
  const [output, setOutput] = useState('');
  const [interfaceName, setInterfaceName] = useState('Root');
  const [copied, setCopied] = useState(false);

  const getType = (value: unknown): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const types = [...new Set(value.map(getType))];
      return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`;
    }
    if (typeof value === 'object') return 'object';
    return typeof value;
  };

  const jsonToInterface = (obj: Record<string, unknown>, name: string, interfaces: string[] = []): string => {
    const lines: string[] = [`interface ${name} {`];
    
    for (const [key, value] of Object.entries(obj)) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      
      if (value === null) {
        lines.push(`  ${safeKey}: null;`);
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          const itemName = name + key.charAt(0).toUpperCase() + key.slice(1) + 'Item';
          jsonToInterface(value[0] as Record<string, unknown>, itemName, interfaces);
          lines.push(`  ${safeKey}: ${itemName}[];`);
        } else {
          lines.push(`  ${safeKey}: ${getType(value)};`);
        }
      } else if (typeof value === 'object') {
        const nestedName = name + key.charAt(0).toUpperCase() + key.slice(1);
        jsonToInterface(value as Record<string, unknown>, nestedName, interfaces);
        lines.push(`  ${safeKey}: ${nestedName};`);
      } else {
        lines.push(`  ${safeKey}: ${typeof value};`);
      }
    }
    
    lines.push('}');
    interfaces.push(lines.join('\n'));
    return interfaces.join('\n\n');
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (typeof parsed !== 'object' || parsed === null) {
        setOutput(`type ${interfaceName} = ${typeof parsed};`);
        return;
      }
      const interfaces: string[] = [];
      jsonToInterface(parsed, interfaceName, interfaces);
      setOutput(interfaces.reverse().join('\n\n'));
    } catch {
      setOutput(t('json.invalidJson'));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <label className="text-sm text-gray-600 dark:text-gray-300">{t('jsonTs.interfaceName')}:</label>
        <input
          type="text"
          value={interfaceName}
          onChange={(e) => setInterfaceName(e.target.value || 'Root')}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">JSON</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-white"
            placeholder={t('jsonTs.jsonPlaceholder')}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">TypeScript</label>
            <button onClick={copyOutput} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"
          />
        </div>
      </div>

      <button
        onClick={convert}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
      >
        {t('convert')}
      </button>
    </div>
  );
}
