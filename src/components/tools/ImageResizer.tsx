'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function ImageResizer() {
  const t = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setNewWidth(img.width);
        setNewHeight(img.height);
        setImage(event.target?.result as string);
        setResizedImage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w: number) => {
    setNewWidth(w);
    if (lockRatio && originalSize.width > 0) {
      setNewHeight(Math.round((w / originalSize.width) * originalSize.height));
    }
  };

  const handleHeightChange = (h: number) => {
    setNewHeight(h);
    if (lockRatio && originalSize.height > 0) {
      setNewWidth(Math.round((h / originalSize.height) * originalSize.width));
    }
  };

  const resizeImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      setResizedImage(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.download = `resized-${newWidth}x${newHeight}.png`;
    link.href = resizedImage;
    link.click();
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />
      
      {!image ? (
        <label className="block border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="text-gray-300">{t('imageResizer.dropzone')}</div>
        </label>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-300 mb-2">
                {t('imageResizer.original')}: {originalSize.width} × {originalSize.height}
              </div>
              <img src={image} alt="Original" className="max-w-full h-auto rounded-lg border border-gray-700" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">{t('imageResizer.width')}</label>
                  <input
                    type="number"
                    value={newWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-24 bg-gray-900 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">{t('imageResizer.height')}</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-24 bg-gray-900 border border-gray-700 rounded px-3 py-2"
                  />
                </div>
                <label className="flex items-center gap-2 mt-5">
                  <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
                  <span className="text-sm text-gray-300">{t('imageResizer.lockRatio')}</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={resizeImage} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                  {t('imageResizer.resize')}
                </button>
                <button onClick={() => { setImage(null); setResizedImage(null); }} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                  {t('clear')}
                </button>
              </div>
              {resizedImage && (
                <div>
                  <div className="text-sm text-gray-300 mb-2">{t('imageResizer.resized')}: {newWidth} × {newHeight}</div>
                  <img src={resizedImage} alt="Resized" className="max-w-full h-auto rounded-lg border border-gray-700" />
                  <button onClick={downloadImage} className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg">
                    {t('download')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
