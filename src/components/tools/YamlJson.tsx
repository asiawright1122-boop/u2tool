'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Simple YAML parser (handles basic cases)
function parseYaml(yaml: string): unknown {
  const lines = yaml.split('\n');
  const result: Record<string, unknown> = {};
  const stack: { indent: number; obj: Record<string, unknown> }[] = [{ indent: -1, obj: result }];
  
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    
    const indent = line.search(/\S/);
    const content = line.trim();
    
    // Pop stack until we find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const parent = stack[stack.length - 1].obj;
    
    if (content.includes(':')) {
      const colonIdx = content.indexOf(':');
      const key = content.slice(0, colonIdx).trim();
      const value = content.slice(colonIdx + 1).trim();
      
      if (value === '' || value === '|' || value === '>') {
        // Nested object or multiline
        const newObj: Record<string, unknown> = {};
        parent[key] = newObj;
        stack.push({ indent, obj: newObj });
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array
        parent[key] = value.slice(1, -1).split(',').map(v => parseValue(v.trim()));
      } else {
        parent[key] = parseValue(value);
      }
    } else if (content.startsWith('- ')) {
      // Array item
      const lastKey = Object.keys(parent).pop();
      if (lastKey && !Array.isArray(parent[lastKey])) {
        parent[lastKey] = [];
      }
      if (lastKey && Array.isArray(parent[lastKey])) {
        (parent[lastKey] as unknown[]).push(parseValue(content.slice(2)));
      }
    }
  }
  
  return result;
}

function parseValue(value: string): unknown {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

// Simple JSON to YAML converter
function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);
  
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') return obj.includes('\n') ? `|\n${spaces}  ${obj.replace(/\n/g, `\n${spaces}  `)}` : obj;
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(item => `${spaces}- ${jsonToYaml(item, indent + 1).trimStart()}`).join('\n');
  }
  
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([key, value]) => {
      const valueStr = jsonToYaml(value, indent + 1);
      if (typeof value === 'object' && value !== null) {
        return `${spaces}${key}:\n${valueStr}`;
      }
      return `${spaces}${key}: ${valueStr}`;
    }).join('\n');
  }
  
  return String(obj);
}

export default function YamlJson() {
  const t = useTranslations('tools.yamlJson');
  const tg = useTranslations('tools');
  const [yaml, setYaml] = useState(`name: John Doe
age: 30
active: true
skills:
  - JavaScript
  - TypeScript
  - React
address:
  city: New York
  country: USA`);
  const [json, setJson] = useState('');
  const [error, setError] = useState('');

  const yamlToJson = () => {
    setError('');
    try {
      const parsed = parseYaml(yaml);
      setJson(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError(t('invalidYaml'));
    }
  };

  const jsonToYamlConvert = () => {
    setError('');
    try {
      const parsed = JSON.parse(json);
      setYaml(jsonToYaml(parsed));
    } catch (e) {
      setError(t('invalidJson'));
    }
  };

  const copyYaml = () => navigator.clipboard.writeText(yaml);
  const copyJson = () => navigator.clipboard.writeText(json);

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-300">YAML</label>
            <div className="flex gap-2">
              <button
                onClick={copyYaml}
                className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              >
                {tg('copy')}
              </button>
              <button
                onClick={yamlToJson}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                → JSON
              </button>
            </div>
          </div>
          <textarea
            value={yaml}
            onChange={(e) => setYaml(e.target.value)}
            className="w-full h-80 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('yamlPlaceholder')}
            spellCheck={false}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-300">JSON</label>
            <div className="flex gap-2">
              <button
                onClick={jsonToYamlConvert}
                className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                ← YAML
              </button>
              <button
                onClick={copyJson}
                className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              >
                {tg('copy')}
              </button>
            </div>
          </div>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className="w-full h-80 bg-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('jsonPlaceholder')}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
