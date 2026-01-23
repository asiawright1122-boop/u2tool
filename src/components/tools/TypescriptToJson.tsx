'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TypescriptToJson() {
  const t = useTranslations('tools.typescript-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const parseTypeScript = (code: string): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    
    // Remove comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*/g, '');
    
    // Extract interface/type content
    const interfaceMatch = code.match(/(?:interface|type)\s+\w+\s*(?:=\s*)?\{([\s\S]*)\}/);
    if (!interfaceMatch) {
      throw new Error('No interface or type found');
    }
    
    const content = interfaceMatch[1];
    
    // Parse properties
    const lines = content.split(/[;\n]/).filter(line => line.trim());
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '{' || trimmed === '}') continue;
      
      // Match property: type pattern
      const propMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+)$/);
      if (propMatch) {
        const [, name, optional, type] = propMatch;
        result[name] = generateSampleValue(type.trim(), optional === '?');
      }
    }
    
    return result;
  };

  const generateSampleValue = (type: string, optional: boolean): unknown => {
    // Handle optional types
    if (optional && Math.random() > 0.5) {
      return undefined;
    }
    
    // Handle union types (take first non-null type)
    if (type.includes('|')) {
      const types = type.split('|').map(t => t.trim());
      const nonNullType = types.find(t => t !== 'null' && t !== 'undefined') || types[0];
      return generateSampleValue(nonNullType, false);
    }
    
    // Handle array types
    if (type.endsWith('[]')) {
      const itemType = type.slice(0, -2);
      return [generateSampleValue(itemType, false)];
    }
    if (type.startsWith('Array<') && type.endsWith('>')) {
      const itemType = type.slice(6, -1);
      return [generateSampleValue(itemType, false)];
    }
    
    // Handle basic types
    switch (type.toLowerCase()) {
      case 'string':
        return 'sample string';
      case 'number':
        return 42;
      case 'boolean':
        return true;
      case 'null':
        return null;
      case 'undefined':
        return undefined;
      case 'any':
      case 'unknown':
        return 'any value';
      case 'date':
        return new Date().toISOString();
      case 'object':
        return {};
      default:
        // Handle string literal types
        if (type.startsWith("'") || type.startsWith('"')) {
          return type.slice(1, -1);
        }
        // Handle number literal types
        if (/^\d+$/.test(type)) {
          return parseInt(type);
        }
        // Handle nested objects (simplified)
        if (type.startsWith('{')) {
          return {};
        }
        return `<${type}>`;
    }
  };

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError(t('errors.empty'));
      return;
    }

    try {
      const parsed = parseTypeScript(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(t('errors.parseFailed', { error: (e as Error).message }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(`interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  age?: number;
  roles: string[];
  createdAt: Date;
  metadata: {
    lastLogin: string;
    preferences: object;
  };
}`);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('typescriptInput')}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={convert}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('convert')}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('jsonOutput')}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied ? t('copied') : t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          {t('note')}
        </h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          {t('noteText')}
        </p>
      </div>
    </div>
  );
}
