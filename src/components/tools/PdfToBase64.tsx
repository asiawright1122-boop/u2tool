'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function PdfToBase64() {
  const t = useTranslations('tools.pdf-to-base64');
  const [base64, setBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [includeDataUri, setIncludeDataUri] = useState(true);
  const [error, setError] = useState('');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError(t('errorNotPdf'));
      return;
    }

    setError('');
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        setBase64(result);
      } else {
        setBase64(result.split(',')[1] || '');
      }
    };
    reader.onerror = () => {
      setError(t('errorReading'));
    };
    reader.readAsDataURL(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDataUri]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError(t('errorNotPdf'));
      return;
    }

    setError('');
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        setBase64(result);
      } else {
        setBase64(result.split(',')[1] || '');
      }
    };
    reader.readAsDataURL(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDataUri]);

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
  };

  const handleClear = () => {
    setBase64('');
    setFileName('');
    setFileSize(0);
    setError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleDataUri = () => {
    setIncludeDataUri(!includeDataUri);
    if (base64) {
      if (!includeDataUri) {
        setBase64('data:application/pdf;base64,' + base64);
      } else {
        setBase64(base64.split(',')[1] || '');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-input"
        />
        <label htmlFor="pdf-input" className="cursor-pointer">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{t('dropzone')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('acceptedFormat')}</p>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {fileName && (
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('originalSize')}: {formatFileSize(fileSize)} | 
                Base64: {formatFileSize(base64.length)}
              </p>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDataUri}
            onChange={toggleDataUri}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('includeDataUri')}</span>
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('base64Output')}
          </label>
          {base64 && (
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {t('copy')}
            </button>
          )}
        </div>
        <textarea
          value={base64}
          readOnly
          placeholder={t('outputPlaceholder')}
          className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs"
        />
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  );
}
