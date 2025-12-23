'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ColorConverter() {
  const t = useTranslations('tools');
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const updateFromHex = (newHex: string) => {
    setHex(newHex);
    const rgbVal = hexToRgb(newHex);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const updateFromRgb = (newRgb: typeof rgb) => {
    setRgb(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const copyValue = async (type: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div
        className="w-full h-32 rounded-lg border border-gray-700"
        style={{ backgroundColor: hex }}
      />

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('color.preview')}</label>
        <input
          type="color"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className="w-full h-12 cursor-pointer"
        />
      </div>

      {/* HEX */}
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">HEX</label>
          <button
            onClick={() => copyValue('hex', hex)}
            className={`text-xs px-2 py-1 rounded ${copied === 'hex' ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            {copied === 'hex' ? t('copied') : t('copy')}
          </button>
        </div>
        <input
          type="text"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded font-mono"
        />
      </div>

      {/* RGB */}
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">RGB</label>
          <button
            onClick={() => copyValue('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            className={`text-xs px-2 py-1 rounded ${copied === 'rgb' ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            {copied === 'rgb' ? t('copied') : t('copy')}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['r', 'g', 'b'] as const).map((c) => (
            <div key={c}>
              <label className="text-xs text-gray-300 uppercase">{c}</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgb[c]}
                onChange={(e) => updateFromRgb({ ...rgb, [c]: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* HSL */}
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">HSL</label>
          <button
            onClick={() => copyValue('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            className={`text-xs px-2 py-1 rounded ${copied === 'hsl' ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            {copied === 'hsl' ? t('copied') : t('copy')}
          </button>
        </div>
        <div className="font-mono text-sm">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
      </div>
    </div>
  );
}
