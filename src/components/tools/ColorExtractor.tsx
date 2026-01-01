'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
}

export default function ColorExtractor() {
  const t = useTranslations('tools.color-extractor');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [colorCount, setColorCount] = useState(8);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setColors([]);
    };
    reader.readAsDataURL(file);
  };

  const extractColors = () => {
    if (!image) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Scale down for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Count colors
      const colorMap = new Map<string, number>();
      for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 16) * 16;
        const g = Math.round(pixels[i + 1] / 16) * 16;
        const b = Math.round(pixels[i + 2] / 16) * 16;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount);

      const totalPixels = pixels.length / 4;
      const extractedColors: ExtractedColor[] = sortedColors.map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number);
        const hex = '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
        return {
          hex,
          rgb: [r, g, b] as [number, number, number],
          percentage: Math.round((count / totalPixels) * 100),
        };
      });

      setColors(extractedColors);
      setIsProcessing(false);
    };
    img.src = image;
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const downloadPalette = () => {
    if (colors.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const swatchSize = 100;
    const padding = 10;
    canvas.width = colors.length * (swatchSize + padding) + padding;
    canvas.height = swatchSize + padding * 2 + 30;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw swatches
    colors.forEach((color, index) => {
      const x = padding + index * (swatchSize + padding);
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, padding, swatchSize, swatchSize);

      // Draw hex code
      ctx.fillStyle = '#000000';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(color.hex, x + swatchSize / 2, swatchSize + padding + 20);
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'color-palette.png';
    link.click();
  };

  const clearAll = () => {
    setImage(null);
    setColors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Settings */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">{t('colorCount')}:</label>
          <input
            type="range"
            min="5"
            max="10"
            value={colorCount}
            onChange={(e) => setColorCount(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm font-mono w-8">{colorCount}</span>
        </div>
        <button onClick={clearAll} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Upload */}
      {!image ? (
        <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="text-4xl mb-2">🎨</div>
          <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <h3 className="font-medium">{t('image')}</h3>
            <img
              src={image}
              alt="Source"
              className="max-w-full max-h-80 rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <button
              onClick={extractColors}
              disabled={isProcessing}
              className="btn-primary w-full"
            >
              {isProcessing ? t('processing') : t('extractColors')}
            </button>
          </div>

          {/* Color Palette */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{t('palette')}</h3>
              {colors.length > 0 && (
                <button
                  onClick={downloadPalette}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t('downloadPalette')}
                </button>
              )}
            </div>

            {colors.length > 0 ? (
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => copyColor(color.hex)}
                  >
                    <div
                      className="w-12 h-12 rounded-lg shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <p className="font-mono text-sm">{color.hex}</p>
                      <p className="text-xs text-gray-500">
                        RGB({color.rgb.join(', ')}) · {color.percentage}%
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {copiedColor === color.hex ? '✓ ' + tg('copied') : t('clickToCopy')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-500">{t('noColors')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
