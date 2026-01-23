'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

function inferGraphQLType(value: unknown, key: string): string {
  if (value === null) return 'String';
  if (Array.isArray(value)) {
    if (value.length === 0) return '[String]';
    return `[${inferGraphQLType(value[0], key)}]`;
  }
  switch (typeof value) {
    case 'string':
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'DateTime';
      if (/^[a-f0-9-]{36}$/i.test(value)) return 'ID';
      return 'String';
    case 'number':
      return Number.isInteger(value) ? 'Int' : 'Float';
    case 'boolean':
      return 'Boolean';
    case 'object':
      return toPascalCase(key);
    default:
      return 'String';
  }
}

function toPascalCase(str: string): string {
  return str.replace(/(^|[-_])(\w)/g, (_, __, c) => c.toUpperCase());
}

function generateGraphQLSchema(json: unknown, typeName: string = 'Root'): string {
  const types: Map<string, string[]> = new Map();
  
  function processObject(obj: unknown, name: string): void {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return;
    
    const fields: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const graphqlType = inferGraphQLType(value, key);
      fields.push(`  ${key}: ${graphqlType}`);
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processObject(value, toPascalCase(key));
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        processObject(value[0], toPascalCase(key));
      }
    }
    
    types.set(name, fields);
  }
  
  processObject(json, typeName);
  
  let schema = '';
  types.forEach((fields, name) => {
    schema += `type ${name} {\n${fields.join('\n')}\n}\n\n`;
  });
  
  // Add Query type
  schema += `type Query {\n  ${typeName.toLowerCase()}: ${typeName}\n  ${typeName.toLowerCase()}s: [${typeName}]\n}`;
  
  return schema;
}

export default function JsonToGraphql() {
  const t = useTranslations('tools');
  const tg = useTranslations('tools.json-to-graphql');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [typeName, setTypeName] = useState('User');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const json = JSON.parse(input);
      const schema = generateGraphQLSchema(json, typeName);
      setOutput(schema);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('errorInvalidJson'));
      setOutput('');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
      isActive: true,
      balance: 1234.56,
      createdAt: "2024-01-15T10:30:00Z",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA"
      },
      tags: ["developer", "designer"]
    }, null, 2));
    setTypeName('User');
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">{tg('typeName')}</label>
          <input
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            className="tool-input"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <button onClick={loadSample} className="btn-secondary mt-6">
          {tg('loadSample')}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{tg('jsonInput')}</label>
        <textarea
          className="tool-textarea font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tg('placeholder')}
          rows={10}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
      )}

      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary">{t('convert')}</button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{tg('graphqlOutput')}</label>
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <pre className="tool-textarea font-mono text-sm whitespace-pre">{output}</pre>
        </div>
      )}

      <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{tg('typeInference')}</h3>
        <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
          <div>String → <code className="text-green-600 dark:text-green-400">String</code></div>
          <div>Integer → <code className="text-green-600 dark:text-green-400">Int</code></div>
          <div>Float → <code className="text-green-600 dark:text-green-400">Float</code></div>
          <div>Boolean → <code className="text-green-600 dark:text-green-400">Boolean</code></div>
          <div>UUID → <code className="text-green-600 dark:text-green-400">ID</code></div>
          <div>ISO Date → <code className="text-green-600 dark:text-green-400">DateTime</code></div>
        </div>
      </div>
    </div>
  );
}
