'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageCompressor() {
  const t = useTranslations('tools.imageCompressor');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setCompressedImage(null);
      setCompressedSize(0);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    if (!originalImage) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Compress to JPEG with specified quality
      const compressed = canvas.toDataURL('image/jpeg', quality / 100);
      setCompressedImage(compressed);

      // Calculate compressed size
      const base64Length = compressed.split(',')[1].length;
      const compressedBytes = Math.ceil((base64Length * 3) / 4);
      setCompressedSize(compressedBytes);

      setIsProcessing(false);
    };
    img.src = originalImage;
  };

  const downloadCompressed = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_compressed.jpg`;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSavingsPercent = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round((1 - compressedSize / originalSize) * 100);
  };

  const clearAll = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quality Control */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('quality')}:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm font-mono w-12">{quality}%</span>
        </div>
        <button
          onClick={clearAll}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          {t('clear')}
        </button>
      </div>

      {/* File Input */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-300">{t('dropzone')}</p>
        {fileName && <p className="text-sm text-gray-300 mt-2">{fileName}</p>}
      </div>

      {/* Preview */}
      {originalImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">{t('original')}</label>
              <span className="text-sm text-gray-300">{formatSize(originalSize)}</span>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              <img
                src={originalImage}
                alt="Original"
                className="max-w-full max-h-64 object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">{t('compressed')}</label>
              {compressedSize > 0 && (
                <span className="text-sm text-green-400">
                  {formatSize(compressedSize)} ({t('saved')} {getSavingsPercent()}%)
                </span>
              )}
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {compressedImage ? (
                <img
                  src={compressedImage}
                  alt="Compressed"
                  className="max-w-full max-h-64 object-contain"
                />
              ) : (
                <p className="text-gray-300">{t('compressFirst')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {originalImage && (
        <div className="flex justify-center gap-4">
          <button
            onClick={compressImage}
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
          >
            {isProcessing ? t('processing') : t('compress')}
          </button>
          {compressedImage && (
            <button
              onClick={downloadCompressed}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
            >
              {t('download')}
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      {compressedSize > 0 && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{formatSize(originalSize)}</div>
            <div className="text-sm text-gray-300">{t('originalSize')}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{formatSize(compressedSize)}</div>
            <div className="text-sm text-gray-300">{t('compressedSize')}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{getSavingsPercent()}%</div>
            <div className="text-sm text-gray-300">{t('reduction')}</div>
          </div>
        </div>
      )}
    </div>
  );
}
