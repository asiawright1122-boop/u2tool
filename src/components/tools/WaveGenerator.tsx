'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function WaveGenerator() {
  const t = useTranslations('tools.wave-generator');
  const common = useTranslations('tools');

  const [height, setHeight] = useState(100);
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(20);
  const [layers, setLayers] = useState(1);
  const [color, setColor] = useState('#6366f1');
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [copied, setCopied] = useState(false);

  const generateWavePath = (layerIndex: number) => {
    const width = 1440;
    const baseY = position === 'bottom' ? height - amplitude : amplitude;
    const layerOffset = layerIndex * 5;
    const layerAmplitude = amplitude - layerIndex * 3;
    
    let d = position === 'bottom' 
      ? `M 0 ${height} L 0 ${baseY + layerOffset}`
      : `M 0 0 L 0 ${baseY - layerOffset}`;

    const points = 100;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = baseY + layerOffset + Math.sin((i / points) * Math.PI * 2 * frequency + layerIndex) * layerAmplitude;
      d += ` L ${x} ${y}`;
    }

    d += position === 'bottom'
      ? ` L ${width} ${height} Z`
      : ` L ${width} 0 Z`;

    return d;
  };

  const svgCode = useMemo(() => {
    const paths = Array.from({ length: layers }, (_, i) => {
      const opacity = 1 - (i * 0.2);
      return `  <path d="${generateWavePath(i)}" fill="${color}" fill-opacity="${opacity}" />`;
    }).join('\n');

    return `<svg viewBox="0 0 1440 ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
${paths}
</svg>`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, frequency, amplitude, layers, color, position]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wave.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" style={{ height: height + 50 }}>
        <div 
          className={`absolute left-0 right-0 ${position === 'bottom' ? 'bottom-0' : 'top-0'}`}
          dangerouslySetInnerHTML={{ __html: svgCode }}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('height')}: {height}px
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('frequency')}: {frequency}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('amplitude')}: {amplitude}px
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('layers')}: {layers}
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={layers}
              onChange={(e) => setLayers(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('position')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setPosition('top')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  position === 'top'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                {t('top')}
              </button>
              <button
                onClick={() => setPosition('bottom')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  position === 'bottom'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                {t('bottom')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('color')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {copied ? common('copied') : common('copy')} SVG
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {common('download')} SVG
        </button>
      </div>

      {/* SVG Output */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SVG {common('output')}
        </label>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono max-h-48">
          {svgCode}
        </pre>
      </div>
    </div>
  );
}
