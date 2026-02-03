'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

type Mode = 'encode' | 'decode';

export default function Base64ImageConverter() {
  const t = useTranslations('tools.base64-image-converter');
  const tCommon = useTranslations('tools');
  const [mode, setMode] = useState<Mode>('encode');
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setFileInfo({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64Output(result);
      setImagePreview(result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleBase64Decode = useCallback(() => {
    if (!base64Input.trim()) {
      setError(t('errorInvalidInput'));
      setImagePreview(null);
      return;
    }

    try {
      let dataUrl = base64Input.trim();
      
      // Add data URL prefix if missing
      if (!dataUrl.startsWith('data:')) {
        // Try to detect image type from base64
        const firstChars = dataUrl.substring(0, 10);
        let mimeType = 'image/png';
        if (firstChars.startsWith('/9j/')) mimeType = 'image/jpeg';
        else if (firstChars.startsWith('iVBOR')) mimeType = 'image/png';
        else if (firstChars.startsWith('R0lGO')) mimeType = 'image/gif';
        else if (firstChars.startsWith('UklGR')) mimeType = 'image/webp';
        
        dataUrl = `data:${mimeType};base64,${dataUrl}`;
      }

      // Validate by creating an image
      const img = new Image();
      img.onload = () => {
        setImagePreview(dataUrl);
        setError('');
      };
      img.onerror = () => {
        setError(t('errorInvalidFormat'));
        setImagePreview(null);
      };
      img.src = dataUrl;
    } catch {
      setError(t('errorInvalidFormat'));
      setImagePreview(null);
    }
  }, [base64Input, t]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(base64Output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [base64Output]);

  const handleDownload = useCallback(() => {
    if (!imagePreview) return;

    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = 'image.' + (imagePreview.includes('jpeg') ? 'jpg' : 'png');
    link.click();
  }, [imagePreview]);

  const handleClear = useCallback(() => {
    setBase64Input('');
    setBase64Output('');
    setImagePreview(null);
    setError('');
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('encode'); handleClear(); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('imageToBase64')}
        </button>
        <button
          onClick={() => { setMode('decode'); handleClear(); }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('base64ToImage')}
        </button>
      </div>

      {mode === 'encode' ? (
        /* Encode Mode: Image to Base64 */
        <div className="space-y-6">
          {/* File Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">{t('dropImageHere')}</p>
              <p className="text-sm mt-1">{t('supportsFormats')}</p>
            </div>
          </div>

          {/* File Info */}
          {fileInfo && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{t('name')}:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{fileInfo.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{t('size')}:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{fileInfo.size}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">{t('type')}:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{fileInfo.type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview and Output */}
          {imagePreview && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('preview')}
                </label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-w-full max-h-64 mx-auto" style={{ aspectRatio: 'auto' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Base64 {tCommon('output')}
                </label>
                <textarea
                  value={base64Output}
                  readOnly
                  className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs resize-none"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {base64Output && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleCopy}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {tCommon('clear')}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Decode Mode: Base64 to Image */
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base64 {tCommon('input')}
            </label>
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleBase64Decode}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('decode')}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {tCommon('clear')}
            </button>
          </div>

          {/* Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('preview')}
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] flex items-center justify-center">
                <img src={imagePreview} alt="Decoded" className="max-w-full max-h-96 mx-auto" style={{ aspectRatio: 'auto' }} />
              </div>
              <div className="mt-4">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {tCommon('download')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
