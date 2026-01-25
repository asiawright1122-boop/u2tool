'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const PRINT_SIZES = [
  { name: '4x6"', width: 4, height: 6 },
  { name: '5x7"', width: 5, height: 7 },
  { name: '8x10"', width: 8, height: 10 },
  { name: '11x14"', width: 11, height: 14 },
  { name: 'A4', width: 8.27, height: 11.69 },
  { name: 'A3', width: 11.69, height: 16.54 },
  { name: 'Letter', width: 8.5, height: 11 },
  { name: 'Legal', width: 8.5, height: 14 },
];

const DPI_PRESETS = [72, 96, 150, 200, 300, 600];

export default function DpiCalculator() {
  const t = useTranslations('tools.dpi-calculator');
  const common = useTranslations('tools');

  const [mode, setMode] = useState<'toDpi' | 'toPixels'>('toDpi');
  
  // Mode 1: Calculate DPI from pixels and print size
  const [pixelWidth, setPixelWidth] = useState('3000');
  const [pixelHeight, setPixelHeight] = useState('2000');
  const [printWidth, setPrintWidth] = useState('10');
  const [printHeight, setPrintHeight] = useState('8');
  
  // Mode 2: Calculate pixels from DPI and print size
  const [targetDpi, setTargetDpi] = useState('300');
  const [targetPrintWidth, setTargetPrintWidth] = useState('10');
  const [targetPrintHeight, setTargetPrintHeight] = useState('8');
  
  const [copied, setCopied] = useState(false);

  const dpiResults = useMemo(() => {
    const pw = parseFloat(pixelWidth) || 0;
    const ph = parseFloat(pixelHeight) || 0;
    const prw = parseFloat(printWidth) || 0;
    const prh = parseFloat(printHeight) || 0;

    if (pw <= 0 || ph <= 0 || prw <= 0 || prh <= 0) {
      return null;
    }

    const dpiW = pw / prw;
    const dpiH = ph / prh;
    const avgDpi = (dpiW + dpiH) / 2;

    let quality = '';
    if (avgDpi >= 300) quality = t('quality.excellent');
    else if (avgDpi >= 200) quality = t('quality.good');
    else if (avgDpi >= 150) quality = t('quality.acceptable');
    else quality = t('quality.low');

    return {
      dpiWidth: dpiW.toFixed(0),
      dpiHeight: dpiH.toFixed(0),
      avgDpi: avgDpi.toFixed(0),
      quality,
    };
  }, [pixelWidth, pixelHeight, printWidth, printHeight, t]);

  const pixelResults = useMemo(() => {
    const dpi = parseFloat(targetDpi) || 0;
    const prw = parseFloat(targetPrintWidth) || 0;
    const prh = parseFloat(targetPrintHeight) || 0;

    if (dpi <= 0 || prw <= 0 || prh <= 0) {
      return null;
    }

    const reqWidth = Math.ceil(dpi * prw);
    const reqHeight = Math.ceil(dpi * prh);
    const megapixels = (reqWidth * reqHeight) / 1000000;

    return {
      requiredWidth: reqWidth.toLocaleString(),
      requiredHeight: reqHeight.toLocaleString(),
      megapixels: megapixels.toFixed(2),
    };
  }, [targetDpi, targetPrintWidth, targetPrintHeight]);

  const handlePrintSizePreset = (preset: typeof PRINT_SIZES[0]) => {
    if (mode === 'toDpi') {
      setPrintWidth(preset.width.toString());
      setPrintHeight(preset.height.toString());
    } else {
      setTargetPrintWidth(preset.width.toString());
      setTargetPrintHeight(preset.height.toString());
    }
  };

  const handleCopy = async () => {
    let text = '';
    if (mode === 'toDpi' && dpiResults) {
      text = `DPI: ${dpiResults.avgDpi} (${dpiResults.dpiWidth} x ${dpiResults.dpiHeight})`;
    } else if (mode === 'toPixels' && pixelResults) {
      text = `Required: ${pixelResults.requiredWidth} x ${pixelResults.requiredHeight} pixels (${pixelResults.megapixels} MP)`;
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('toDpi')}
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            mode === 'toDpi'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          {t('calculateDpi')}
        </button>
        <button
          onClick={() => setMode('toPixels')}
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            mode === 'toPixels'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          {t('calculatePixels')}
        </button>
      </div>

      {mode === 'toDpi' ? (
        <>
          {/* Calculate DPI Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{t('imageResolution')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('width')} (px)
                  </label>
                  <input
                    type="number"
                    value={pixelWidth}
                    onChange={(e) => setPixelWidth(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('height')} (px)
                  </label>
                  <input
                    type="number"
                    value={pixelHeight}
                    onChange={(e) => setPixelHeight(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{t('printSize')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('width')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    value={printWidth}
                    onChange={(e) => setPrintWidth(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('height')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    value={printHeight}
                    onChange={(e) => setPrintHeight(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DPI Results */}
          {dpiResults && (
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t('calculatedDpi')}</h3>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  {copied ? common('copied') : common('copy')}
                </button>
              </div>
              <div className="text-5xl font-bold mb-2">{dpiResults.avgDpi} DPI</div>
              <div className="text-sm opacity-80 mb-2">
                {t('horizontal')}: {dpiResults.dpiWidth} | {t('vertical')}: {dpiResults.dpiHeight}
              </div>
              <div className="text-sm">{dpiResults.quality}</div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Calculate Pixels Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{t('targetDpi')}</h4>
              <input
                type="number"
                value={targetDpi}
                onChange={(e) => setTargetDpi(e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-2">
                {DPI_PRESETS.map((dpi) => (
                  <button
                    key={dpi}
                    onClick={() => setTargetDpi(dpi.toString())}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {dpi} DPI
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">{t('printSize')}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('width')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    value={targetPrintWidth}
                    onChange={(e) => setTargetPrintWidth(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('height')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    value={targetPrintHeight}
                    onChange={(e) => setTargetPrintHeight(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pixel Results */}
          {pixelResults && (
            <div className="p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{t('requiredResolution')}</h3>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  {copied ? common('copied') : common('copy')}
                </button>
              </div>
              <div className="text-3xl font-bold mb-2">
                {pixelResults.requiredWidth} × {pixelResults.requiredHeight}
              </div>
              <div className="text-sm opacity-80">
                {pixelResults.megapixels} {t('megapixels')}
              </div>
            </div>
          )}
        </>
      )}

      {/* Print Size Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('commonPrintSizes')}
        </label>
        <div className="flex flex-wrap gap-2">
          {PRINT_SIZES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePrintSizePreset(preset)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* DPI Guide */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('dpiGuide')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>72 DPI: {t('screen')}</div>
          <div>150 DPI: {t('draft')}</div>
          <div>300 DPI: {t('print')}</div>
          <div>600 DPI: {t('highQuality')}</div>
        </div>
      </div>
    </div>
  );
}
