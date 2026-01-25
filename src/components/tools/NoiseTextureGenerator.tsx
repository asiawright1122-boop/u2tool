'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function NoiseTextureGenerator() {
  const t = useTranslations('tools.noise-texture-generator');
  const common = useTranslations('tools');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [noiseType, setNoiseType] = useState<'random' | 'perlin' | 'grain'>('random');
  const [intensity, setIntensity] = useState(50);
  const [scale, setScale] = useState(1);
  const [baseColor, setBaseColor] = useState('#1a1a2e');
  const [noiseColor, setNoiseColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);

  const generateNoise = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Fill base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    // Parse noise color
    const nr = parseInt(noiseColor.slice(1, 3), 16);
    const ng = parseInt(noiseColor.slice(3, 5), 16);
    const nb = parseInt(noiseColor.slice(5, 7), 16);

    const alpha = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      let noiseValue = 0;

      if (noiseType === 'random') {
        noiseValue = Math.random();
      } else if (noiseType === 'grain') {
        noiseValue = Math.random() > 0.5 ? 1 : 0;
      } else if (noiseType === 'perlin') {
        const x = (i / 4) % size;
        const y = Math.floor((i / 4) / size);
        noiseValue = (Math.sin(x / scale / 10) + Math.cos(y / scale / 10) + 2) / 4;
        noiseValue += (Math.random() - 0.5) * 0.3;
      }

      // Blend noise with base color
      data[i] = data[i] + (nr - data[i]) * noiseValue * alpha;
      data[i + 1] = data[i + 1] + (ng - data[i + 1]) * noiseValue * alpha;
      data[i + 2] = data[i + 2] + (nb - data[i + 2]) * noiseValue * alpha;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    generateNoise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noiseType, intensity, scale, baseColor, noiseColor, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `noise-${noiseType}-${size}x${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyDataUrl = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    await navigator.clipboard.writeText(dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cssCode = `background-image: url('data:image/png;base64,...');
/* Or use the downloaded PNG file */
background-repeat: repeat;`;

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 dark:border-gray-600 rounded"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('noiseType')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['random', 'perlin', 'grain'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNoiseType(type)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    noiseType === type
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {t(`types.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('intensity')}: {intensity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('scale')}: {scale}x
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('size')}: {size}px
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={64}>64 x 64</option>
              <option value={128}>128 x 128</option>
              <option value={256}>256 x 256</option>
              <option value={512}>512 x 512</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('baseColor')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('noiseColor')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={noiseColor}
                onChange={(e) => setNoiseColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={noiseColor}
                onChange={(e) => setNoiseColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={generateNoise}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('regenerate')}
        </button>
        <button
          onClick={handleCopyDataUrl}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {copied ? common('copied') : t('copyDataUrl')}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {common('download')} PNG
        </button>
      </div>

      {/* CSS Usage */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CSS {t('usage')}
        </label>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
