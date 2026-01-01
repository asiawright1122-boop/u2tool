'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';

interface GifFrame {
  dataUrl: string;
  delay: number;
  index: number;
}

export default function GifSplitter() {
  const t = useTranslations('tools.gif-splitter');
  const tg = useTranslations('tools');
  const [gif, setGif] = useState<string | null>(null);
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGifUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('gif')) return;

    setIsProcessing(true);
    setGif(URL.createObjectURL(file));

    try {
      // Use gifuct-js to parse GIF
      const { parseGIF, decompressFrames } = await import('gifuct-js');
      const arrayBuffer = await file.arrayBuffer();
      const gif = parseGIF(arrayBuffer);
      const gifFrames = decompressFrames(gif, true);

      const extractedFrames: GifFrame[] = [];

      for (let i = 0; i < gifFrames.length; i++) {
        const frame = gifFrames[i];
        const canvas = document.createElement('canvas');
        canvas.width = frame.dims.width;
        canvas.height = frame.dims.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        ctx.putImageData(imageData, 0, 0);

        extractedFrames.push({
          dataUrl: canvas.toDataURL('image/png'),
          delay: frame.delay,
          index: i,
        });
      }

      setFrames(extractedFrames);
      setSelectedFrames(extractedFrames.map((_, i) => i));
    } catch (error) {
      console.error('GIF parsing error:', error);
      // Fallback: just show the GIF
      setFrames([]);
    }

    setIsProcessing(false);
  };

  const toggleFrame = (index: number) => {
    setSelectedFrames((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b)
    );
  };

  const selectAll = () => {
    setSelectedFrames(frames.map((_, i) => i));
  };

  const deselectAll = () => {
    setSelectedFrames([]);
  };

  const downloadSingle = (frame: GifFrame) => {
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = `frame-${frame.index + 1}.png`;
    link.click();
  };

  const downloadSelected = async () => {
    if (selectedFrames.length === 0) return;

    const zip = new JSZip();
    selectedFrames.forEach((index) => {
      const frame = frames[index];
      const base64Data = frame.dataUrl.split(',')[1];
      zip.file(`frame-${index + 1}.png`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gif-frames-${selectedFrames.length}.zip`;
    link.click();
  };

  const clearAll = () => {
    setGif(null);
    setFrames([]);
    setSelectedFrames([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!gif ? (
        <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/gif"
            onChange={handleGifUpload}
            className="hidden"
          />
          <div className="text-4xl mb-2">📽️</div>
          <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
      ) : (
        <div className="space-y-6">
          {/* Original GIF */}
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">{t('originalGif')}</h3>
              <img src={gif} alt="Original GIF" className="max-w-xs rounded border border-gray-200 dark:border-gray-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('totalFrames')}: {frames.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('selectedFrames')}: {selectedFrames.length}
              </p>
            </div>
          </div>

          {/* Frame Selection */}
          {frames.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t('frames')}</h3>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-sm text-blue-600 hover:underline">
                    {t('selectAll')}
                  </button>
                  <button onClick={deselectAll} className="text-sm text-blue-600 hover:underline">
                    {t('deselectAll')}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {frames.map((frame) => (
                  <div
                    key={frame.index}
                    onClick={() => toggleFrame(frame.index)}
                    className={`relative cursor-pointer rounded overflow-hidden ${
                      selectedFrames.includes(frame.index)
                        ? 'ring-2 ring-blue-500'
                        : 'opacity-50'
                    }`}
                  >
                    <img
                      src={frame.dataUrl}
                      alt={`Frame ${frame.index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                    <span className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1">
                      {frame.index + 1}
                    </span>
                    {selectedFrames.includes(frame.index) && (
                      <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={downloadSelected}
              disabled={selectedFrames.length === 0}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
            >
              {t('downloadSelected')} ({selectedFrames.length})
            </button>
            <button onClick={clearAll} className="btn-secondary">
              {tg('clear')}
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <div className="animate-spin text-4xl mb-2">⏳</div>
          <p className="text-gray-600 dark:text-gray-300">{t('processing')}</p>
        </div>
      )}
    </div>
  );
}
