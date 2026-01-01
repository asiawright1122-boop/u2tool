'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageRounder() {
  const t = useTranslations('tools.image-rounder');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [radius, setRadius] = useState(20);
  const [circleMode, setCircleMode] = useState(false);
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

    let width = originalImage.width;
    let height = originalImage.height;

    if (circleMode) {
      const size = Math.min(width, height);
      canvas.width = size;
      canvas.height = size;
      width = size;
      height = size;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create rounded rectangle or circle path
    ctx.beginPath();
    if (circleMode) {
      ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    } else {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.quadraticCurveTo(width, 0, width, r);
      ctx.lineTo(width, height - r);
      ctx.quadraticCurveTo(width, height, width - r, height);
      ctx.lineTo(r, height);
      ctx.quadraticCurveTo(0, height, 0, height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
    }
    ctx.closePath();
    ctx.clip();

    // Draw image
    if (circleMode) {
      const size = Math.min(originalImage.width, originalImage.height);
      const sx = (originalImage.width - size) / 2;
      const sy = (originalImage.height - size) / 2;
      ctx.drawImage(originalImage, sx, sy, size, size, 0, 0, width, height);
    } else {
      ctx.drawImage(originalImage, 0, 0);
    }
  }, [originalImage, radius, circleMode]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = circleMode ? 'circle-image.png' : `rounded-${radius}px.png`;
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={circleMode}
                onChange={(e) => setCircleMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">{t('circleMode')}</span>
            </label>
          </div>

          {!circleMode && (
            <div>
              <label className="block text-sm font-medium mb-2">{t('radius')}: {radius}px</label>
              <input
                type="range"
                min="0"
                max="200"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <button
            onClick={downloadImage}
            disabled={!image}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')} PNG
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] rounded-lg min-h-[400px]">
          {image ? (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[500px] object-contain"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-4xl mb-2">⭕</p>
              <p>{t('noImage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
