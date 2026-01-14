'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function WebpToPng() {
  const t = useTranslations('tools.webp-to-png');
  const [imageUrl, setImageUrl] = useState('');
  const [quality, setQuality] = useState(100);
  const [fileName, setFileName] = useState('converted');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/webp') {
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToPng = () => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${fileName}.png`;
          a.click();
          URL.revokeObjectURL(downloadUrl);
        }
      }, 'image/png', quality / 100);
    };
    img.src = imageUrl;
  };

  const clearImage = () => {
    setImageUrl('');
    setFileName('converted');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors"
      >
        {imageUrl ? (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <button
              onClick={clearImage}
              className="text-sm text-red-500 hover:text-red-600"
            >
              {t('removeImage')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">🖼️</div>
            <p className="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/webp"
              onChange={handleFileUpload}
              className="hidden"
              id="webp-upload"
            />
            <label
              htmlFor="webp-upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {t('selectFile')}
            </label>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fileName')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <span className="text-gray-500">.png</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('quality')}: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={convertToPng}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {t('download')}
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
