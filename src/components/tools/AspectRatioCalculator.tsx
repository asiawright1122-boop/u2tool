'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function calculateAspectRatio(width: number, height: number): string {
  if (width <= 0 || height <= 0) return '-';
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

const commonRatioKeys = [
  { name: '16:9', descKey: 'hdVideo', w: 16, h: 9 },
  { name: '4:3', descKey: 'standard', w: 4, h: 3 },
  { name: '1:1', descKey: 'square', w: 1, h: 1 },
  { name: '21:9', descKey: 'ultrawide', w: 21, h: 9 },
  { name: '9:16', descKey: 'mobile', w: 9, h: 16 },
  { name: '3:2', descKey: 'photo', w: 3, h: 2 },
];

export default function AspectRatioCalculator() {
  const t = useTranslations('tools');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [newWidth, setNewWidth] = useState(1920);
  const [newHeight, setNewHeight] = useState(1080);
  const [lockRatio, setLockRatio] = useState(true);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const ratio = calculateAspectRatio(width, height);

  useEffect(() => {
    if (lockRatio && width > 0 && height > 0) {
      setNewHeight(Math.round(newWidth * (height / width)));
    }
  }, [newWidth, lockRatio, width, height]);

  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (lockRatio && height > 0) {
      setNewHeight(Math.round(newWidth * (value > 0 ? height / value : 0)));
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (lockRatio && width > 0) {
      setNewWidth(Math.round(newHeight * (value > 0 ? width / value : 0)));
    }
  };

  const handleNewWidthChange = (value: number) => {
    setNewWidth(value);
    if (lockRatio && width > 0 && height > 0) {
      setNewHeight(Math.round(value * (height / width)));
    }
  };

  const handleNewHeightChange = (value: number) => {
    setNewHeight(value);
    if (lockRatio && width > 0 && height > 0) {
      setNewWidth(Math.round(value * (width / height)));
    }
  };

  const applyRatio = (w: number, h: number) => {
    setWidth(w * 100);
    setHeight(h * 100);
    setNewWidth(w * 100);
    setNewHeight(h * 100);
  };

  const copyDimensions = async () => {
    await navigator.clipboard.writeText(`${newWidth}x${newHeight}`);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Original Dimensions */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">{t('aspect.original')}</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.width')}</label>
            <input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.height')}</label>
            <input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Aspect Ratio Display */}
      <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('aspect.ratio')}</div>
        <div className="text-4xl font-bold text-gray-900 dark:text-white">{ratio}</div>
      </div>

      {/* Common Ratios */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('aspect.common')}</label>
        <div className="flex flex-wrap gap-2">
          {commonRatioKeys.map((r) => (
            <button
              key={r.name}
              onClick={() => applyRatio(r.w, r.h)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-gray-600 dark:text-gray-300 ml-1 text-xs">({t(`aspect.${r.descKey}`)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resize Calculator */}
      <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-900 dark:text-white">{t('aspect.resize')}</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lockRatio}
              onChange={(e) => setLockRatio(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-900 dark:text-white">{t('aspect.lockRatio')}</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.newWidth')}</label>
            <input
              type="number"
              value={newWidth}
              onChange={(e) => handleNewWidthChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('aspect.newHeight')}</label>
            <input
              type="number"
              value={newHeight}
              onChange={(e) => handleNewHeightChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div>
          <span className="text-gray-600 dark:text-gray-300 text-sm">{t('result')}:</span>
          <span className="ml-2 font-mono text-lg text-gray-900 dark:text-white">{newWidth} × {newHeight}</span>
        </div>
        <button
          onClick={copyDimensions}
          className={`px-4 py-2 rounded-lg text-white ${copied ? 'bg-green-600' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
        >
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
    </div>
  );
}
