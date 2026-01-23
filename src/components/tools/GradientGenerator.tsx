'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ColorStop {
  color: string;
  position: number;
}

export default function GradientGenerator() {
  const t = useTranslations('tools');
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState(90);
  const [colors, setColors] = useState<ColorStop[]>([
    { color: '#667eea', position: 0 },
    { color: '#764ba2', position: 100 },
  ]);
  const [copied, setCopied] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateCSS = (): string => {
    const colorStops = colors
      .sort((a, b) => a.position - b.position)
      .map(c => `${c.color} ${c.position}%`)
      .join(', ');
    
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${colorStops})`;
    }
    return `radial-gradient(circle, ${colorStops})`;
  };

  const css = generateCSS();

  const addColor = () => {
    if (colors.length >= 5) return;
    const newPosition = Math.round((colors[colors.length - 1].position + colors[0].position) / 2);
    setColors([...colors, { color: '#ffffff', position: newPosition }]);
  };

  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, field: 'color' | 'position', value: string | number) => {
    const newColors = [...colors];
    if (field === 'color') {
      newColors[index].color = value as string;
    } else {
      newColors[index].position = Math.min(100, Math.max(0, value as number));
    }
    setColors(newColors);
  };

  const copyValue = async (type: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const presets = [
    { nameKey: 'sunset', colors: [{ color: '#ff6b6b', position: 0 }, { color: '#feca57', position: 100 }] },
    { nameKey: 'ocean', colors: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }] },
    { nameKey: 'forest', colors: [{ color: '#11998e', position: 0 }, { color: '#38ef7d', position: 100 }] },
    { nameKey: 'fire', colors: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }] },
    { nameKey: 'night', colors: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }] },
    { nameKey: 'rainbow', colors: [{ color: '#ff0000', position: 0 }, { color: '#ffff00', position: 25 }, { color: '#00ff00', position: 50 }, { color: '#00ffff', position: 75 }, { color: '#0000ff', position: 100 }] },
  ];

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Preview */}
      <div
        className="w-full h-48 rounded-xl border border-gray-300 dark:border-gray-700"
        style={{ background: css }}
      />

      {/* Type & Angle */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('gradient.type')}</label>
          <div className="flex gap-2">
            <button
              onClick={() => setType('linear')}
              className={`px-4 py-2 rounded-lg text-white ${type === 'linear' ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-800'}`}
            >
              {t('gradient.linear')}
            </button>
            <button
              onClick={() => setType('radial')}
              className={`px-4 py-2 rounded-lg text-white ${type === 'radial' ? 'bg-blue-600' : 'bg-gray-500 dark:bg-gray-800'}`}
            >
              {t('gradient.radial')}
            </button>
          </div>
        </div>

        {type === 'linear' && (
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('gradient.angle')}: {angle}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Color Stops */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">{t('gradient.colors')}</label>
          <button
            onClick={addColor}
            disabled={colors.length >= 5}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50 text-gray-900 dark:text-white"
          >
            + {t('gradient.addColor')}
          </button>
        </div>
        <div className="space-y-3">
          {colors.map((stop, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateColor(index, 'color', e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateColor(index, 'color', e.target.value)}
                className="w-24 px-2 py-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white"
              />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stop.position}
                  onChange={(e) => updateColor(index, 'position', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 w-12">{stop.position}%</span>
              </div>
              {colors.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="p-1 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('gradient.presets')}</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.nameKey}
              onClick={() => setColors(preset.colors)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
            >
              {t(`gradient.${preset.nameKey}`)}
            </button>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div className="space-y-3">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">CSS</span>
            <button
              onClick={() => copyValue('css', `background: ${css};`)}
              className={`text-xs px-2 py-1 rounded text-white ${copied === 'css' ? 'bg-green-600' : 'bg-gray-500 dark:bg-gray-700'}`}
            >
              {copied === 'css' ? t('copied') : t('copy')}
            </button>
          </div>
          <code className="text-sm text-green-700 dark:text-green-400 break-all">
            background: {css};
          </code>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Tailwind CSS</span>
            <button
              onClick={() => copyValue('tailwind', `bg-gradient-to-r from-[${colors[0].color}] to-[${colors[colors.length-1].color}]`)}
              className={`text-xs px-2 py-1 rounded text-white ${copied === 'tailwind' ? 'bg-green-600' : 'bg-gray-500 dark:bg-gray-700'}`}
            >
              {copied === 'tailwind' ? t('copied') : t('copy')}
            </button>
          </div>
          <code className="text-sm text-blue-700 dark:text-blue-400 break-all">
            bg-gradient-to-r from-[{colors[0].color}] to-[{colors[colors.length-1].color}]
          </code>
        </div>
      </div>
    </div>
  );
}
