'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface AdjustmentParams {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

const defaultParams: AdjustmentParams = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
};

export default function ImageAdjustment() {
  const t = useTranslations('tools.image-adjustment');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [params, setParams] = useState<AdjustmentParams>(defaultParams);
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
        setParams(defaultParams);
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

    // Apply CSS filters
    ctx.filter = `
      brightness(${params.brightness}%)
      contrast(${params.contrast}%)
      saturate(${params.saturation}%)
      hue-rotate(${params.hue}deg)
      blur(${params.blur}px)
      grayscale(${params.grayscale}%)
      sepia(${params.sepia}%)
    `;

    ctx.drawImage(originalImage, 0, 0);
  }, [originalImage, params]);

  const updateParam = (key: keyof AdjustmentParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const resetParams = () => {
    setParams(defaultParams);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'adjusted-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const sliders = [
    { key: 'brightness' as const, label: t('brightness'), min: 0, max: 200, unit: '%' },
    { key: 'contrast' as const, label: t('contrast'), min: 0, max: 200, unit: '%' },
    { key: 'saturation' as const, label: t('saturation'), min: 0, max: 200, unit: '%' },
    { key: 'hue' as const, label: t('hue'), min: 0, max: 360, unit: '°' },
    { key: 'blur' as const, label: t('blur'), min: 0, max: 20, unit: 'px' },
    { key: 'grayscale' as const, label: t('grayscale'), min: 0, max: 100, unit: '%' },
    { key: 'sepia' as const, label: t('sepia'), min: 0, max: 100, unit: '%' },
  ];

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

          {sliders.map((slider) => (
            <div key={slider.key}>
              <label className="block text-sm font-medium mb-1">
                {slider.label}: {params[slider.key]}{slider.unit}
              </label>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={params[slider.key]}
                onChange={(e) => updateParam(slider.key, Number(e.target.value))}
                className="w-full"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <button
              onClick={resetParams}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              {t('reset')}
            </button>
            <button
              onClick={downloadImage}
              disabled={!image}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
            >
              {tg('download')}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {image ? (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[500px] object-contain"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-4xl mb-2">🎨</p>
              <p>{t('noImage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
