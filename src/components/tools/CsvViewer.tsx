'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function CsvViewer() {
  const t = useTranslations('tools');
  
  // 初始化状态
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 使用空字符串初始化，在 useEffect 中设置翻译值
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);

  // 初始化翻译值（只在组件挂载时执行一次）
  useEffect(() => {
    if (!isInitialized) {
      setInput(t('csvViewer.defaultInput'));
      setIsInitialized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  const parseCSV = (text: string, delim: string): string[][] => {
    const lines = text.trim().split('\n');
    return lines.map(line => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delim && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const data = parseCSV(input, delimiter);
  const headers = hasHeader && data.length > 0 ? data[0] : [];
  const rows = hasHeader ? data.slice(1) : data;
  const columnsCount = headers.length || (rows[0]?.length || 0);

  const downloadCSV = () => {
    const blob = new Blob([input], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('csvJson.delimiter')}</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="tool-select"
          >
            <option value=",">{t('csvViewer.delimiterComma')}</option>
            <option value=";">{t('csvViewer.delimiterSemicolon')}</option>
            <option value="\t">{t('csvViewer.delimiterTab')}</option>
            <option value="|">{t('csvViewer.delimiterPipe')}</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-6">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="tool-checkbox"
          />
          <span className="text-gray-700 dark:text-gray-300">{t('csvJson.hasHeader')}</span>
        </label>
        <button
          onClick={downloadCSV}
          className="btn-secondary px-4 py-2 rounded-lg mt-6"
        >
          {t('csvViewer.downloadCsv')}
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('csvViewer.csvInput')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="tool-textarea"
          placeholder={t('csvViewer.csvPlaceholder')}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('csvViewer.tablePreview')}</label>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t('csvViewer.stats', { rows: rows.length, columns: columnsCount })}
          </span>
        </div>
        
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="w-full">
            {hasHeader && headers.length > 0 && (
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="py-2 px-4 text-left text-xs text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">#</th>
                  {headers.map((header, i) => (
                    <th key={i} className="py-2 px-4 text-left font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2 px-4 text-xs text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-2 px-4 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                      {cell || <span className="text-gray-400 dark:text-gray-500">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {rows.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('csvViewer.noData')}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p>💡 {t('csvViewer.tip')}</p>
      </div>
    </div>
  );
}
