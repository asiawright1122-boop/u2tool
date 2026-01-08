'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { calculateAspectRatio, calculateDimensionFromRatio, AspectRatioResult } from '@/lib/calculator-utils';

const presetRatios = [
  { name: '16:9', width: 16, height: 9 },
  { name: '4:3', width: 4, height: 3 },
  { name: '21:9', width: 21, height: 9 },
  { name: '1:1', width: 1, height: 1 },
  { name: '9:16', width: 9, height: 16 },
  { name: '3:2', width: 3, height: 2 },
  { name: '2:1', width: 2, height: 1 },
  { name: '5:4', width: 5, height: 4 },
];

export default function AspectRatioCalculatorEnhanced() {
  const t = useTranslations('tools.aspect-ratio-calculator-enhanced');

  const [width, setWidth] = useState<string>('1920');
  const [height, setHeight] = useState<string>('1080');
  const [lockedRatio, setLockedRatio] = useState<{ width: number; height: number } | null>(null);
  const [result, setResult] = useState<AspectRatioResult | null>(null);

  useEffect(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      setResult(calculateAspectRatio(w, h));
    }
  }, [width, height]);

  const handleWidthChange = (value: string) => {
    setWidth(value);
    if (lockedRatio) {
      const w = parseFloat(value);
      if (!isNaN(w) && w > 0) {
        const newHeight = calculateDimensionFromRatio(w, true, lockedRatio.width, lockedRatio.height);
        setHeight(Math.round(newHeight).toString());
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    if (lockedRatio) {
      const h = parseFloat(value);
      if (!isNaN(h) && h > 0) {
        const newWidth = calculateDimensionFromRatio(h, false, lockedRatio.width, lockedRatio.height);
        setWidth(Math.round(newWidth).toString());
      }
    }
  };

  const applyPreset = (preset: { width: number; height: number }) => {
    setLockedRatio(preset);
    const w = parseFloat(width);
    if (!isNaN(w) && w > 0) {
      const newHeight = calculateDimensionFromRatio(w, true, preset.width, preset.height);
      setHeight(Math.round(newHeight).toString());
    }
  };

  const lockCurrentRatio = () => {
    if (result) {
      setLockedRatio({ width: result.ratioWidth, height: result.ratioHeight });
    }
  };

  const unlockRatio = () => {
    setLockedRatio(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {presetRatios.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              lockedRatio?.width === preset.width && lockedRatio?.height === preset.height
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('width')}
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="1920"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('height')}
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="1080"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {lockedRatio ? (
          <button
            onClick={unlockRatio}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            🔓 {t('unlockRatio')}
          </button>
        ) : (
          <button
            onClick={lockCurrentRatio}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            🔒 {t('lockRatio')}
          </button>
        )}
      </div>

      {lockedRatio && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          {t('ratioLocked')}: {lockedRatio.width}:{lockedRatio.height}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-center">
            <div className="text-sm opacity-80">{t('aspectRatio')}</div>
            <div className="text-4xl font-bold">
              {result.ratioWidth}:{result.ratioHeight}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('decimal')}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.decimal.toFixed(4)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('percentage')}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.percentage}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('preview')}</div>
            <div className="flex justify-center">
              <div
                className="bg-blue-500 rounded"
                style={{
                  width: '200px',
                  height: `${200 / result.decimal}px`,
                  maxHeight: '200px',
                }}
              />
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              {width} × {height}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('commonResolutions')}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { name: 'HD', w: 1280, h: 720 },
                { name: 'Full HD', w: 1920, h: 1080 },
                { name: '2K', w: 2560, h: 1440 },
                { name: '4K', w: 3840, h: 2160 },
              ].map((res) => {
                const resRatio = calculateAspectRatio(res.w, res.h);
                const matches = resRatio.ratioWidth === result.ratioWidth && resRatio.ratioHeight === result.ratioHeight;
                return (
                  <div
                    key={res.name}
                    className={`p-2 rounded ${matches ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                  >
                    <span className="font-medium">{res.name}</span>
                    <span className="text-gray-500 ml-2">{res.w}×{res.h}</span>
                    {matches && <span className="ml-2">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
