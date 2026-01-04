'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';

export default function JsonToExcel() {
  const t = useTranslations('tools');
  
  const [jsonInput, setJsonInput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('data');
  const [sheetName, setSheetName] = useState<string>('Sheet1');
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key] as Record<string, unknown>, newKey));
      } else {
        result[newKey] = obj[key];
      }
    }
    return result;
  };

  const handleJsonChange = useCallback((value: string) => {
    setJsonInput(value);
    setError('');
    setPreview([]);
    setHeaders([]);

    if (!value.trim()) return;

    try {
      const parsed = JSON.parse(value);
      let data: Record<string, unknown>[];

      if (Array.isArray(parsed)) {
        data = parsed.map(item => 
          typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
        );
      } else if (typeof parsed === 'object' && parsed !== null) {
        data = [flattenObject(parsed)];
      } else {
        setError(t('jsonToExcel.invalidJson'));
        return;
      }

      if (data.length === 0) {
        setError(t('jsonToExcel.emptyData'));
        return;
      }

      const allHeaders = new Set<string>();
      data.forEach(row => Object.keys(row).forEach(key => allHeaders.add(key)));
      
      setHeaders(Array.from(allHeaders));
      setPreview(data.slice(0, 10));
    } catch {
      setError(t('jsonToExcel.parseError'));
    }
  }, [t]);

  const handleDownload = () => {
    if (!jsonInput.trim()) {
      setError(t('jsonToExcel.noInput'));
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      let data: Record<string, unknown>[];

      if (Array.isArray(parsed)) {
        data = parsed.map(item => 
          typeof item === 'object' && item !== null ? flattenObject(item) : { value: item }
        );
      } else if (typeof parsed === 'object' && parsed !== null) {
        data = [flattenObject(parsed)];
      } else {
        setError(t('jsonToExcel.invalidJson'));
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch {
      setError(t('jsonToExcel.exportError'));
    }
  };

  const loadSample = () => {
    const sample = JSON.stringify([
      { id: 1, name: "John Doe", email: "john@example.com", age: 30 },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25 },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35 }
    ], null, 2);
    handleJsonChange(sample);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('jsonToExcel.jsonInput')}
          </label>
          <button
            onClick={loadSample}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            {t('jsonToExcel.loadSample')}
          </button>
        </div>
        <textarea
          value={jsonInput}
          onChange={(e) => handleJsonChange(e.target.value)}
          placeholder={t('jsonToExcel.placeholder')}
          className="w-full h-48 p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('jsonToExcel.fileName')}
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('jsonToExcel.sheetName')}
          </label>
          <input
            type="text"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('jsonToExcel.preview')}
          </h3>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-64">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {headers.map(header => (
                    <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {preview.map((row, idx) => (
                  <tr key={idx}>
                    {headers.map(header => (
                      <td key={header} className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {String(row[header] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!jsonInput.trim() || !!error}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {t('jsonToExcel.download')}
      </button>
    </div>
  );
}
