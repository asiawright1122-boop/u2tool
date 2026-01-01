'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageFlipRotate() {
  const t = useTranslations('tools.image-flip-rotate');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotation, setRotation] = useState(0);
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
        setFlipH(false);
        setFlipV(false);
        setRotation(0);
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

    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    const newWidth = originalImage.width * cos + originalImage.height * sin;
    const newHeight = originalImage.width * sin + originalImage.height * cos;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Move to center
    ctx.translate(newWidth / 2, newHeight / 2);

    // Apply rotation
    ctx.rotate(radians);

    // Apply flip
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Draw image centered
    ctx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);

    ctx.restore();
  }, [originalImage, flipH, flipV, rotation]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `transformed-${rotation}deg.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const rotatePresets = [0, 90, 180, 270];

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
            <label className="block text-sm font-medium mb-2">{t('flip')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFlipH(!flipH)}
                className={`flex-1 px-4 py-2 rounded-lg ${flipH ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                ↔️ {t('horizontal')}
              </button>
              <button
                onClick={() => setFlipV(!flipV)}
                className={`flex-1 px-4 py-2 rounded-lg ${flipV ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                ↕️ {t('vertical')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('rotation')}: {rotation}°</label>
            <div className="flex gap-2 mb-2">
              {rotatePresets.map((deg) => (
                <button
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`flex-1 px-2 py-1 rounded text-sm ${rotation === deg ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {deg}°
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              ↺ -90°
            </button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              ↻ +90°
            </button>
          </div>

          <button
            onClick={() => { setFlipH(false); setFlipV(false); setRotation(0); }}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            {t('reset')}
          </button>

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
              className="max-w-full max-h-[500px] object-contain"
            />
          ) : (
            <div className="text-gray-500 text-center">
              <p className="text-4xl mb-2">🔄</p>
              <p>{t('noImage')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
