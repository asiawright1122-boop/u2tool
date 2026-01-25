'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const COMMON_RESOLUTIONS = [
  { name: 'HD (720p)', width: 1280, height: 720 },
  { name: 'Full HD (1080p)', width: 1920, height: 1080 },
  { name: '2K (QHD)', width: 2560, height: 1440 },
  { name: '4K (UHD)', width: 3840, height: 2160 },
  { name: '5K', width: 5120, height: 2880 },
  { name: '8K', width: 7680, height: 4320 },
  { name: 'iPhone 15 Pro', width: 2556, height: 1179 },
  { name: 'iPad Pro 12.9"', width: 2732, height: 2048 },
];

export default function PixelDensityCalculator() {
  const t = useTranslations('tools.pixel-density-calculator');
  const common = useTranslations('tools');

  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [diagonal, setDiagonal] = useState('24');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const d = parseFloat(diagonal) || 0;

    if (w <= 0 || h <= 0 || d <= 0) {
      return null;
    }

    // Calculate diagonal in pixels
    const diagonalPixels = Math.sqrt(w * w + h * h);
    
    // Calculate PPI
    const ppi = diagonalPixels / d;
    
    // Calculate pixel pitch (distance between pixels in mm)
    const pixelPitch = 25.4 / ppi;
    
    // Calculate physical dimensions
    const aspectRatio = w / h;
    const physicalHeight = d / Math.sqrt(1 + aspectRatio * aspectRatio);
    const physicalWidth = physicalHeight * aspectRatio;
    
    // Calculate total pixels
    const totalPixels = w * h;
    const megapixels = totalPixels / 1000000;

    // Determine quality rating
    let quality = '';
    if (ppi >= 300) quality = t('quality.excellent');
    else if (ppi >= 200) quality = t('quality.good');
    else if (ppi >= 100) quality = t('quality.average');
    else quality = t('quality.low');

    return {
      ppi: ppi.toFixed(2),
      pixelPitch: pixelPitch.toFixed(4),
      physicalWidth: physicalWidth.toFixed(2),
      physicalHeight: physicalHeight.toFixed(2),
      totalPixels: totalPixels.toLocaleString(),
      megapixels: megapixels.toFixed(2),
      aspectRatio: `${Math.round(w / gcd(w, h))}:${Math.round(h / gcd(w, h))}`,
      quality,
    };
  }, [width, height, diagonal, t]);

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  const handlePreset = (preset: typeof COMMON_RESOLUTIONS[0]) => {
    setWidth(preset.width.toString());
    setHeight(preset.height.toString());
  };

  const handleCopy = async () => {
    if (!results) return;
    const text = `PPI: ${results.ppi}, Pixel Pitch: ${results.pixelPitch}mm, Resolution: ${width}x${height}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('width')} (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('height')} (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('diagonal')} ({t('inches')})
          </label>
          <input
            type="number"
            value={diagonal}
            onChange={(e) => setDiagonal(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Preset Resolutions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('commonResolutions')}
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_RESOLUTIONS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePreset(preset)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('results')}
            </h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? common('copied') : common('copy')}
            </button>
          </div>

          {/* Main Result */}
          <div className="p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white text-center">
            <div className="text-5xl font-bold mb-2">{results.ppi}</div>
            <div className="text-lg opacity-90">PPI ({t('pixelsPerInch')})</div>
            <div className="mt-2 text-sm opacity-80">{results.quality}</div>
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.pixelPitch}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('pixelPitch')} (mm)
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.aspectRatio}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('aspectRatio')}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.megapixels}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('megapixels')}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.physicalWidth}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('physicalWidth')} ({t('inches')})
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.physicalHeight}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('physicalHeight')} ({t('inches')})
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.totalPixels}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t('totalPixels')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PPI Reference */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('ppiReference')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>Print: 300+ PPI</div>
          <div>Retina: 220+ PPI</div>
          <div>Desktop: 90-120 PPI</div>
          <div>Mobile: 300-500 PPI</div>
        </div>
      </div>
    </div>
  );
}
