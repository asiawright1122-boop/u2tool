'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function DataUri() {
  const t = useTranslations('tools');
  const td = useTranslations('tools.data-uri');
  const [dataUri, setDataUri] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDataUri(reader.result as string);
      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.type || 'unknown'
      });
    };
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(dataUri);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setDataUri('');
    setFileInfo(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-transparent" onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
        <p className="text-gray-600 dark:text-gray-300">{t('dataUri.dropzone')}</p>
      </div>
      {fileInfo && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 grid grid-cols-3 gap-4 text-sm text-gray-900 dark:text-white">
          <div><span className="text-gray-600 dark:text-gray-300">{t('dataUri.fileName')}:</span> {fileInfo.name}</div>
          <div><span className="text-gray-600 dark:text-gray-300">{t('dataUri.fileSize')}:</span> {fileInfo.size}</div>
          <div><span className="text-gray-600 dark:text-gray-300">{t('dataUri.fileType')}:</span> {fileInfo.type}</div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{td('output')}</label>
        <textarea value={dataUri} readOnly className="w-full h-40 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-xs break-all text-gray-900 dark:text-white" />
      </div>
      <div className="flex gap-2">
        <button onClick={copy} disabled={!dataUri} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{copied ? t('copied') : t('copy')}</button>
        <button onClick={clear} className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{t('clear')}</button>
      </div>
      {dataUri && dataUri.startsWith('data:image') && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('dataUri.preview')}</p>
          <img src={dataUri} alt="Preview" className="max-w-full max-h-64 mx-auto" />
        </div>
      )}
    </div>
  );
}
