'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// 常用颜色名称映射
const colorNames: Record<string, string> = {
  '#FF0000': 'Red', '#00FF00': 'Lime', '#0000FF': 'Blue',
  '#FFFF00': 'Yellow', '#FF00FF': 'Magenta', '#00FFFF': 'Cyan',
  '#000000': 'Black', '#FFFFFF': 'White', '#808080': 'Gray',
  '#800000': 'Maroon', '#808000': 'Olive', '#008000': 'Green',
  '#800080': 'Purple', '#008080': 'Teal', '#000080': 'Navy',
  '#FFA500': 'Orange', '#FFC0CB': 'Pink', '#A52A2A': 'Brown',
  '#FFD700': 'Gold', '#C0C0C0': 'Silver', '#F0E68C': 'Khaki',
  '#E6E6FA': 'Lavender', '#FA8072': 'Salmon', '#40E0D0': 'Turquoise',
  '#EE82EE': 'Violet', '#F5DEB3': 'Wheat', '#FFFACD': 'LemonChiffon',
  '#D2691E': 'Chocolate', '#FF6347': 'Tomato', '#4682B4': 'SteelBlue',
  '#6A5ACD': 'SlateBlue', '#2E8B57': 'SeaGreen', '#F4A460': 'SandyBrown',
  '#BC8F8F': 'RosyBrown', '#FF4500': 'OrangeRed', '#DA70D6': 'Orchid',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function colorDistance(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): number {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2));
}

function findClosestColor(hex: string): { name: string; hex: string; distance: number }[] {
  const inputRgb = hexToRgb(hex);
  if (!inputRgb) return [];
  
  const results = Object.entries(colorNames).map(([colorHex, name]) => {
    const colorRgb = hexToRgb(colorHex)!;
    return { name, hex: colorHex, distance: colorDistance(inputRgb, colorRgb) };
  });
  
  return results.sort((a, b) => a.distance - b.distance).slice(0, 5);
}

export default function ColorNameFinder() {
  const t = useTranslations('tools.color-name-finder');
  const [color, setColor] = useState('#4682B4');
  const [results, setResults] = useState<{ name: string; hex: string; distance: number }[]>([]);

  const handleFind = () => {
    const matches = findClosestColor(color);
    setResults(matches);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('inputLabel')}</label>
          <div className="flex gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <button onClick={handleFind} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t('find')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('closestColors')}</label>
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="w-10 h-10 rounded" style={{ backgroundColor: r.hex }} />
              <div className="flex-1">
                <div className="text-gray-900 dark:text-white font-medium">{r.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{r.hex}</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t('distance')}: {r.distance.toFixed(1)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
