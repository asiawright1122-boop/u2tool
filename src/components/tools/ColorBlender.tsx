'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export default function ColorBlender() {
  const t = useTranslations('tools.colorBlend');
  const tg = useTranslations('tools');
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ef4444');
  const [steps, setSteps] = useState(5);

  const blendedColors = useMemo(() => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return [];
    
    const colors: string[] = [];
    for (let i = 0; i <= steps + 1; i++) {
      const ratio = i / (steps + 1);
      const r = rgb1.r + (rgb2.r - rgb1.r) * ratio;
      const g = rgb1.g + (rgb2.g - rgb1.g) * ratio;
      const b = rgb1.b + (rgb2.b - rgb1.b) * ratio;
      colors.push(rgbToHex(r, g, b));
    }
    
    return colors;
  }, [color1, color2, steps]);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(blendedColors.join('\n'));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('color1')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('color2')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('steps')}</label>
          <input
            type="number"
            value={steps}
            min={1}
            max={20}
            onChange={(e) => setSteps(Math.min(20, Math.max(1, Number(e.target.value))))}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={copyAll}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        {tg('copy')} {tg('all')}
      </button>

      <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div className="flex h-16 rounded-lg overflow-hidden mb-4">
          {blendedColors.map((color, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer hover:scale-y-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
              title={color}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {blendedColors.map((color, i) => (
            <div
              key={i}
              className="flex flex-col items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-2 transition-colors"
              onClick={() => copyColor(color)}
            >
              <div
                className="w-10 h-10 rounded-lg mb-1"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
