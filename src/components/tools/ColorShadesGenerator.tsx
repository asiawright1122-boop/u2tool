'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ColorShadesGenerator() {
  const t = useTranslations('tools.color-shades-generator');
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [shadeCount, setShadeCount] = useState(10);
  const [shades, setShades] = useState<string[]>([]);

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  useEffect(() => {
    const [h, s] = hexToHsl(baseColor);
    const newShades: string[] = [];
    
    for (let i = 0; i < shadeCount; i++) {
      const l = 95 - (i * (90 / (shadeCount - 1)));
      newShades.push(hslToHex(h, s, Math.max(5, Math.min(95, l))));
    }
    setShades(newShades);
  }, [baseColor, shadeCount]);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  const copyAll = () => {
    const css = shades.map((shade, i) => `--color-${(i + 1) * 100}: ${shade};`).join('\n');
    navigator.clipboard.writeText(css);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('baseColor')}</label>
          <div className="flex gap-2">
            <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)}
              className="w-16 h-10 rounded cursor-pointer" />
            <input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('numberOfShades', { count: shadeCount })}</label>
          <input type="range" min="5" max="15" value={shadeCount}
            onChange={(e) => setShadeCount(parseInt(e.target.value))}
            className="w-full mt-2" />
        </div>
        <div className="flex items-end">
          <button onClick={copyAll}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            {t('copyCssVariables')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
        {shades.map((shade, index) => (
          <div key={index} onClick={() => copyColor(shade)}
            className="cursor-pointer group">
            <div className="h-20 rounded-lg transition-transform group-hover:scale-105"
              style={{ backgroundColor: shade }} />
            <div className="mt-1 text-center">
              <div className="text-xs text-gray-300">{(index + 1) * 100}</div>
              <div className="text-xs font-mono text-gray-300">{shade}</div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('output')}</label>
        <pre className="bg-gray-700 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
          {shades.map((shade, i) => `--color-${(i + 1) * 100}: ${shade};`).join('\n')}
        </pre>
      </div>
    </div>
  );
}
