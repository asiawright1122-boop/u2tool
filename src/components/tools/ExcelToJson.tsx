'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import * as XLSX from 'xlsx';

interface SheetData {
  name: string;
  data: Record<string, unknown>[];
  headers: string[];
}

export default function ExcelToJson() {
  const t = useTranslations('tools');
  
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      '.xlsx',
      '.xls'
    ];
    
    const isValidType = validTypes.some(type => 
      file.type === type || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );

    if (!isValidType) {
      setError(t('excelToJson.invalidFileType'));
      return;
    }

    setError('');
    setFileName(file.name);

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
          setJsonOutput(JSON.stringify(parsedSheets[0].data, null, 2));
        }
      } catch {
        setError(t('excelToJson.parseError'));
      }
    };
    reader.readAsArrayBuffer(file);
  }, [t]);

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    const sheet = sheets.find(s => s.name === sheetName);
    if (sheet) {
      setJsonOutput(JSON.stringify(sheet.data, null, 2));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t('excelToJson.copyError'));
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.(xlsx|xls)$/i, '')}_${selectedSheet}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentSheet = sheets.find(s => s.name === selectedSheet);

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          id="excel-upload"
        />
        <label
          htmlFor="excel-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <span className="text-4xl mb-2">📊</span>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {t('excelToJson.uploadFile')}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('excelToJson.supportedFormats')}
          </span>
        </label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {fileName && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
          {t('excelToJson.fileLoaded')}: {fileName}
        </div>
      )}

      {/* Sheet Selection */}
      {sheets.length > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('excelToJson.selectSheet')}
          </label>
          <div className="flex flex-wrap gap-2">
            {sheets.map(sheet => (
              <button
                key={sheet.name}
                onClick={() => handleSheetChange(sheet.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSheet === sheet.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {sheet.name} ({sheet.data.length} {t('excelToJson.rows')})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {currentSheet && currentSheet.data.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('excelToJson.preview')} ({currentSheet.data.length} {t('excelToJson.rows')})
          </h3>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-64">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  {currentSheet.headers.map(header => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {currentSheet.data.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {currentSheet.headers.map(header => (
                      <td
                        key={header}
                        className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
                      >
                        {String(row[header] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {currentSheet.data.length > 10 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('excelToJson.showingFirst')} 10 / {currentSheet.data.length} {t('excelToJson.rows')}
            </p>
          )}
        </div>
      )}

      {/* JSON Output */}
      {jsonOutput && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('excelToJson.jsonOutput')}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {copied ? t('excelToJson.copied') : t('excelToJson.copy')}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t('excelToJson.download')}
              </button>
            </div>
          </div>
          <textarea
            value={jsonOutput}
            readOnly
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
