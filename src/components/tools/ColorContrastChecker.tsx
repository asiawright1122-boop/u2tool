'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return 0;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getWCAGLevel(ratio: number, isLargeText: boolean): { aa: boolean; aaa: boolean } {
  if (isLargeText) {
    return { aa: ratio >= 3, aaa: ratio >= 4.5 };
  }
  return { aa: ratio >= 4.5, aaa: ratio >= 7 };
}

export default function ColorContrastChecker() {
  const t = useTranslations('tools');
  const tc = useTranslations('tools.color-contrast-checker');
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  const [ratio, setRatio] = useState(21);
  const [wcagNormal, setWcagNormal] = useState({ aa: true, aaa: true });
  const [wcagLarge, setWcagLarge] = useState({ aa: true, aaa: true });

  useEffect(() => {
    const r = getContrastRatio(foreground, background);
    setRatio(r);
    setWcagNormal(getWCAGLevel(r, false));
    setWcagLarge(getWCAGLevel(r, true));
  }, [foreground, background]);

  const swapColors = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  const presets = [
    { fg: '#000000', bg: '#ffffff', nameKey: 'presetBlackOnWhite' },
    { fg: '#ffffff', bg: '#000000', nameKey: 'presetWhiteOnBlack' },
    { fg: '#1a1a1a', bg: '#f5f5f5', nameKey: 'presetDarkGrayOnLight' },
    { fg: '#0066cc', bg: '#ffffff', nameKey: 'presetBlueOnWhite' },
    { fg: '#ffffff', bg: '#0066cc', nameKey: 'presetWhiteOnBlue' },
    { fg: '#333333', bg: '#ffcc00', nameKey: 'presetDarkOnYellow' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">{t('colorContrast.foreground')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="tool-input flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        <button onClick={swapColors} className="btn-secondary p-2 mb-1" title={tc('swapColors')}>
          ⇄
        </button>

        <div>
          <label className="block text-sm font-medium mb-2">{t('colorContrast.background')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="tool-input flex-1 font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div
        className="p-8 rounded-lg text-center"
        style={{ backgroundColor: background, color: foreground }}
      >
        <div className="text-4xl font-bold mb-2">{t('colorContrast.preview')}</div>
        <div className="text-lg">{tc('sampleText')}</div>
        <div className="text-sm mt-2">{tc('smallText')}</div>
      </div>

      {/* Contrast Ratio */}
      <div className="p-6 bg-gray-800 rounded-lg text-center">
        <div className="text-5xl font-bold mb-2" style={{
          color: ratio >= 7 ? '#22c55e' : ratio >= 4.5 ? '#eab308' : '#ef4444'
        }}>
          {ratio.toFixed(2)}:1
        </div>
        <div className="text-gray-300">{t('colorContrast.contrastRatio')}</div>
      </div>

      {/* WCAG Results */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-3">{t('colorContrast.normalText')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>AA (4.5:1)</span>
              <span className={`px-2 py-1 rounded text-sm ${wcagNormal.aa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagNormal.aa ? `✓ ${t('colorContrast.pass')}` : `✗ ${t('colorContrast.fail')}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>AAA (7:1)</span>
              <span className={`px-2 py-1 rounded text-sm ${wcagNormal.aaa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagNormal.aaa ? `✓ ${t('colorContrast.pass')}` : `✗ ${t('colorContrast.fail')}`}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-3">{t('colorContrast.largeText')}</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>AA (3:1)</span>
              <span className={`px-2 py-1 rounded text-sm ${wcagLarge.aa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagLarge.aa ? `✓ ${t('colorContrast.pass')}` : `✗ ${t('colorContrast.fail')}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>AAA (4.5:1)</span>
              <span className={`px-2 py-1 rounded text-sm ${wcagLarge.aaa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagLarge.aaa ? `✓ ${t('colorContrast.pass')}` : `✗ ${t('colorContrast.fail')}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div>
        <h3 className="text-sm font-medium mb-3">{t('colorContrast.presets')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => { setForeground(preset.fg); setBackground(preset.bg); }}
              className="p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors text-left"
              style={{ backgroundColor: preset.bg, color: preset.fg }}
            >
              <div className="font-medium text-sm">{tc(preset.nameKey)}</div>
              <div className="text-xs opacity-75">{getContrastRatio(preset.fg, preset.bg).toFixed(1)}:1</div>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300">
        <h3 className="font-medium text-white mb-2">{t('colorContrast.guidelines')}</h3>
        <ul className="space-y-1">
          <li>• {tc('guidelinesAA')}</li>
          <li>• {tc('guidelinesAAA')}</li>
          <li>• {tc('guidelinesLarge')}</li>
        </ul>
      </div>
    </div>
  );
}
