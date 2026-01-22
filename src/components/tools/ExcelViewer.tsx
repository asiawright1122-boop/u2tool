'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';

interface SheetData {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

type SortDirection = 'asc' | 'desc' | null;

export default function ExcelViewer() {
  const t = useTranslations('tools');

  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValidType = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (!isValidType) {
      setError(t('excelViewer.invalidFileType'));
      return;
    }

    setError('');
    setFileName(file.name);
    setSortColumn('');
    setSortDirection(null);
    setFilterColumn('');
    setFilterValue('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const parsedSheets: SheetData[] = workbook.SheetNames.map(name => {
          const worksheet = workbook.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
          const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
          return { name, data: jsonData, headers };
        });

        setSheets(parsedSheets);
        if (parsedSheets.length > 0) {
          setSelectedSheet(parsedSheets[0].name);
        }
      } catch {
        setError(t('excelViewer.parseError'));
      }
    };
    reader.readAsArrayBuffer(file);
  }, [t]);

  const currentSheet = sheets.find(s => s.name === selectedSheet);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') { setSortColumn(''); setSortDirection(null); }
      else setSortDirection('asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const processedData = useMemo(() => {
    if (!currentSheet) return [];

    let data = [...currentSheet.data];

    // Filter
    if (filterColumn && filterValue) {
      data = data.filter(row => {
        const cellValue = String(row[filterColumn] ?? '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    }

    // Sort
    if (sortColumn && sortDirection) {
      data.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return data;
  }, [currentSheet, filterColumn, filterValue, sortColumn, sortDirection]);

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="tool-dropzone">
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" id="excel-viewer-upload" />
        <label htmlFor="excel-viewer-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">👁️</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('excelViewer.uploadFile')}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('excelViewer.supportedFormats')}</span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {fileName && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
          {t('excelViewer.fileLoaded')}: {fileName}
        </div>
      )}

      {/* Sheet Tabs */}
      {sheets.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {sheets.map(sheet => (
            <button
              key={sheet.name}
              onClick={() => { setSelectedSheet(sheet.name); setFilterColumn(''); setFilterValue(''); }}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${selectedSheet === sheet.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      {/* Filter */}
      {currentSheet && currentSheet.headers.length > 0 && (
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('excelViewer.filterColumn')}
            </label>
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="tool-select"
            >
              <option value="">{t('excelViewer.selectColumn')}</option>
              {currentSheet.headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('excelViewer.filterValue')}
            </label>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={t('excelViewer.enterValue')}
              className="tool-input"
              disabled={!filterColumn}
            />
          </div>
          {(filterColumn || filterValue) && (
            <button
              onClick={() => { setFilterColumn(''); setFilterValue(''); }}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              {t('excelViewer.clearFilter')}
            </button>
          )}
        </div>
      )}

      {/* Data Table */}
      {currentSheet && processedData.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t('excelViewer.showing')} {processedData.length} / {currentSheet.data.length} {t('excelViewer.rows')}
          </p>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-96">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {currentSheet.headers.map(header => (
                    <th
                      key={header}
                      onClick={() => handleSort(header)}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {sortColumn === header && (
                          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {processedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {currentSheet.headers.map(header => (
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

      {currentSheet && processedData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {filterValue ? t('excelViewer.noResults') : t('excelViewer.emptySheet')}
        </div>
      )}
    </div>
  );
}
