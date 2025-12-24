'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type ShapeType = 'circle' | 'ellipse' | 'polygon' | 'inset';

// Point 接口用于多边形顶点（保留供未来使用）
interface _Point {
  x: number;
  y: number;
}

const presets: Record<string, { type: ShapeType; value: string }> = {
  circle: { type: 'circle', value: 'circle(50% at 50% 50%)' },
  ellipse: { type: 'ellipse', value: 'ellipse(50% 30% at 50% 50%)' },
  triangle: { type: 'polygon', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  rhombus: { type: 'polygon', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  pentagon: { type: 'polygon', value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
  hexagon: { type: 'polygon', value: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
  star: { type: 'polygon', value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  arrow: { type: 'polygon', value: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
  cross: { type: 'polygon', value: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)' },
  inset: { type: 'inset', value: 'inset(10% 10% 10% 10% round 10px)' },
};

export default function CssClipPathGenerator() {
  const t = useTranslations('tools');
  const [clipPath, setClipPath] = useState('polygon(50% 0%, 0% 100%, 100% 100%)');
  const [copied, setCopied] = useState(false);

  const handlePreset = (preset: string) => {
    setClipPath(presets[preset].value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('clipPath.preview')}
          </label>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div
              className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600"
              style={{ clipPath }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('clipPath.presets')}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(presets).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition-colors"
                >
                  {t(`clipPath.preset${preset.charAt(0).toUpperCase() + preset.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('clipPath.value')}
            </label>
            <textarea
              value={clipPath}
              onChange={(e) => setClipPath(e.target.value)}
              className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('output')}
            </label>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <code className="text-sm text-green-400 font-mono">
                clip-path: {clipPath};
              </code>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">{t('clipPath.syntax')}</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <code className="text-blue-400">circle(radius at x y)</code> - {t('clipPath.circleDesc')}</li>
          <li>• <code className="text-blue-400">ellipse(rx ry at x y)</code> - {t('clipPath.ellipseDesc')}</li>
          <li>• <code className="text-blue-400">polygon(x1 y1, x2 y2, ...)</code> - {t('clipPath.polygonDesc')}</li>
          <li>• <code className="text-blue-400">inset(top right bottom left round radius)</code> - {t('clipPath.insetDesc')}</li>
        </ul>
      </div>
    </div>
  );
}
