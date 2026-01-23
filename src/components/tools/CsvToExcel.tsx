'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function CsvToExcel() {
  const t = useTranslations('tool.csvToExcel');
  const tc = useTranslations('tools');
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const loadCsv = useCallback(async (file: File) => {
    setLoading(true);
    setError('');
    setData([]);
    setFileName(file.name);

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      }).filter(row => row.some(cell => cell));
      setData(rows);
    } catch {
      setError(t('errorParsing'));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) {
      loadCsv(file);
    } else {
      setError(t('errorInvalidFile'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCsv]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadCsv(file);
  };

  const downloadExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, fileName.replace('.csv', '.xlsx'));
    } catch (error) {
      console.error('Failed to export Excel:', error);
      setError(t('errorExport'));
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-excel-input"
        />
        <label htmlFor="csv-excel-input" className="cursor-pointer">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p className="text-sm text-gray-500 mt-2">CSV → XLSX</p>
        </label>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('converting')}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {data.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {fileName} - {data.length} {t('rows')}
            </div>
            <button
              onClick={downloadExcel}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {tc('download')} XLSX
            </button>
          </div>
          <div className="overflow-auto max-h-96 border rounded-lg dark:border-gray-700">
            <table className="w-full text-sm">
              <tbody>
                {data.slice(0, 100).map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'border-t dark:border-gray-700'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 100 && (
              <div className="text-center py-2 text-gray-500 text-sm">
                {t('showingFirst')} 100 / {data.length} {t('rows')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
