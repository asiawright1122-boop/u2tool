'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function VideoToBase64() {
  const t = useTranslations('tools.video-to-base64');
  const [base64, setBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [includeDataUri, setIncludeDataUri] = useState(true);
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB limit

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError(t('errorNotVideo'));
      return;
    }

    if (file.size > maxFileSize) {
      setError(t('errorTooLarge'));
      return;
    }

    setError('');
    setIsLoading(true);
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);
    setVideoUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        setBase64(result);
      } else {
        setBase64(result.split(',')[1] || '');
      }
      setIsLoading(false);
    };
    reader.onerror = () => {
      setError(t('errorReading'));
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDataUri]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError(t('errorNotVideo'));
      return;
    }

    if (file.size > maxFileSize) {
      setError(t('errorTooLarge'));
      return;
    }

    setError('');
    setIsLoading(true);
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);
    setVideoUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        setBase64(result);
      } else {
        setBase64(result.split(',')[1] || '');
      }
      setIsLoading(false);
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
    setMimeType('');
    setError('');
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl('');
    }
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
      if (!includeDataUri && mimeType) {
        setBase64(`data:${mimeType};base64,` + base64);
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
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-50 dark:bg-transparent"
      >
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-input"
        />
        <label htmlFor="video-input" className="cursor-pointer">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">{t('dropzone')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{t('maxSize')}</p>
        </label>
      </div>

      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2"></div>
          <p className="text-blue-700 dark:text-blue-400">{t('processing')}</p>
        </div>
      )}

      {fileName && !isLoading && (
        <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {mimeType} | {t('originalSize')}: {formatFileSize(fileSize)} | Base64: {formatFileSize(base64.length)}
              </p>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          {videoUrl && (
            <video ref={videoRef} controls className="w-full max-h-64 rounded">
              <source src={videoUrl} type={mimeType} />
            </video>
          )}
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
          <label className="tool-label mb-0">
            {t('base64Output')}
          </label>
          {base64 && (
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {t('copy')}
            </button>
          )}
        </div>
        <textarea
          value={base64}
          readOnly
          placeholder={t('outputPlaceholder')}
          className="tool-textarea text-xs"
        />
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('warning')}</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">{t('warningText')}</p>
      </div>
    </div>
  );
}
