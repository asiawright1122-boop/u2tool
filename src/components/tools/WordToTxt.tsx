'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import mammoth from 'mammoth';

export default function WordToTxt() {
  const t = useTranslations('tool.wordToTxt');
  const tc = useTranslations('tools');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const extractText = useCallback(async (file: File) => {
    setLoading(true);
    setError('');
    setText('');
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setText(result.value);
    } catch {
      setError(t('errorParsing'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.docx')) {
      extractText(file);
    } else {
      setError(t('errorInvalidFile'));
    }
  }, [extractText, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractText(file);
  };

  const copyToClipboard = () => navigator.clipboard.writeText(text);

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.docx', '.txt');
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
          accept=".docx"
          onChange={handleFileChange}
          className="hidden"
          id="word-input"
        />
        <label htmlFor="word-input" className="cursor-pointer">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p className="text-sm text-gray-500 mt-2">DOCX</p>
        </label>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('extracting')}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {text && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">{fileName}</div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tc('copy')}
              </button>
              <button
                onClick={downloadTxt}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {tc('download')} TXT
              </button>
            </div>
          </div>
          <textarea
            value={text}
            readOnly
            className="w-full h-96 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}
