'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

function parseValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();
  if (trimmed.toUpperCase() === 'NULL') return null;
  if (trimmed.toUpperCase() === 'TRUE') return true;
  if (trimmed.toUpperCase() === 'FALSE') return false;
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  // 移除引号
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || 
      (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function sqlToJson(sql: string): ParsedRow[] {
  const results: ParsedRow[] = [];
  
  // 匹配 INSERT INTO 语句
  const insertRegex = /INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/gi;
  let match;
  
  while ((match = insertRegex.exec(sql)) !== null) {
    const columns = match[1].split(',').map(c => c.trim().replace(/[`"[\]]/g, ''));
    const values = match[2].split(',').map(v => parseValue(v));
    
    const row: ParsedRow = {};
    columns.forEach((col, i) => {
      row[col] = values[i] !== undefined ? values[i] : null;
    });
    results.push(row);
  }
  
  return results;
}

export default function SqlToJson() {
  const t = useTranslations('tools.sql-to-json');
  const [input, setInput] = useState(`INSERT INTO users (id, name, email, age) VALUES (1, 'John', 'john@example.com', 30);
INSERT INTO users (id, name, email, age) VALUES (2, 'Jane', 'jane@example.com', 25);`);

  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      const result = sqlToJson(input);
      if (result.length === 0) {
        setError(t('noInsertFound'));
        setOutput('');
        return;
      }
      setOutput(JSON.stringify(result, null, 2));
    } catch (_e) {
      setError(_e instanceof Error ? _e.message : 'Parse error');
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('sqlInput')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono text-sm"
          placeholder={t('placeholder')} />
      </div>
      
      <button onClick={handleConvert}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {t('convert')}
      </button>

      {error && <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">{error}</div>}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">JSON</label>
            <button onClick={handleCopy} className="text-sm text-blue-400 hover:text-blue-300">{t('copy')}</button>
          </div>
          <pre className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-green-400 font-mono text-sm overflow-auto max-h-64">
            {output}
          </pre>
        </div>
      )}

      <div className="text-sm text-gray-400">
        <p>{t('supportedFormat')}</p>
        <code className="text-xs bg-gray-700 px-2 py-1 rounded">INSERT INTO table (col1, col2) VALUES (val1, val2);</code>
      </div>
    </div>
  );
}
