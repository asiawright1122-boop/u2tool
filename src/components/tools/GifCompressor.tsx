'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function GifCompressor() {
  const t = useTranslations('tools.gif-compressor');
  const tg = useTranslations('tools');
  const [originalGif, setOriginalGif] = useState<string | null>(null);
  const [compressedGif, setCompressedGif] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(50);
  const [colorReduction, setColorReduction] = useState(false);
  const [maxColors, setMaxColors] = useState(128);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('gif')) return;

    setOriginalSize(file.size);
    setOriginalGif(URL.createObjectURL(file));
    setCompressedGif(null);
    setCompressedSize(0);
  };

  const compressGif = async () => {
    if (!originalGif) return;
    setIsProcessing(true);

    try {
      // Fetch the original GIF
      const response = await fetch(originalGif);
      const blob = await response.blob();

      // For now, we'll use a simple approach - re-encode with reduced quality
      // In production, you'd use a proper GIF compression library
      const { parseGIF, decompressFrames } = await import('gifuct-js');
      const GIF = (await import('gif.js')).default;

      const arrayBuffer = await blob.arrayBuffer();
      const gif = parseGIF(arrayBuffer);
      const frames = decompressFrames(gif, true);

      if (frames.length === 0) {
        throw new Error('No frames found');
      }

      // Calculate new dimensions based on compression level
      const scale = compressionLevel / 100;
      const newWidth = Math.max(Math.floor(frames[0].dims.width * scale), 10);
      const newHeight = Math.max(Math.floor(frames[0].dims.height * scale), 10);

      const encoder = new GIF({
        workers: 2,
        quality: colorReduction ? Math.floor(maxColors / 10) : 10,
        width: newWidth,
        height: newHeight,
        workerScript: '/gif.worker.js',
      });

      for (const frame of frames) {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Create temp canvas with original frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        const imageData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        tempCtx.putImageData(imageData, 0, 0);

        // Scale down
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        encoder.addFrame(canvas, { delay: frame.delay, copy: true });
      }

      encoder.on('finished', (blob: Blob) => {
        setCompressedGif(URL.createObjectURL(blob));
        setCompressedSize(blob.size);
        setIsProcessing(false);
      });

      encoder.render();
    } catch (error) {
      console.error('Compression error:', error);
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedGif) return;
    const link = document.createElement('a');
    link.href = compressedGif;
    link.download = 'compressed.gif';
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSavingsPercent = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round((1 - compressedSize / originalSize) * 100);
  };

  const clearAll = () => {
    setOriginalGif(null);
    setCompressedGif(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('compressionLevel')}: {compressionLevel}%
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-gray-500">{t('compressionHint')}</p>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={colorReduction}
              onChange={(e) => setColorReduction(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">{t('reduceColors')}</span>
          </label>
          {colorReduction && (
            <div>
              <label className="text-sm">{t('maxColors')}: {maxColors}</label>
              <input
                type="range"
                min="16"
                max="256"
                step="16"
                value={maxColors}
                onChange={(e) => setMaxColors(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="flex items-end">
          <button onClick={clearAll} className="btn-secondary w-full">
            {tg('clear')}
          </button>
        </div>
      </div>

      {/* Upload */}
      {!originalGif ? (
        <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/gif"
            onChange={handleGifUpload}
            className="hidden"
          />
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
      ) : (
        <div className="space-y-6">
          {/* Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{t('original')}</label>
                <span className="text-sm text-gray-600 dark:text-gray-400">{formatSize(originalSize)}</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <img src={originalGif} alt="Original GIF" className="max-w-full max-h-64 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{t('compressed')}</label>
                {compressedSize > 0 && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {formatSize(compressedSize)} ({t('saved')} {getSavingsPercent()}%)
                  </span>
                )}
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                {compressedGif ? (
                  <img src={compressedGif} alt="Compressed GIF" className="max-w-full max-h-64 object-contain" />
                ) : (
                  <p className="text-gray-500">{t('compressFirst')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={compressGif}
              disabled={isProcessing}
              className="btn-primary px-8"
            >
              {isProcessing ? t('processing') : t('compress')}
            </button>
            {compressedGif && (
              <button onClick={downloadCompressed} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                {tg('download')}
              </button>
            )}
          </div>

          {/* Stats */}
          {compressedSize > 0 && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatSize(originalSize)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('originalSize')}</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatSize(compressedSize)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('compressedSize')}</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{getSavingsPercent()}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('reduction')}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
