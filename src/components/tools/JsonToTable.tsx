'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToTable() {
  const t = useTranslations('tools.json-to-table');
  const [input, setInput] = useState('');
  const [tableData, setTableData] = useState<{ headers: string[]; rows: string[][] } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        result[newKey] = JSON.stringify(value);
      } else {
        result[newKey] = String(value ?? '');
      }
    }
    
    return result;
  };

  const convert = () => {
    setError('');
    setTableData(null);

    if (!input.trim()) {
      setError(t('errors.empty'));
      return;
    }

    try {
      const json = JSON.parse(input);
      let data: Record<string, unknown>[];

      if (Array.isArray(json)) {
        data = json;
      } else if (typeof json === 'object' && json !== null) {
        data = [json];
      } else {
        setError(t('errors.notObjectOrArray'));
        return;
      }

      if (data.length === 0) {
        setError(t('errors.emptyArray'));
        return;
      }

      const flattenedData = data.map(item => flattenObject(item as Record<string, unknown>));
      const allKeys = new Set<string>();
      flattenedData.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
      
      const headers = Array.from(allKeys);
      const rows = flattenedData.map(item => headers.map(header => item[header] || ''));

      setTableData({ headers, rows });
    } catch {
      setError(t('errors.invalidJson'));
    }
  };

  const copyAsHtml = () => {
    if (!tableData) return;

    const html = `<table border="1">
  <thead>
    <tr>
      ${tableData.headers.map(h => `<th>${h}</th>`).join('\n      ')}
    </tr>
  </thead>
  <tbody>
    ${tableData.rows.map(row => `<tr>
      ${row.map(cell => `<td>${cell}</td>`).join('\n      ')}
    </tr>`).join('\n    ')}
  </tbody>
</table>`;

    navigator.clipboard.writeText(html);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const copyAsCsv = () => {
    if (!tableData) return;

    const csv = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    navigator.clipboard.writeText(csv);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const downloadCsv = () => {
    if (!tableData) return;

    const csv = [
      tableData.headers.join(','),
      ...tableData.rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('jsonInput')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={convert}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        {t('convert')}
      </button>

      {tableData && (
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={copyAsHtml}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              {copied ? t('copied') : t('copyHtml')}
            </button>
            <button
              onClick={copyAsCsv}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              {t('copyCsv')}
            </button>
            <button
              onClick={downloadCsv}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              {t('downloadCsv')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  {tableData.headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 text-sm text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('rowCount', { count: tableData.rows.length })}
          </p>
        </div>
      )}
    </div>
  );
}
