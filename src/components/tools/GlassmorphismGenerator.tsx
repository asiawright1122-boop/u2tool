'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function GlassmorphismGenerator() {
  const t = useTranslations('tools.glassmorphism-generator');
  const common = useTranslations('tools');

  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.25);
  const [borderOpacity, setBorderOpacity] = useState(0.18);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [shadowOpacity, setShadowOpacity] = useState(0.1);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const cssCode = useMemo(() => {
    return `/* Glassmorphism Effect */
background: ${hexToRgba(bgColor, transparency)};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: 16px;
border: 1px solid ${hexToRgba(bgColor, borderOpacity)};
box-shadow: 0 4px 30px rgba(0, 0, 0, ${shadowOpacity});`;
  }, [blur, transparency, borderOpacity, bgColor, shadowOpacity]);

  const previewStyle = useMemo(() => ({
    background: hexToRgba(bgColor, transparency),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: '16px',
    border: `1px solid ${hexToRgba(bgColor, borderOpacity)}`,
    boxShadow: `0 4px 30px rgba(0, 0, 0, ${shadowOpacity})`,
  }), [blur, transparency, borderOpacity, bgColor, shadowOpacity]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div 
        className="relative h-64 rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div 
            style={previewStyle}
            className="w-full max-w-md p-6 text-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Glassmorphism
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t('previewText')}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('blur')}: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('transparency')}: {(transparency * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={transparency * 100}
              onChange={(e) => setTransparency(Number(e.target.value) / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('borderOpacity')}: {(borderOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={borderOpacity * 100}
              onChange={(e) => setBorderOpacity(Number(e.target.value) / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('shadowOpacity')}: {(shadowOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={shadowOpacity * 100}
              onChange={(e) => setShadowOpacity(Number(e.target.value) / 100)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

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
