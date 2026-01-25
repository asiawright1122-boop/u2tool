'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function BlobGenerator() {
  const t = useTranslations('tools.blob-generator');
  const common = useTranslations('tools');

  const [complexity, setComplexity] = useState(6);
  const [contrast, setContrast] = useState(50);
  const [size, setSize] = useState(200);
  const [color, setColor] = useState('#6366f1');
  const [path, setPath] = useState('');
  const [copied, setCopied] = useState(false);

  const generateBlob = useCallback(() => {
    const points: { x: number; y: number }[] = [];
    const angleStep = (Math.PI * 2) / complexity;
    const radius = size / 2;
    const center = size / 2;

    for (let i = 0; i < complexity; i++) {
      const angle = i * angleStep;
      const variance = (contrast / 100) * radius * 0.5;
      const r = radius - variance + Math.random() * variance * 2;
      points.push({
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      });
    }

    // Create smooth bezier curve
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    d += ' Z';
    setPath(d);
  }, [complexity, contrast, size]);

  // Generate initial blob
  useState(() => {
    generateBlob();
  });

  const svgCode = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="${color}" />
</svg>`;

  const cssCode = `clip-path: path('${path}');`;

  const handleCopySvg = async () => {
    await navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blob.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <path d={path} fill={color} />
        </svg>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('complexity')}: {complexity}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={complexity}
              onChange={(e) => setComplexity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('contrast')}: {contrast}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('size')}: {size}px
            </label>
            <input
              type="range"
              min="100"
              max="400"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
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
          onClick={generateBlob}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('generate')}
        </button>
        <button
          onClick={handleCopySvg}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {copied ? common('copied') : t('copySvg')}
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

      {/* CSS Output */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CSS clip-path
        </label>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
