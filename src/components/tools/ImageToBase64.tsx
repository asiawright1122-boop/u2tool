'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageToBase64() {
  const t = useTranslations('tools');
  const ti = useTranslations('tools.image-to-base64');
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const copyDataUrl = async () => {
    await navigator.clipboard.writeText(base64);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const copyRawBase64 = async () => {
    const raw = base64.split(',')[1] || base64;
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setBase64('');
    setPreview('');
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-transparent"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-4xl mb-4">🖼️</div>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{ti('uploadHint')}</p>
        <p className="text-xs text-gray-500 dark:text-gray-300">{ti('supportedFormats')}</p>
      </div>

      {fileInfo && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-contain bg-white dark:bg-gray-900 rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white truncate">{fileInfo.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{fileInfo.type}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{fileInfo.size}</p>
            </div>
            <button onClick={clearAll} className="btn-secondary text-sm">
              {t('clear')}
            </button>
          </div>
        </div>
      )}

      {base64 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={copyDataUrl} className="btn-primary">
              {copied ? t('copied') : ti('copyDataUrl')}
            </button>
            <button onClick={copyRawBase64} className="btn-secondary">
              {ti('copyRawBase64')}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{ti('base64Output')}</label>
            <textarea
              className="tool-textarea text-xs"
              value={base64}
              readOnly
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{ti('htmlImageTag')}</label>
            <textarea
              className="tool-textarea text-xs"
              value={`<img src="${base64}" alt="image" />`}
              readOnly
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{ti('cssBackground')}</label>
            <textarea
              className="tool-textarea text-xs"
              value={`background-image: url('${base64}');`}
              readOnly
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
