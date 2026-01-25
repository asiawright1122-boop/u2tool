'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type Method = 'padding' | 'aspect-ratio';

interface Preset {
  name: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { name: '16:9', width: 16, height: 9 },
  { name: '4:3', width: 4, height: 3 },
  { name: '1:1', width: 1, height: 1 },
  { name: '21:9', width: 21, height: 9 },
  { name: '9:16', width: 9, height: 16 },
  { name: '3:2', width: 3, height: 2 },
  { name: '2:3', width: 2, height: 3 },
];

export default function AspectRatioBoxGenerator() {
  const t = useTranslations('tools.aspect-ratio-box-generator');
  const tg = useTranslations('tools');
  const [width, setWidth] = useState(16);
  const [height, setHeight] = useState(9);
  const [method, setMethod] = useState<Method>('aspect-ratio');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const paddingPercent = useMemo(() => {
    return ((height / width) * 100).toFixed(4);
  }, [width, height]);

  const cssCode = useMemo(() => {
    if (method === 'padding') {
      return `.aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-bottom: ${paddingPercent}%;
}

.aspect-ratio-box > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`;
    } else {
      return `.aspect-ratio-box {
  aspect-ratio: ${width} / ${height};
  width: 100%;
}`;
    }
  }, [method, width, height, paddingPercent]);

  const copyCSS = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: Preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              width === preset.width && height === preset.height
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('width')}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('height')}</label>
          <input
            type="number"
            min={1}
            max={100}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('method')}</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as Method)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="aspect-ratio">{t('aspectRatioProperty')}</option>
            <option value="padding">{t('paddingMethod')}</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <div className="max-w-md mx-auto">
          <div
            className="bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
            style={method === 'aspect-ratio' 
              ? { aspectRatio: `${width} / ${height}`, width: '100%' }
              : { position: 'relative', width: '100%', paddingBottom: `${paddingPercent}%` }
            }
          >
            {method === 'padding' ? (
              <span className="absolute inset-0 flex items-center justify-center">
                {width}:{height}
              </span>
            ) : (
              <span>{width}:{height}</span>
            )}
          </div>
        </div>
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

      {method === 'padding' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
          {t('paddingNote')}
        </div>
      )}
    </div>
  );
}
