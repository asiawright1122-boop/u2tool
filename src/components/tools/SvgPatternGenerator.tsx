'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type PatternType = 'dots' | 'lines' | 'grid' | 'zigzag' | 'waves' | 'hexagons' | 'triangles';

export default function SvgPatternGenerator() {
  const t = useTranslations('tools.svg-pattern-generator');
  const tg = useTranslations('tools');
  const [patternType, setPatternType] = useState<PatternType>('dots');
  const [size, setSize] = useState(20);
  const [color, setColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(1);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generatePattern = useMemo(() => {
    const s = size;
    const c = color;
    const o = opacity;

    switch (patternType) {
      case 'dots':
        return `<circle cx="${s/2}" cy="${s/2}" r="${s/6}" fill="${c}" fill-opacity="${o}"/>`;
      case 'lines':
        return `<line x1="0" y1="${s}" x2="${s}" y2="0" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'grid':
        return `<path d="M ${s} 0 L 0 0 0 ${s}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'zigzag':
        return `<polyline points="0,${s} ${s/2},0 ${s},${s}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'waves':
        return `<path d="M 0 ${s/2} Q ${s/4} 0, ${s/2} ${s/2} T ${s} ${s/2}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'hexagons':
        const h = s * 0.866;
        return `<polygon points="${s/4},0 ${s*3/4},0 ${s},${h/2} ${s*3/4},${h} ${s/4},${h} 0,${h/2}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'triangles':
        return `<polygon points="${s/2},0 ${s},${s} 0,${s}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      default:
        return '';
    }
  }, [patternType, size, color, opacity]);

  const svgCode = useMemo(() => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  ${generatePattern}
</svg>`;
  }, [size, bgColor, generatePattern]);

  const cssBackground = useMemo(() => {
    const encoded = encodeURIComponent(svgCode);
    return `background-image: url("data:image/svg+xml,${encoded}");`;
  }, [svgCode]);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('pattern')}</label>
          <select
            value={patternType}
            onChange={(e) => setPatternType(e.target.value as PatternType)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="dots">{t('dots')}</option>
            <option value="lines">{t('lines')}</option>
            <option value="grid">{t('grid')}</option>
            <option value="zigzag">{t('zigzag')}</option>
            <option value="waves">{t('waves')}</option>
            <option value="hexagons">{t('hexagons')}</option>
            <option value="triangles">{t('triangles')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('size')}</label>
          <input
            type="range"
            min={10}
            max={100}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-500">{size}px</span>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('color')}</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('bgColor')}</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('opacity')}: {opacity}</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-48 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svgCode)}")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      <div className="space-y-2">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">SVG Code</label>
            <button onClick={() => copyCode(svgCode)} className="btn-secondary text-sm">
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-32">
            {svgCode}
          </pre>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">CSS Background</label>
            <button onClick={() => copyCode(cssBackground)} className="btn-secondary text-sm">
              {tg('copy')}
            </button>
          </div>
          <code className="text-xs text-gray-800 dark:text-gray-200 font-mono break-all">
            {cssBackground}
          </code>
        </div>
      </div>
    </div>
  );
}
