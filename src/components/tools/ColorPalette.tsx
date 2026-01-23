'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ColorPalette() {
  const t = useTranslations('tools');
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [copied, setCopied] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
    return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  };

  const [h, s, l] = hexToHsl(baseColor);
  const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(lv => hslToHex(h, s, lv));
  const complementary = hslToHex((h + 180) % 360, s, l);
  const analogous = [hslToHex((h - 30 + 360) % 360, s, l), baseColor, hslToHex((h + 30) % 360, s, l)];
  const triadic = [baseColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];

  const copy = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(''), 1500);
  };

  const ColorBox = ({ color }: { color: string }) => (
    <div onClick={() => copy(color)} className="cursor-pointer group">
      <div className="h-16 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color }} />
      <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{copied === color ? '✓' : color}</p>
    </div>
  );

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-16 h-16 rounded cursor-pointer" />
        <input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-gray-900 dark:text-white" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('palette.shades')}</h3>
        <div className="grid grid-cols-9 gap-2">{shades.map((c, i) => <ColorBox key={i} color={c} />)}</div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('palette.complementary')}</h3>
          <div className="grid grid-cols-2 gap-2"><ColorBox color={baseColor} /><ColorBox color={complementary} /></div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('palette.analogous')}</h3>
          <div className="grid grid-cols-3 gap-2">{analogous.map((c, i) => <ColorBox key={i} color={c} />)}</div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('palette.triadic')}</h3>
          <div className="grid grid-cols-3 gap-2">{triadic.map((c, i) => <ColorBox key={i} color={c} />)}</div>
        </div>
      </div>
    </div>
  );
}
