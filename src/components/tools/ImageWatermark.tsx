'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageWatermark() {
  const t = useTranslations('tools.image-watermark');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('© My Watermark');
  const [fontSize, setFontSize] = useState(24);
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile'>('bottom-right');
  const [color, setColor] = useState('#ffffff');
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  const positions = [
    { value: 'center', labelKey: 'posCenter' },
    { value: 'top-left', labelKey: 'posTopLeft' },
    { value: 'top-right', labelKey: 'posTopRight' },
    { value: 'bottom-left', labelKey: 'posBottomLeft' },
    { value: 'bottom-right', labelKey: 'posBottomRight' },
    { value: 'tile', labelKey: 'posTile' },
  ];

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

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Set watermark style
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;

    const textMetrics = ctx.measureText(watermarkText);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    if (position === 'tile') {
      // Tile watermark
      ctx.save();
      const spacing = Math.max(textWidth, textHeight) * 2;
      for (let y = 0; y < canvas.height + spacing; y += spacing) {
        for (let x = 0; x < canvas.width + spacing; x += spacing) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();
    } else {
      // Single watermark
      let x = 0;
      let y = 0;
      const padding = 20;

      switch (position) {
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = (canvas.height + textHeight) / 2;
          break;
        case 'top-left':
          x = padding;
          y = textHeight + padding;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = textHeight + padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'bottom-right':
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
      }

      ctx.save();
      ctx.translate(x + textWidth / 2, y - textHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(watermarkText, -textWidth / 2, textHeight / 2);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  }, [originalImage, watermarkText, fontSize, opacity, position, color, rotation]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

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
            <label className="block text-sm font-medium mb-2">{t('watermarkText')}</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="tool-input"
              placeholder={t('textPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('position')}</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as typeof position)}
              className="tool-input"
            >
              {positions.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {t(pos.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('fontSize')}: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('opacity')}: {opacity}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('rotation')}: {rotation}°</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('color')}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="tool-input flex-1"
              />
            </div>
          </div>

          <button
            onClick={downloadImage}
            disabled={!image}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {image ? (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[500px] object-contain border border-gray-300 dark:border-gray-600 rounded"
            />
          ) : (
            <div className="text-gray-500 dark:text-gray-300 text-center">
              <p className="text-4xl mb-2">🖼️</p>
              <p>{t('noImage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
