'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CssGradientText() {
  const t = useTranslations('tools.css-gradient-text');
  const [text, setText] = useState('Gradient Text');
  const [color1, setColor1] = useState('#ff6b6b');
  const [color2, setColor2] = useState('#4ecdc4');
  const [color3, setColor3] = useState('');
  const [angle, setAngle] = useState(90);
  const [fontSize, setFontSize] = useState(48);
  const [fontWeight, setFontWeight] = useState(700);

  const getGradient = (): string => {
    const colors = [color1, color2, color3].filter(Boolean).join(', ');
    return `linear-gradient(${angle}deg, ${colors})`;
  };

  const getCss = (): string => {
    return `.gradient-text {
  background: ${getGradient()};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCss());
  };

  const presets = [
    { nameKey: 'presetSunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3'] },
    { nameKey: 'presetOcean', colors: ['#0093E9', '#80D0C7', ''] },
    { nameKey: 'presetPurple', colors: ['#667eea', '#764ba2', ''] },
    { nameKey: 'presetFire', colors: ['#f12711', '#f5af19', ''] },
    { nameKey: 'presetMint', colors: ['#00b09b', '#96c93d', ''] },
    { nameKey: 'presetNight', colors: ['#232526', '#414345', '#667eea'] },
  ];

  const applyPreset = (colors: string[]) => {
    setColor1(colors[0]);
    setColor2(colors[1]);
    setColor3(colors[2] || '');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('text')}</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white" />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('color1')}</label>
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('color2')}</label>
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('color3')}</label>
              <input type="color" value={color3 || '#ffffff'} onChange={(e) => setColor3(e.target.value)}
                className="w-full h-10 rounded cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('angle')}: {angle}°</label>
            <input type="range" min="0" max="360" value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('fontSize')}: {fontSize}px</label>
              <input type="range" min="16" max="120" value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('fontWeight')}: {fontWeight}</label>
              <input type="range" min="100" max="900" step="100" value={fontWeight}
                onChange={(e) => setFontWeight(parseInt(e.target.value))} className="w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('presets')}</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button key={preset.nameKey} onClick={() => applyPreset(preset.colors)}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm">{t(preset.nameKey)}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <span style={{
              background: getGradient(),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight,
            }}>{text}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
            <pre className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 overflow-x-auto">{getCss()}</pre>
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
