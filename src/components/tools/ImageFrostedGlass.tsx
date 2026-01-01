'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageFrostedGlass() {
  const t = useTranslations('tools.image-frosted-glass');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [blurIntensity, setBlurIntensity] = useState(10);
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

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply blur filter
    ctx.filter = `blur(${blurIntensity}px)`;
    ctx.drawImage(originalImage, 0, 0);
  }, [originalImage, blurIntensity]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `frosted-glass-${blurIntensity}px.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const presets = [
    { label: t('light'), value: 5 },
    { label: t('medium'), value: 15 },
    { label: t('heavy'), value: 30 },
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

          <div>
            <label className="block text-sm font-medium mb-2">{t('presets')}</label>
            <div className="flex gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setBlurIntensity(preset.value)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    blurIntensity === preset.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('blurIntensity')}: {blurIntensity}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={blurIntensity}
              onChange={(e) => setBlurIntensity(Number(e.target.value))}
              className="w-full"
            />
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
              className="max-w-full max-h-[500px] object-contain rounded-lg"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-4xl mb-2">🌫️</p>
              <p>{t('noImage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
