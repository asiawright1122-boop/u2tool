'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToProto() {
  const t = useTranslations('tools.json-to-proto');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [messageName, setMessageName] = useState('MyMessage');
  const [packageName, setPackageName] = useState('mypackage');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const inferType = (value: unknown, key: string): string => {
    if (value === null) return 'string';
    if (typeof value === 'boolean') return 'bool';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        if (value > 2147483647 || value < -2147483648) return 'int64';
        return 'int32';
      }
      return 'double';
    }
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'google.protobuf.Timestamp';
      return 'string';
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return 'repeated string';
      return `repeated ${inferType(value[0], key)}`;
    }
    if (typeof value === 'object') {
      return toPascalCase(key);
    }
    return 'string';
  };

  const toPascalCase = (str: string): string => {
    return str
      .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  };

  const toSnakeCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  };

  const generateProto = (obj: Record<string, unknown>, name: string, indent: number = 0): string[] => {
    const lines: string[] = [];
    const nestedMessages: string[] = [];
    const indentStr = '  '.repeat(indent);
    
    lines.push(`${indentStr}message ${name} {`);
    
    let fieldNumber = 1;
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toSnakeCase(key);
      let fieldType = inferType(value, key);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedName = toPascalCase(key);
        nestedMessages.push(...generateProto(value as Record<string, unknown>, nestedName, indent + 1));
        fieldType = nestedName;
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const nestedName = toPascalCase(key);
        nestedMessages.push(...generateProto(value[0] as Record<string, unknown>, nestedName, indent + 1));
        fieldType = `repeated ${nestedName}`;
      }
      
      lines.push(`${indentStr}  ${fieldType} ${fieldName} = ${fieldNumber};`);
      fieldNumber++;
    }
    
    if (nestedMessages.length > 0) {
      lines.push('');
      lines.push(...nestedMessages);
    }
    
    lines.push(`${indentStr}}`);
    return lines;
  };

  const convert = () => {
    setError('');
    setOutput('');
    
    if (!input.trim()) {
      setError(t('errors.empty'));
      return;
    }

    try {
      const json = JSON.parse(input);
      
      if (typeof json !== 'object' || json === null) {
        setError(t('errors.notObject'));
        return;
      }

      const lines: string[] = [
        'syntax = "proto3";',
        '',
        `package ${packageName};`,
        '',
      ];

      if (JSON.stringify(json).includes('Timestamp')) {
        lines.push('import "google/protobuf/timestamp.proto";');
        lines.push('');
      }

      const messageLines = generateProto(
        Array.isArray(json) ? json[0] : json,
        messageName
      );
      lines.push(...messageLines);

      setOutput(lines.join('\n'));
    } catch {
      setError(t('errors.invalidJson'));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('messageName')}
          </label>
          <input
            type="text"
            value={messageName}
            onChange={(e) => setMessageName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('packageName')}
          </label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('jsonInput')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('protoOutput')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={convert}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        {output && (
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        )}
      </div>
    </div>
  );
}
