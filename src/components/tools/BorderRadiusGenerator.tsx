'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BorderRadiusGenerator() {
  const t = useTranslations('tools.border-radius-generator');
  const [topLeft, setTopLeft] = useState(20);
  const [topRight, setTopRight] = useState(20);
  const [bottomRight, setBottomRight] = useState(20);
  const [bottomLeft, setBottomLeft] = useState(20);
  const [linked, setLinked] = useState(true);
  const [boxColor, setBoxColor] = useState('#3b82f6');
  const [unit, setUnit] = useState<'px' | '%'>('px');

  const handleChange = (corner: string, value: number) => {
    if (linked) {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    } else {
      switch (corner) {
        case 'topLeft': setTopLeft(value); break;
        case 'topRight': setTopRight(value); break;
        case 'bottomRight': setBottomRight(value); break;
        case 'bottomLeft': setBottomLeft(value); break;
      }
    }
  };

  const getCss = (): string => {
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `border-radius: ${topLeft}${unit};`;
    }
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCss());
  };

  const presets = [
    { name: t('presetSquare'), values: [0, 0, 0, 0] },
    { name: t('presetRounded'), values: [8, 8, 8, 8] },
    { name: t('presetPill'), values: [50, 50, 50, 50] },
    { name: t('presetLeaf'), values: [0, 50, 0, 50] },
    { name: t('presetDrop'), values: [50, 50, 0, 50] },
    { name: t('presetMessage'), values: [20, 20, 0, 20] },
  ];

  const applyPreset = (values: number[]) => {
    setLinked(false);
    setTopLeft(values[0]);
    setTopRight(values[1]);
    setBottomRight(values[2]);
    setBottomLeft(values[3]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('cornerRadius')}</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)}
                  className="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                {t('linkAll')}
              </label>
              <select value={unit} onChange={(e) => setUnit(e.target.value as 'px' | '%')}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('topLeft')}: {topLeft}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={topLeft}
                onChange={(e) => handleChange('topLeft', parseInt(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('topRight')}: {topRight}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={topRight}
                onChange={(e) => handleChange('topRight', parseInt(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('bottomLeft')}: {bottomLeft}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={bottomLeft}
                onChange={(e) => handleChange('bottomLeft', parseInt(e.target.value))}
                className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('bottomRight')}: {bottomRight}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={bottomRight}
                onChange={(e) => handleChange('bottomRight', parseInt(e.target.value))}
                className="w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('presets')}</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button key={preset.name} onClick={() => applyPreset(preset.values)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300">
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('boxColor')}</label>
            <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('preview')}</h3>
          <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div className="w-48 h-48 transition-all duration-200"
              style={{
                backgroundColor: boxColor,
                borderRadius: `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
              }} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('output')}</label>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400">
              {getCss()}
            </div>
          </div>
          
          <button onClick={copyToClipboard}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>
    </div>
  );
}
