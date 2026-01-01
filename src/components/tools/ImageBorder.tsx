'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageBorder() {
  const t = useTranslations('tools.image-border');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [borderWidth, setBorderWidth] = useState(20);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newWidth = originalImage.width + borderWidth * 2;
    const newHeight = originalImage.height + borderWidth * 2;

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Fill border/padding
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, newHeight);

    // Draw image in center
    ctx.drawImage(originalImage, borderWidth, borderWidth);
  }, [originalImage, borderWidth, borderColor]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `bordered-${borderWidth}px.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const presetColors = ['#ffffff', '#000000', '#f5f5f5', '#1a1a1a', '#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('uploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('borderWidth')}: {borderWidth}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('borderColor')}</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBorderColor(color)}
                  className={`w-8 h-8 rounded border-2 ${borderColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="tool-input flex-1"
              />
            </div>
          </div>

          <button
            onClick={downloadImage}
            disabled={!image}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {image ? (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[500px] object-contain shadow-lg"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-4xl mb-2">🖼️</p>
              <p>{t('noImage')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      {originalImage && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {t('originalSize')}: {originalImage.width}×{originalImage.height} → 
          {t('newSize')}: {originalImage.width + borderWidth * 2}×{originalImage.height + borderWidth * 2}
        </div>
      )}
    </div>
  );
}
