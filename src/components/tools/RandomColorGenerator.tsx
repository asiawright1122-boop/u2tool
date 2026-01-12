'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function RandomColorGenerator() {
  const t = useTranslations('tools.random-color-generator');
  const [colors, setColors] = useState<string[]>(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']);
  const [copied, setCopied] = useState<number | null>(null);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  const generateRandomHex = (): string => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const hexToRgb = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string): string => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const formatColor = useCallback((hex: string): string => {
    switch (format) {
      case 'rgb': return hexToRgb(hex);
      case 'hsl': return hexToHsl(hex);
      default: return hex;
    }
  }, [format]);

  const generateColors = () => {
    const newColors = Array.from({ length: count }, () => generateRandomHex());
    setColors(newColors);
  };

  const copyColor = (index: number) => {
    navigator.clipboard.writeText(formatColor(colors[index]));
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(colors.map(c => formatColor(c)).join('\n'));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  const getLuminance = (hex: string): number => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">{t('count')}:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">{t('format')}:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'hex' | 'rgb' | 'hsl')}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
            <option value="hsl">HSL</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={generateColors}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🎲 {t('generate')}
        </button>
        <button
          onClick={copyAll}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {copied === -1 ? t('copied') : t('copyAll')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            onClick={() => copyColor(index)}
            className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div
              className="h-32 flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <span className={`text-sm font-mono ${getLuminance(color) > 0.5 ? 'text-gray-900' : 'text-white'}`}>
                {copied === index ? t('copied') : t('clickToCopy')}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 text-center">
              <span className="font-mono text-sm text-gray-900 dark:text-white">{formatColor(color)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('palettePreview')}</h3>
        <div className="flex h-16 rounded-lg overflow-hidden">
          {colors.map((color, index) => (
            <div key={index} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
