'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export default function BoxShadowGenerator() {
  const t = useTranslations('tools.box-shadow-generator');
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: 1, offsetX: 5, offsetY: 5, blur: 15, spread: 0, color: '#000000', opacity: 30, inset: false }
  ]);
  const [boxColor, setBoxColor] = useState('#3b82f6');
  const [boxRadius, setBoxRadius] = useState(8);

  const addShadow = () => {
    const newId = Math.max(...shadows.map(s => s.id), 0) + 1;
    setShadows([...shadows, { 
      id: newId, offsetX: 5, offsetY: 5, blur: 15, spread: 0, 
      color: '#000000', opacity: 30, inset: false 
    }]);
  };

  const removeShadow = (id: number) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(s => s.id !== id));
    }
  };

  const updateShadow = (id: number, field: keyof Shadow, value: number | string | boolean) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const generateCss = (): string => {
    const shadowStrings = shadows.map(s => {
      const insetStr = s.inset ? 'inset ' : '';
      const colorStr = hexToRgba(s.color, s.opacity);
      return `${insetStr}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${colorStr}`;
    });
    return shadowStrings.join(', ');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`box-shadow: ${generateCss()};`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('shadowLayers')}</h3>
            <button
              onClick={addShadow}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              {t('addLayer')}
            </button>
          </div>
          
          {shadows.map((shadow, index) => (
            <div key={shadow.id} className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t('layer', { index: index + 1 })}</span>
                {shadows.length > 1 && (
                  <button onClick={() => removeShadow(shadow.id)} className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm">
                    {t('remove')}
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('offsetX')}: {shadow.offsetX}px</label>
                  <input type="range" min="-50" max="50" value={shadow.offsetX}
                    onChange={(e) => updateShadow(shadow.id, 'offsetX', parseInt(e.target.value))}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('offsetY')}: {shadow.offsetY}px</label>
                  <input type="range" min="-50" max="50" value={shadow.offsetY}
                    onChange={(e) => updateShadow(shadow.id, 'offsetY', parseInt(e.target.value))}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('blur')}: {shadow.blur}px</label>
                  <input type="range" min="0" max="100" value={shadow.blur}
                    onChange={(e) => updateShadow(shadow.id, 'blur', parseInt(e.target.value))}
                    className="w-full" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('spread')}: {shadow.spread}px</label>
                  <input type="range" min="-50" max="50" value={shadow.spread}
                    onChange={(e) => updateShadow(shadow.id, 'spread', parseInt(e.target.value))}
                    className="w-full" />
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-600 dark:text-gray-300">{t('color')}</label>
                  <input type="color" value={shadow.color}
                    onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('opacity')}: {shadow.opacity}%</label>
                  <input type="range" min="0" max="100" value={shadow.opacity}
                    onChange={(e) => updateShadow(shadow.id, 'opacity', parseInt(e.target.value))}
                    className="w-full" />
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={shadow.inset}
                    onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                    className="rounded" />
                  {t('inset')}
                </label>
              </div>
            </div>
          ))}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('boxColor')}</label>
              <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('borderRadius')}: {boxRadius}px</label>
              <input type="range" min="0" max="50" value={boxRadius}
                onChange={(e) => setBoxRadius(parseInt(e.target.value))}
                className="w-full mt-2" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('preview')}</h3>
          <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div
              className="w-48 h-48 transition-all duration-200"
              style={{
                backgroundColor: boxColor,
                borderRadius: `${boxRadius}px`,
                boxShadow: generateCss()
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 break-all">
              box-shadow: {generateCss()};
            </div>
          </div>
          
          <button onClick={copyToClipboard}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
