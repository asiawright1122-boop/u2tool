'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

export default function CssTriangleGenerator() {
  const t = useTranslations('tools.css-triangle-generator');
  const tg = useTranslations('tools');
  const [direction, setDirection] = useState<Direction>('up');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const cssCode = useMemo(() => {
    const w = width;
    const h = height;
    const c = color;

    const styles: Record<Direction, string> = {
      'up': `width: 0;
height: 0;
border-left: ${w/2}px solid transparent;
border-right: ${w/2}px solid transparent;
border-bottom: ${h}px solid ${c};`,
      'down': `width: 0;
height: 0;
border-left: ${w/2}px solid transparent;
border-right: ${w/2}px solid transparent;
border-top: ${h}px solid ${c};`,
      'left': `width: 0;
height: 0;
border-top: ${h/2}px solid transparent;
border-bottom: ${h/2}px solid transparent;
border-right: ${w}px solid ${c};`,
      'right': `width: 0;
height: 0;
border-top: ${h/2}px solid transparent;
border-bottom: ${h/2}px solid transparent;
border-left: ${w}px solid ${c};`,
      'up-left': `width: 0;
height: 0;
border-top: ${h}px solid ${c};
border-right: ${w}px solid transparent;`,
      'up-right': `width: 0;
height: 0;
border-top: ${h}px solid ${c};
border-left: ${w}px solid transparent;`,
      'down-left': `width: 0;
height: 0;
border-bottom: ${h}px solid ${c};
border-right: ${w}px solid transparent;`,
      'down-right': `width: 0;
height: 0;
border-bottom: ${h}px solid ${c};
border-left: ${w}px solid transparent;`,
    };

    return styles[direction];
  }, [direction, width, height, color]);

  const previewStyle = useMemo(() => {
    const w = width;
    const h = height;
    const c = color;

    const styles: Record<Direction, React.CSSProperties> = {
      'up': { width: 0, height: 0, borderLeft: `${w/2}px solid transparent`, borderRight: `${w/2}px solid transparent`, borderBottom: `${h}px solid ${c}` },
      'down': { width: 0, height: 0, borderLeft: `${w/2}px solid transparent`, borderRight: `${w/2}px solid transparent`, borderTop: `${h}px solid ${c}` },
      'left': { width: 0, height: 0, borderTop: `${h/2}px solid transparent`, borderBottom: `${h/2}px solid transparent`, borderRight: `${w}px solid ${c}` },
      'right': { width: 0, height: 0, borderTop: `${h/2}px solid transparent`, borderBottom: `${h/2}px solid transparent`, borderLeft: `${w}px solid ${c}` },
      'up-left': { width: 0, height: 0, borderTop: `${h}px solid ${c}`, borderRight: `${w}px solid transparent` },
      'up-right': { width: 0, height: 0, borderTop: `${h}px solid ${c}`, borderLeft: `${w}px solid transparent` },
      'down-left': { width: 0, height: 0, borderBottom: `${h}px solid ${c}`, borderRight: `${w}px solid transparent` },
      'down-right': { width: 0, height: 0, borderBottom: `${h}px solid ${c}`, borderLeft: `${w}px solid transparent` },
    };

    return styles[direction];
  }, [direction, width, height, color]);

  const copyCSS = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const directions: Direction[] = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {directions.map((dir) => (
          <button
            key={dir}
            onClick={() => setDirection(dir)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              direction === dir
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {t(dir)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('width')}: {width}px</label>
          <input
            type="range"
            min={20}
            max={200}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('height')}: {height}px</label>
          <input
            type="range"
            min={20}
            max={200}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full"
          />
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
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-48">
        <div style={previewStyle} />
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">CSS</label>
          <button onClick={copyCSS} className="btn-secondary text-sm">
            {copied ? tg('copied') : tg('copy')}
          </button>
        </div>
        <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
