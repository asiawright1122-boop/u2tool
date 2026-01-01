'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';

interface ImageFile {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  originalSize: number;
  convertedDataUrl?: string;
  convertedSize?: number;
}

export default function ImageToWebp() {
  const t = useTranslations('tools.image-to-webp');
  const tg = useTranslations('tools');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          dataUrl: event.target?.result as string,
          name: file.name,
          originalSize: file.size,
        };
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const convertToWebp = async () => {
    setIsProcessing(true);

    const convertedImages = await Promise.all(
      images.map(async (img) => {
        return new Promise<ImageFile>((resolve) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(image, 0, 0);
              const webpDataUrl = canvas.toDataURL('image/webp', quality / 100);
              const base64Length = webpDataUrl.split(',')[1].length;
              const convertedSize = Math.ceil((base64Length * 3) / 4);
              resolve({
                ...img,
                convertedDataUrl: webpDataUrl,
                convertedSize,
              });
            } else {
              resolve(img);
            }
          };
          image.src = img.dataUrl;
        });
      })
    );

    setImages(convertedImages);
    setIsProcessing(false);
  };

  const downloadSingle = (img: ImageFile) => {
    if (!img.convertedDataUrl) return;
    const link = document.createElement('a');
    link.href = img.convertedDataUrl;
    const baseName = img.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}.webp`;
    link.click();
  };

  const downloadAll = async () => {
    const convertedImages = images.filter((img) => img.convertedDataUrl);
    if (convertedImages.length === 0) return;

    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0]);
      return;
    }

    const zip = new JSZip();
    convertedImages.forEach((img) => {
      if (img.convertedDataUrl) {
        const base64Data = img.convertedDataUrl.split(',')[1];
        const baseName = img.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}.webp`, base64Data, { base64: true });
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `webp-images-${convertedImages.length}.zip`;
    link.click();
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSavings = () => {
    const originalTotal = images.reduce((sum, img) => sum + img.originalSize, 0);
    const convertedTotal = images.reduce((sum, img) => sum + (img.convertedSize || img.originalSize), 0);
    if (originalTotal === 0) return 0;
    return Math.round((1 - convertedTotal / originalTotal) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t('quality')}:</label>
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
        <button onClick={clearAll} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="text-4xl mb-2">🌐</div>
        <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        <p className="text-sm text-gray-500">{t('supportedFormats')}</p>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('images')} ({images.length})</h3>
            {images.some((img) => img.convertedDataUrl) && (
              <span className="text-sm text-green-600 dark:text-green-400">
                {t('totalSavings')}: {getTotalSavings()}%
              </span>
            )}
          </div>

          <div className="space-y-2">
            {images.map((img) => (
              <div
                key={img.id}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <img
                  src={img.convertedDataUrl || img.dataUrl}
                  alt={img.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{img.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatSize(img.originalSize)}
                    {img.convertedSize && (
                      <span className="text-green-600 dark:text-green-400">
                        {' → '}{formatSize(img.convertedSize)}
                        {' ('}{Math.round((1 - img.convertedSize / img.originalSize) * 100)}%{' '}{t('saved')})
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  {img.convertedDataUrl && (
                    <button
                      onClick={() => downloadSingle(img)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                    >
                      {tg('download')}
                    </button>
                  )}
                  <button
                    onClick={() => removeImage(img.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {images.length > 0 && (
        <div className="flex justify-center gap-4">
          <button
            onClick={convertToWebp}
            disabled={isProcessing}
            className="btn-primary px-8"
          >
            {isProcessing ? t('processing') : t('convert')}
          </button>
          {images.some((img) => img.convertedDataUrl) && (
            <button onClick={downloadAll} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {t('downloadAll')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
