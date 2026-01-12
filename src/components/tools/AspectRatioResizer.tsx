'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface AspectRatio {
  name: string;
  width: number;
  height: number;
}

const presetRatios: AspectRatio[] = [
  { name: '1:1 (Square)', width: 1, height: 1 },
  { name: '4:3 (Standard)', width: 4, height: 3 },
  { name: '16:9 (Widescreen)', width: 16, height: 9 },
  { name: '21:9 (Ultrawide)', width: 21, height: 9 },
  { name: '3:2 (Photo)', width: 3, height: 2 },
  { name: '2:3 (Portrait)', width: 2, height: 3 },
  { name: '9:16 (Mobile)', width: 9, height: 16 },
  { name: '4:5 (Instagram)', width: 4, height: 5 },
];

const socialMediaSizes = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'Twitter Header', width: 1500, height: 500 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'LinkedIn Banner', width: 1584, height: 396 },
];

export default function AspectRatioResizer() {
  const t = useTranslations('tools.aspect-ratio-resizer');
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState(1920);
  const [targetHeight, setTargetHeight] = useState(1080);
  const [lockRatio, setLockRatio] = useState(true);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalSize({ width: img.width, height: img.height });
          setTargetWidth(img.width);
          setTargetHeight(img.height);
          imageRef.current = img;
        };
        img.src = event.target?.result as string;
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setTargetWidth(newWidth);
    if (lockRatio && originalSize.width > 0) {
      const ratio = originalSize.height / originalSize.width;
      setTargetHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setTargetHeight(newHeight);
    if (lockRatio && originalSize.height > 0) {
      const ratio = originalSize.width / originalSize.height;
      setTargetWidth(Math.round(newHeight * ratio));
    }
  };

  const applyRatio = (ratio: AspectRatio) => {
    setSelectedRatio(ratio);
    setLockRatio(false);
    const newHeight = Math.round(targetWidth * (ratio.height / ratio.width));
    setTargetHeight(newHeight);
  };

  const applySocialSize = (size: { width: number; height: number }) => {
    setLockRatio(false);
    setTargetWidth(size.width);
    setTargetHeight(size.height);
  };

  const downloadImage = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const img = imageRef.current;
    const imgRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > targetRatio) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgRatio;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    const link = document.createElement('a');
    link.download = `resized-${targetWidth}x${targetHeight}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('uploadImage')}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {image && (
        <>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('originalSize')}</div>
            <div className="text-lg font-mono text-gray-900 dark:text-white">
              {originalSize.width} × {originalSize.height} px
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('width')} (px)
              </label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('height')} (px)
              </label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="lockRatio"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="lockRatio" className="text-sm text-gray-700 dark:text-gray-300">
              🔒 {t('lockAspectRatio')}
            </label>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('presetRatios')}</h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {presetRatios.map((ratio) => (
                <button
                  key={ratio.name}
                  onClick={() => applyRatio(ratio)}
                  className={`p-2 text-xs rounded-lg border transition-colors ${
                    selectedRatio?.name === ratio.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {ratio.width}:{ratio.height}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('socialMediaSizes')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {socialMediaSizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => applySocialSize(size)}
                  className="p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{size.name}</div>
                  <div className="text-xs text-gray-500">{size.width} × {size.height}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('outputSize')}</div>
                <div className="text-xl font-mono text-gray-900 dark:text-white">
                  {targetWidth} × {targetHeight} px
                </div>
              </div>
              <button
                onClick={downloadImage}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t('download')}
              </button>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800">{t('preview')}</div>
            <div className="p-4 flex justify-center bg-gray-100 dark:bg-gray-900">
              <div
                className="relative bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                style={{
                  width: Math.min(targetWidth, 400),
                  height: Math.min(targetHeight, 300),
                  aspectRatio: `${targetWidth}/${targetHeight}`,
                }}
              >
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
