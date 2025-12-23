'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: '2:3', value: 2 / 3 },
];

export default function ImageCropper() {
  const t = useTranslations('tools.imageCropper');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        // Initialize crop area to center 50%
        const size = Math.min(img.width, img.height) * 0.5;
        setCropArea({
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          width: size,
          height: aspectRatio ? size / aspectRatio : size,
        });
      };
      img.src = event.target?.result as string;
      setOriginalImage(event.target?.result as string);
      setCroppedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = imageSize.width / rect.width;
      const scaleY = imageSize.height / rect.height;
      setIsDragging(true);
      setDragStart({
        x: (e.clientX - rect.left) * scaleX - cropArea.x,
        y: (e.clientY - rect.top) * scaleY - cropArea.y,
      });
    },
    [cropArea, imageSize]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = imageSize.width / rect.width;
      const scaleY = imageSize.height / rect.height;

      let newX = (e.clientX - rect.left) * scaleX - dragStart.x;
      let newY = (e.clientY - rect.top) * scaleY - dragStart.y;

      // Constrain to image bounds
      newX = Math.max(0, Math.min(newX, imageSize.width - cropArea.width));
      newY = Math.max(0, Math.min(newY, imageSize.height - cropArea.height));

      setCropArea((prev) => ({ ...prev, x: newX, y: newY }));
    },
    [isDragging, dragStart, imageSize, cropArea.width, cropArea.height]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    const newValue = Math.max(10, Math.min(value, imageSize[dimension]));
    if (aspectRatio) {
      if (dimension === 'width') {
        setCropArea((prev) => ({
          ...prev,
          width: newValue,
          height: newValue / aspectRatio,
        }));
      } else {
        setCropArea((prev) => ({
          ...prev,
          height: newValue,
          width: newValue * aspectRatio,
        }));
      }
    } else {
      setCropArea((prev) => ({ ...prev, [dimension]: newValue }));
    }
  };

  const handleAspectRatioChange = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio) {
      setCropArea((prev) => ({
        ...prev,
        height: prev.width / ratio,
      }));
    }
  };

  const cropImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      setCroppedImage(canvas.toDataURL('image/png'));
    };
    img.src = originalImage;
  };

  const downloadCropped = () => {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.href = croppedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_cropped.png`;
    link.click();
  };

  const clearAll = () => {
    setOriginalImage(null);
    setCroppedImage(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('aspectRatio')}:</label>
          <select
            value={aspectRatio?.toString() || 'free'}
            onChange={(e) =>
              handleAspectRatioChange(e.target.value === 'free' ? null : parseFloat(e.target.value))
            }
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm"
          >
            {ASPECT_RATIOS.map((r) => (
              <option key={r.label} value={r.value?.toString() || 'free'}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={clearAll}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          {t('clear')}
        </button>
      </div>

      {/* File Input */}
      {!originalImage && (
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
          <div className="text-4xl mb-2">✂️</div>
          <p className="text-gray-300">{t('dropzone')}</p>
        </div>
      )}

      {/* Crop Area */}
      {originalImage && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">{t('selectArea')}</label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              >
                {t('changeImage')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div
              ref={containerRef}
              className="relative bg-gray-800 border border-gray-700 rounded-lg overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img src={originalImage} alt="Original" className="w-full h-auto" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />
              {/* Crop selection */}
              <div
                className="absolute border-2 border-white bg-transparent pointer-events-none"
                style={{
                  left: `${(cropArea.x / imageSize.width) * 100}%`,
                  top: `${(cropArea.y / imageSize.height) * 100}%`,
                  width: `${(cropArea.width / imageSize.width) * 100}%`,
                  height: `${(cropArea.height / imageSize.height) * 100}%`,
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                }}
              />
            </div>

            {/* Size inputs */}
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">{t('width')}:</label>
                <input
                  type="number"
                  value={Math.round(cropArea.width)}
                  onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                  className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">{t('height')}:</label>
                <input
                  type="number"
                  value={Math.round(cropArea.height)}
                  onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                  className="w-20 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-300">{t('preview')}</label>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {croppedImage ? (
                <img
                  src={croppedImage}
                  alt="Cropped"
                  className="max-w-full max-h-64 object-contain"
                />
              ) : (
                <p className="text-gray-300">{t('cropFirst')}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {originalImage && (
        <div className="flex justify-center gap-4">
          <button
            onClick={cropImage}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            {t('crop')}
          </button>
          {croppedImage && (
            <button
              onClick={downloadCropped}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
            >
              {t('download')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
