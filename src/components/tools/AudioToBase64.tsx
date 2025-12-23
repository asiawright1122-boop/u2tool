'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function AudioToBase64() {
  const t = useTranslations('tools.audio-to-base64');
  const [base64, setBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [includeDataUri, setIncludeDataUri] = useState(true);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const supportedFormats = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/flac', 'audio/mp4'];

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supportedFormats.includes(file.type) && !file.type.startsWith('audio/')) {
      setError(t('errorNotAudio'));
      return;
    }

    setError('');
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);
    setAudioUrl(URL.createObjectURL(file));

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
  }, [includeDataUri, t]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!supportedFormats.includes(file.type) && !file.type.startsWith('audio/')) {
      setError(t('errorNotAudio'));
      return;
    }

    setError('');
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);
    setAudioUrl(URL.createObjectURL(file));

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
  }, [includeDataUri, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
  };

  const handleClear = () => {
    setBase64('');
    setFileName('');
    setFileSize(0);
    setMimeType('');
    setError('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl('');
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
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="audio-input"
        />
        <label htmlFor="audio-input" className="cursor-pointer">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-gray-300 mb-2">{t('dropzone')}</p>
          <p className="text-sm text-gray-300">{t('acceptedFormats')}</p>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {fileName && (
        <div className="p-4 bg-gray-900 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-100">{fileName}</p>
              <p className="text-sm text-gray-300">
                {mimeType} | {t('originalSize')}: {formatFileSize(fileSize)} | Base64: {formatFileSize(base64.length)}
              </p>
            </div>
            <button
              onClick={handleClear}
              className="text-gray-300 hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          {audioUrl && (
            <audio ref={audioRef} controls className="w-full">
              <source src={audioUrl} type={mimeType} />
            </audio>
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
          <span className="text-sm text-gray-300">{t('includeDataUri')}</span>
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
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
          className="w-full h-48 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 font-mono text-xs"
        />
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">{t('supportedFormats')}</h3>
        <p className="text-sm text-blue-700">MP3, WAV, OGG, WebM, AAC, FLAC, M4A</p>
      </div>
    </div>
  );
}
