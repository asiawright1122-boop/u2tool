'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToZod() {
  const t = useTranslations('tools.json-to-zod');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [schemaName, setSchemaName] = useState('MySchema');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const inferZodType = (value: unknown, key: string, indent: number = 0): string => {
    const indentStr = '  '.repeat(indent);
    
    if (value === null) {
      return 'z.null()';
    }
    
    if (typeof value === 'undefined') {
      return 'z.undefined()';
    }
    
    if (typeof value === 'boolean') {
      return 'z.boolean()';
    }
    
    if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return 'z.number().int()';
      }
      return 'z.number()';
    }
    
    if (typeof value === 'string') {
      // Check for common patterns
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return 'z.string().email()';
      }
      if (/^https?:\/\//.test(value)) {
        return 'z.string().url()';
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        return 'z.string().datetime()';
      }
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        return 'z.string().uuid()';
      }
      return 'z.string()';
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'z.array(z.unknown())';
      }
      const itemType = inferZodType(value[0], key, indent);
      return `z.array(${itemType})`;
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) {
        return 'z.object({})';
      }
      
      const fields = entries.map(([k, v]) => {
        const fieldType = inferZodType(v, k, indent + 1);
        return `${indentStr}  ${k}: ${fieldType}`;
      });
      
      return `z.object({\n${fields.join(',\n')}\n${indentStr}})`;
    }
    
    return 'z.unknown()';
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
      
      const zodSchema = inferZodType(json, schemaName, 0);
      
      const lines = [
        "import { z } from 'zod';",
        '',
        `export const ${schemaName} = ${zodSchema};`,
        '',
        `export type ${schemaName}Type = z.infer<typeof ${schemaName}>;`,
      ];
      
      setOutput(lines.join('\n'));
    } catch {
      setError(t('errors.invalidJson'));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(JSON.stringify({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      website: "https://example.com",
      createdAt: "2024-01-15T10:30:00Z",
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
      }
    }, null, 2));
    setSchemaName('UserSchema');
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
              {t('schemaName')}
            </label>
            <input
              type="text"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            />
          </div>

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
              {t('zodOutput')}
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
            className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          {t('whatIsZod')}
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('zodExplanation')}
        </p>
      </div>
    </div>
  );
}
