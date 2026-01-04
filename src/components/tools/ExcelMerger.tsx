'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';

interface FileData {
  id: string;
  name: string;
  sheets: { name: string; data: Record<string, unknown>[]; headers: string[]; selected: boolean }[];
}

export default function ExcelMerger() {
  const t = useTranslations('tools');
  
  const [files, setFiles] = useState<FileData[]>([]);
  const [mergeMode, setMergeMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [error, setError] = useState<string>('');
  const [outputFileName, setOutputFileName] = useState<string>('merged');

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    setError('');

    Array.from(uploadedFiles).forEach(file => {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setError(t('excelMerger.invalidFileType'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = workbook.SheetNames.map(name => {
            const worksheet = workbook.Sheets[name];
            const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);
            const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
            return { name, data: jsonData, headers, selected: true };
          });

          setFiles(prev => [...prev, { id: Date.now().toString() + Math.random(), name: file.name, sheets }]);
        } catch {
          setError(t('excelMerger.parseError'));
        }
      };
      reader.readAsArrayBuffer(file);
    });

    e.target.value = '';
  }, [t]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const toggleSheet = (fileId: string, sheetName: string) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          sheets: f.sheets.map(s => s.name === sheetName ? { ...s, selected: !s.selected } : s)
        };
      }
      return f;
    }));
  };

  const handleMerge = () => {
    const selectedSheets = files.flatMap(f => 
      f.sheets.filter(s => s.selected).map(s => ({ fileName: f.name, ...s }))
    );

    if (selectedSheets.length === 0) {
      setError(t('excelMerger.noSheetsSelected'));
      return;
    }

    try {
      const mergedData: Record<string, unknown>[] = [];

      if (mergeMode === 'vertical') {
        // Collect all headers
        const allHeaders = new Set<string>();
        selectedSheets.forEach(s => s.headers.forEach(h => allHeaders.add(h)));
        
        // Merge data vertically
        selectedSheets.forEach(sheet => {
          sheet.data.forEach(row => {
            const newRow: Record<string, unknown> = {};
            allHeaders.forEach(h => { newRow[h] = row[h] ?? ''; });
            mergedData.push(newRow);
          });
        });
      } else {
        // Horizontal merge - append columns
        const maxRows = Math.max(...selectedSheets.map(s => s.data.length));
        
        for (let i = 0; i < maxRows; i++) {
          const row: Record<string, unknown> = {};
          selectedSheets.forEach((sheet, _sheetIdx) => {
            const prefix = selectedSheets.length > 1 ? `${sheet.name}_` : '';
            sheet.headers.forEach(h => {
              row[`${prefix}${h}`] = sheet.data[i]?.[h] ?? '';
            });
          });
          mergedData.push(row);
        }
      }

      const worksheet = XLSX.utils.json_to_sheet(mergedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Merged');
      XLSX.writeFile(workbook, `${outputFileName}.xlsx`);
    } catch {
      setError(t('excelMerger.mergeError'));
    }
  };

  const totalSelectedSheets = files.reduce((sum, f) => sum + f.sheets.filter(s => s.selected).length, 0);

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input type="file" accept=".xlsx,.xls" multiple onChange={handleFileUpload} className="hidden" id="excel-merger-upload" />
        <label htmlFor="excel-merger-upload" className="cursor-pointer flex flex-col items-center">
          <span className="text-4xl mb-2">🔗</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{t('excelMerger.uploadFiles')}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('excelMerger.multipleFiles')}</span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('excelMerger.uploadedFiles')}</h3>
          {files.map(file => (
            <div key={file.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
                <button onClick={() => removeFile(file.id)} className="text-red-500 hover:text-red-700">✕</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {file.sheets.map(sheet => (
                  <button
                    key={sheet.name}
                    onClick={() => toggleSheet(file.id, sheet.name)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      sheet.selected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {sheet.name} ({sheet.data.length})
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Options */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('excelMerger.mergeMode')}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="vertical"
                  checked={mergeMode === 'vertical'}
                  onChange={() => setMergeMode('vertical')}
                  className="mr-2"
                />
                {t('excelMerger.vertical')}
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="horizontal"
                  checked={mergeMode === 'horizontal'}
                  onChange={() => setMergeMode('horizontal')}
                  className="mr-2"
                />
                {t('excelMerger.horizontal')}
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('excelMerger.outputFileName')}
            </label>
            <input
              type="text"
              value={outputFileName}
              onChange={(e) => setOutputFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      )}

      {/* Merge Button */}
      {files.length > 0 && (
        <button
          onClick={handleMerge}
          disabled={totalSelectedSheets === 0}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {t('excelMerger.merge')} ({totalSelectedSheets} {t('excelMerger.sheets')})
        </button>
      )}
    </div>
  );
}
