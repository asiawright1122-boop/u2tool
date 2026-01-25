'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ColorPoint {
  x: number;
  y: number;
  color: string;
}

export default function MeshGradientGenerator() {
  const t = useTranslations('tools.mesh-gradient-generator');
  const common = useTranslations('tools');

  const [points, setPoints] = useState<ColorPoint[]>([
    { x: 0, y: 0, color: '#ff6b6b' },
    { x: 100, y: 0, color: '#4ecdc4' },
    { x: 0, y: 100, color: '#45b7d1' },
    { x: 100, y: 100, color: '#96ceb4' },
  ]);
  const [blur, setBlur] = useState(40);
  const [copied, setCopied] = useState(false);

  const updatePoint = (index: number, field: keyof ColorPoint, value: string | number) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
  };

  const randomize = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
    setPoints(points.map(p => ({
      ...p,
      color: colors[Math.floor(Math.random() * colors.length)],
    })));
  };

  const cssCode = useMemo(() => {
    const gradients = points.map((p, i) => {
      return `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${blur}%)`;
    }).join(',\n    ');

    return `background: 
    ${gradients};
background-color: ${points[0]?.color || '#ffffff'};`;
  }, [points, blur]);

  const previewStyle = useMemo(() => {
    const gradients = points.map((p) => {
      return `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${blur}%)`;
    }).join(', ');

    return {
      background: gradients,
      backgroundColor: points[0]?.color || '#ffffff',
    };
  }, [points, blur]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div 
        className="h-64 rounded-lg"
        style={previewStyle}
      />

      {/* Color Points */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('colorPoints')}
          </label>
          <button
            onClick={randomize}
            className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            {t('randomize')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {points.map((point, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={point.color}
                  onChange={(e) => updatePoint(index, 'color', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('point')} {index + 1}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">X: {point.x}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={point.x}
                    onChange={(e) => updatePoint(index, 'x', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y: {point.y}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={point.y}
                    onChange={(e) => updatePoint(index, 'y', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blur Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('blur')}: {blur}%
        </label>
        <input
          type="range"
          min="20"
          max="80"
          value={blur}
          onChange={(e) => setBlur(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS {common('output')}
          </label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
