'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface FrameImage {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
}

export default function GifMaker() {
  const t = useTranslations('tools.gif-maker');
  const tg = useTranslations('tools');
  const [frames, setFrames] = useState<FrameImage[]>([]);
  const [delay, setDelay] = useState(500);
  const [loop, setLoop] = useState(true);
  const [quality, setQuality] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [previewFrame, setPreviewFrame] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newFrame: FrameImage = {
            id: Math.random().toString(36).substr(2, 9),
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
          };
          setFrames((prev) => [...prev, newFrame]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeFrame = (id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
    setResult(null);
  };

  const moveFrame = (index: number, direction: 'up' | 'down') => {
    const newFrames = [...frames];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= frames.length) return;
    [newFrames[index], newFrames[newIndex]] = [newFrames[newIndex], newFrames[index]];
    setFrames(newFrames);
    setResult(null);
  };

  const createGif = async () => {
    if (frames.length < 2) return;
    setIsProcessing(true);

    try {
      // Dynamic import gif.js
      const GIF = (await import('gif.js')).default;

      // Find max dimensions
      const maxWidth = Math.max(...frames.map((f) => f.width));
      const maxHeight = Math.max(...frames.map((f) => f.height));

      const gif = new GIF({
        workers: 2,
        quality,
        width: maxWidth,
        height: maxHeight,
        workerScript: '/gif.worker.js',
      });

      // Add frames
      for (const frame of frames) {
        const img = new Image();
        img.src = frame.dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, maxWidth, maxHeight);
          const x = (maxWidth - img.width) / 2;
          const y = (maxHeight - img.height) / 2;
          ctx.drawImage(img, x, y);
          gif.addFrame(canvas, { delay, copy: true });
        }
      }

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setResult(url);
        setIsProcessing(false);
      });

      gif.render();
    } catch (error) {
      console.error('GIF creation error:', error);
      setIsProcessing(false);
      // Fallback: create simple animated preview
      setResult(frames[0]?.dataUrl || null);
    }
  };

  const downloadGif = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `animation-${frames.length}frames.gif`;
    link.click();
  };

  // Preview animation
  useState(() => {
    if (frames.length === 0) return;
    const interval = setInterval(() => {
      setPreviewFrame((prev) => (prev + 1) % frames.length);
    }, delay);
    return () => clearInterval(interval);
  });

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('frameDelay')}: {delay}ms</label>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('quality')}: {quality}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500">{t('qualityHint')}</p>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={loop}
              onChange={(e) => setLoop(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">{t('loopForever')}</span>
          </label>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <div className="text-4xl mb-2">🎬</div>
        <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
      </div>

      {/* Frame List */}
      {frames.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">{t('frames')} ({frames.length})</h3>
          <div className="flex flex-wrap gap-2">
            {frames.map((frame, index) => (
              <div
                key={frame.id}
                className={`relative group w-20 h-20 ${
                  index === previewFrame ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{ aspectRatio: '1/1' }}
              >
                <img
                  src={frame.dataUrl}
                  alt={`Frame ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded border border-gray-200 dark:border-gray-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                  <button
                    onClick={() => moveFrame(index, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-white rounded text-xs disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="p-1 bg-red-500 text-white rounded text-xs"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => moveFrame(index, 'down')}
                    disabled={index === frames.length - 1}
                    className="p-1 bg-white rounded text-xs disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
                <span className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-tr">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {frames.length >= 2 && (
        <div className="flex gap-4">
          <button
            onClick={createGif}
            disabled={isProcessing}
            className="btn-primary px-8"
          >
            {isProcessing ? t('processing') : t('createGif')}
          </button>
          {result && (
            <button onClick={downloadGif} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {tg('download')}
            </button>
          )}
          <button
            onClick={() => { setFrames([]); setResult(null); }}
            className="btn-secondary"
          >
            {tg('clear')}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <h3 className="font-medium">{t('result')}</h3>
          <div 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-center"
            style={{ minHeight: '200px' }}
          >
            <img 
              src={result} 
              alt="GIF Result" 
              className="max-w-full max-h-96 rounded"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
