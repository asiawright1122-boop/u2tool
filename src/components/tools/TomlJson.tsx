'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Simple TOML parser and stringifier
function parseToml(toml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let currentSection = result;
  const lines = toml.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) continue;
    
    // Section header [section] or [section.subsection]
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      const path = sectionMatch[1].split('.');
      currentSection = result;
      for (const key of path) {
        if (!(key in currentSection)) {
          (currentSection as Record<string, unknown>)[key] = {};
        }
        currentSection = (currentSection as Record<string, unknown>)[key] as Record<string, unknown>;
      }
      continue;
    }
    
    // Key-value pair
    const kvMatch = line.match(/^([^=]+)=(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();
      
      // Parse value
      (currentSection as Record<string, unknown>)[key] = parseTomlValue(value);
    }
  }
  
  return result;
}

function parseTomlValue(value: string): unknown {
  // String (basic or literal)
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
  }
  
  // Multi-line string
  if (value.startsWith('"""') || value.startsWith("'''")) {
    return value.slice(3, -3);
  }
  
  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Array
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(v => parseTomlValue(v.trim()));
  }
  
  // Integer
  if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  
  // Float
  if (/^-?\d+\.\d+$/.test(value)) {
    return parseFloat(value);
  }
  
  // Date/time (return as string)
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }
  
  return value;
}

function jsonToToml(obj: unknown, prefix = ''): string {
  const lines: string[] = [];
  const sections: string[] = [];
  
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return '';
  }
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object becomes a section
      sections.push(`[${fullKey}]`);
      sections.push(jsonToToml(value, '').trim());
      sections.push('');
    } else {
      lines.push(`${key} = ${toTomlValue(value)}`);
    }
  }
  
  return [...lines, '', ...sections].join('\n').trim();
}

function toTomlValue(value: unknown): string {
  if (typeof value === 'string') {
    // Escape special characters
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  if (Array.isArray(value)) {
    return `[${value.map(v => toTomlValue(v)).join(', ')}]`;
  }
  if (value === null || value === undefined) {
    return '""';
  }
  return String(value);
}

export default function TomlJson() {
  const t = useTranslations('tools.toml-json');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'toml-to-json' | 'json-to-toml'>('toml-to-json');
  const [error, setError] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const convert = () => {
    setError('');
    try {
      if (mode === 'toml-to-json') {
        const parsed = parseToml(input);
        setOutput(JSON.stringify(parsed, null, indentSize));
      } else {
        const parsed = JSON.parse(input);
        setOutput(jsonToToml(parsed));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tg('errorProcessing'));
      setOutput('');
    }
  };

  const swap = () => {
    setMode(mode === 'toml-to-json' ? 'json-to-toml' : 'toml-to-json');
    setInput(output);
    setOutput('');
    setError('');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    if (mode === 'toml-to-json') {
      setInput(`# Sample TOML configuration
title = "TOML Example"
version = 1.0

[owner]
name = "John Doe"
email = "john@example.com"

[database]
server = "192.168.1.1"
ports = [8001, 8002, 8003]
enabled = true

[servers.alpha]
ip = "10.0.0.1"
dc = "eqdc10"

[servers.beta]
ip = "10.0.0.2"
dc = "eqdc20"`);
    } else {
      setInput(`{
  "title": "JSON Example",
  "version": 1.0,
  "owner": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "database": {
    "server": "192.168.1.1",
    "ports": [8001, 8002, 8003],
    "enabled": true
  }
}`);
    }
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as 'toml-to-json' | 'json-to-toml');
              setInput('');
              setOutput('');
              setError('');
            }}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm"
          >
            <option value="toml-to-json">{t('tomlToJson')}</option>
            <option value="json-to-toml">{t('jsonToToml')}</option>
          </select>
        </div>
        
        {mode === 'toml-to-json' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">{t('indent')}:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Minified</option>
            </select>
          </div>
        )}
        
        <button
          onClick={loadSample}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          {t('loadSample')}
        </button>
        
        <button
          onClick={clearAll}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          {t('clear')}
        </button>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              {mode === 'toml-to-json' ? 'TOML' : 'JSON'}
            </label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'toml-to-json' ? t('tomlPlaceholder') : t('jsonPlaceholder')}
            className="w-full h-80 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">
              {mode === 'toml-to-json' ? 'JSON' : 'TOML'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={swap}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                title={t('swap')}
              >
                ⇄ {t('swap')}
              </button>
              <button
                onClick={copyOutput}
                disabled={!output}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs disabled:opacity-50"
              >
                {t('copy')}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-80 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm resize-none"
          />
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={convert}
          disabled={!input.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
        >
          {t('convert')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
