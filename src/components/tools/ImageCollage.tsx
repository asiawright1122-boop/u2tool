'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ImageFile {
  id: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  name: string;
}

type LayoutDirection = 'horizontal' | 'vertical';

export default function ImageCollage() {
  const t = useTranslations('tools.image-collage');
  const tg = useTranslations('tools');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [direction, setDirection] = useState<LayoutDirection>('horizontal');
  const [spacing, setSpacing] = useState(10);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [result, setResult] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newImage: ImageFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
            name: file.name,
          };
          setImages((prev) => [...prev, newImage]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setResult(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
    setResult(null);
  };

  const createCollage = () => {
    if (images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let totalWidth = 0;
    let totalHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    images.forEach((img) => {
      totalWidth += img.width;
      totalHeight += img.height;
      maxWidth = Math.max(maxWidth, img.width);
      maxHeight = Math.max(maxHeight, img.height);
    });

    const totalSpacing = spacing * (images.length - 1);

    if (direction === 'horizontal') {
      canvas.width = totalWidth + totalSpacing;
      canvas.height = maxHeight;
    } else {
      canvas.width = maxWidth;
      canvas.height = totalHeight + totalSpacing;
    }

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw images
    let currentX = 0;
    let currentY = 0;

    images.forEach((imgData) => {
      const img = new Image();
      img.src = imgData.dataUrl;

      if (direction === 'horizontal') {
        const y = (maxHeight - imgData.height) / 2;
        ctx.drawImage(img, currentX, y, imgData.width, imgData.height);
        currentX += imgData.width + spacing;
      } else {
        const x = (maxWidth - imgData.width) / 2;
        ctx.drawImage(img, x, currentY, imgData.width, imgData.height);
        currentY += imgData.height + spacing;
      }
    });

    setResult(canvas.toDataURL('image/png'));
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `collage-${Date.now()}.png`;
    link.href = result;
    link.click();
  };

  const clearAll = () => {
    setImages([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('direction')}</label>
          <select
            value={direction}
            onChange={(e) => { setDirection(e.target.value as LayoutDirection); setResult(null); }}
            className="tool-input"
          >
            <option value="horizontal">{t('horizontal')}</option>
            <option value="vertical">{t('vertical')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('spacing')}: {spacing}px</label>
          <input
            type="range"
            min="0"
            max="50"
            value={spacing}
            onChange={(e) => { setSpacing(Number(e.target.value)); setResult(null); }}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('backgroundColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => { setBackgroundColor(e.target.value); setResult(null); }}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => { setBackgroundColor(e.target.value); setResult(null); }}
              className="tool-input flex-1"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button onClick={clearAll} className="btn-secondary w-full">
            {tg('clear')}
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('multipleHint')}</p>
      </div>

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">{t('imageList')} ({images.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img, index) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-white rounded text-sm disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1 bg-red-500 text-white rounded text-sm"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 bg-white rounded text-sm disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">{img.width}×{img.height}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {images.length > 0 && (
        <div className="flex justify-center gap-4">
          <button onClick={createCollage} className="btn-primary px-8">
            {t('createCollage')}
          </button>
          {result && (
            <button onClick={downloadImage} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {tg('download')}
            </button>
          )}
        </div>
      )}

      {/* Result Preview */}
      {result && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('result')}</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-center">
            <img src={result} alt="Collage Result" className="max-w-full max-h-96 object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
}
