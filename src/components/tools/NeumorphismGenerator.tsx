'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function NeumorphismGenerator() {
  const t = useTranslations('tools.neumorphism-generator');
  const common = useTranslations('tools');

  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(15);
  const [blur, setBlur] = useState(60);
  const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
  const [borderRadius, setBorderRadius] = useState(50);
  const [copied, setCopied] = useState(false);

  const adjustColor = (hex: string, amount: number) => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const lightColor = useMemo(() => adjustColor(bgColor, intensity), [bgColor, intensity]);
  const darkColor = useMemo(() => adjustColor(bgColor, -intensity), [bgColor, intensity]);

  const getGradient = () => {
    switch (shape) {
      case 'concave':
        return `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
      case 'convex':
        return `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
      default:
        return bgColor;
    }
  };

  const getShadow = () => {
    const isPressed = shape === 'pressed';
    const sign = isPressed ? 'inset ' : '';
    return `${sign}${distance}px ${distance}px ${blur}px ${darkColor}, ${sign}${-distance}px ${-distance}px ${blur}px ${lightColor}`;
  };

  const cssCode = useMemo(() => {
    return `/* Neumorphism Effect */
background: ${getGradient()};
border-radius: ${borderRadius}px;
box-shadow: ${getShadow()};`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgColor, distance, intensity, blur, shape, borderRadius, lightColor, darkColor]);

  const previewStyle = useMemo(() => ({
    background: getGradient(),
    borderRadius: `${borderRadius}px`,
    boxShadow: getShadow(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [bgColor, distance, intensity, blur, shape, borderRadius, lightColor, darkColor]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div 
        className="h-64 rounded-lg flex items-center justify-center"
        style={{ background: bgColor }}
      >
        <div 
          style={previewStyle}
          className="w-32 h-32 flex items-center justify-center"
        >
          <span className="text-gray-600 text-sm font-medium">Preview</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('backgroundColor')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('shape')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['flat', 'concave', 'convex', 'pressed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    shape === s
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {t(`shapes.${s}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('distance')}: {distance}px
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('intensity')}: {intensity}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('blur')}: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('borderRadius')}: {borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS {common('output')}
          </label>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
