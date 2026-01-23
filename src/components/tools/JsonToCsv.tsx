'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToCsv() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convertToCsv = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const data = JSON.parse(input);
      const array = Array.isArray(data) ? data : [data];
      
      if (array.length === 0) {
        setOutput('');
        return;
      }

      // Get all unique keys
      const keys = [...new Set(array.flatMap(obj => Object.keys(obj)))];
      
      // Create CSV header
      const header = keys.map(k => `"${k}"`).join(',');
      
      // Create CSV rows
      const rows = array.map(obj => 
        keys.map(key => {
          const val = obj[key];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      );

      setOutput([header, ...rows].join('\n'));
      setError('');
    } catch (_e) {
      setError(t('errorInvalidJson'));
      setOutput('');
    }
  };

  const convertToJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const lines = input.trim().split('\n');
      if (lines.length < 2) {
        setError('CSV must have header and at least one row');
        return;
      }

      const parseCSVLine = (line: string) => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current);
        return result;
      };

      const headers = parseCSVLine(lines[0]);
      const data = lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj: Record<string, string> = {};
        headers.forEach((header, i) => {
          obj[header] = values[i] || '';
        });
        return obj;
      });

      setOutput(JSON.stringify(data, null, 2));
      setError('');
    } catch (_e) {
      setError(t('errorInvalidFormat'));
      setOutput('');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')} (JSON or CSV)</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          rows={8}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={convertToCsv} className="btn-primary">
          JSON → CSV
        </button>
        <button onClick={convertToJson} className="btn-secondary">
          CSV → JSON
        </button>
      </div>

      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('output')}</label>
            <div className="flex gap-2">
              <button
                onClick={copyOutput}
                className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
              {output.includes(',') && !output.startsWith('[') && (
                <button onClick={downloadCsv} className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded">
                  {t('download')} CSV
                </button>
              )}
            </div>
          </div>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}
