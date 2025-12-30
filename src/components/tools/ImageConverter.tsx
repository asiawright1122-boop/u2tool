'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

type ImageFormat = 'png' | 'jpeg' | 'webp';

export default function ImageConverter() {
  const t = useTranslations('tools.imageConverter');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(90);
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
    const format = file.type.split('/')[1].toUpperCase();
    setOriginalFormat(format);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setConvertedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const convertImage = () => {
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

      // For PNG, fill with white background if original has transparency
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      const qualityValue = targetFormat === 'png' ? undefined : quality / 100;
      const converted = canvas.toDataURL(mimeType, qualityValue);
      setConvertedImage(converted);

      setIsProcessing(false);
    };
    img.src = originalImage;
  };

  const downloadConverted = () => {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.href = convertedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}.${targetFormat}`;
    link.click();
  };

  const clearAll = () => {
    setOriginalImage(null);
    setConvertedImage(null);
    setOriginalFormat('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formats: { value: ImageFormat; label: string }[] = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('targetFormat')}:</label>
          <select
            value={targetFormat}
            onChange={(e) => {
              setTargetFormat(e.target.value as ImageFormat);
              setConvertedImage(null);
            }}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm text-gray-900 dark:text-white"
          >
            {formats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {targetFormat !== 'png' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">{t('quality')}:</label>
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
        )}

        <button
          onClick={clearAll}
          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm"
        >
          {t('clear')}
        </button>
      </div>

      {/* File Input */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        {fileName && (
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
            {fileName} ({originalFormat})
          </p>
        )}
      </div>

      {/* Preview */}
      {originalImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('original')} ({originalFormat})
              </label>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              <img
                src={originalImage}
                alt="Original"
                className="max-w-full max-h-64 object-contain"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('converted')} ({targetFormat.toUpperCase()})
              </label>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {convertedImage ? (
                <img
                  src={convertedImage}
                  alt="Converted"
                  className="max-w-full max-h-64 object-contain"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-300">{t('convertFirst')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {originalImage && (
        <div className="flex justify-center gap-4">
          <button
            onClick={convertImage}
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
          >
            {isProcessing ? t('processing') : t('convert')}
          </button>
          {convertedImage && (
            <button
              onClick={downloadConverted}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              {t('download')}
            </button>
          )}
        </div>
      )}

      {/* Format Info */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-3 text-gray-900 dark:text-white">{t('formatInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-600 dark:text-blue-400">PNG</div>
            <p className="text-gray-600 dark:text-gray-300">{t('pngDesc')}</p>
          </div>
          <div>
            <div className="font-medium text-green-600 dark:text-green-400">JPEG</div>
            <p className="text-gray-600 dark:text-gray-300">{t('jpegDesc')}</p>
          </div>
          <div>
            <div className="font-medium text-purple-600 dark:text-purple-400">WebP</div>
            <p className="text-gray-600 dark:text-gray-300">{t('webpDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
