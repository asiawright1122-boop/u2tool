'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function ExcelToCsv() {
  const t = useTranslations('tool.excelToCsv');
  const tc = useTranslations('tools');
  const [csv, setCsv] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [workbook, setWorkbook] = useState<any | null>(null);

  const loadExcel = useCallback(async (file: File) => {
    setLoading(true);
    setError('');
    setCsv('');
    setFileName(file.name);

    try {
      const XLSX = await import('xlsx');
      const arrayBuffer = await file.arrayBuffer();
      const wb = XLSX.read(arrayBuffer, { type: 'array' });
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0]);
      const csvData = XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
      setCsv(csvData);
    } catch {
      setError(t('errorParsing'));
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSheetChange = async (sheetName: string) => {
    if (workbook) {
      const XLSX = await import('xlsx');
      setSelectedSheet(sheetName);
      const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      setCsv(csvData);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.match(/\.(xlsx|xls)$/i)) {
      loadExcel(file);
    } else {
      setError(t('errorInvalidFile'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadExcel]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadExcel(file);
  };

  const copyToClipboard = () => navigator.clipboard.writeText(csv);

  const downloadCsv = () => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace(/\.(xlsx|xls)$/i, `_${selectedSheet}.csv`);
    a.click();
    URL.revokeObjectURL(url);
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
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          id="excel-csv-input"
        />
        <label htmlFor="excel-csv-input" className="cursor-pointer">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p className="text-sm text-gray-500 mt-2">XLSX, XLS → CSV</p>
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

      {csv && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{fileName}</span>
              {sheets.length > 1 && (
                <select
                  value={selectedSheet}
                  onChange={(e) => handleSheetChange(e.target.value)}
                  className="px-3 py-1 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
                >
                  {sheets.map((sheet) => (
                    <option key={sheet} value={sheet}>{sheet}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tc('copy')}
              </button>
              <button
                onClick={downloadCsv}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {tc('download')} CSV
              </button>
            </div>
          </div>
          <textarea
            value={csv}
            readOnly
            className="w-full h-96 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
