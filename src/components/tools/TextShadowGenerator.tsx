'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Shadow {
  x: number;
  y: number;
  blur: number;
  color: string;
}

export default function TextShadowGenerator() {
  const t = useTranslations('tools.text-shadow-generator');
  const tg = useTranslations('tools');
  const [text, setText] = useState('Hello World');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#333333');
  const [shadows, setShadows] = useState<Shadow[]>([
    { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.5)' }
  ]);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getCssValue = () => {
    return shadows.map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.color}`).join(', ');
  };

  const addShadow = () => {
    setShadows([...shadows, { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.5)' }]);
  };

  const removeShadow = (index: number) => {
    setShadows(shadows.filter((_, i) => i !== index));
  };

  const updateShadow = (index: number, field: keyof Shadow, value: number | string) => {
    const newShadows = [...shadows];
    newShadows[index] = { ...newShadows[index], [field]: value };
    setShadows(newShadows);
  };

  const copyCSS = async () => {
    const css = `text-shadow: ${getCssValue()};`;
    await navigator.clipboard.writeText(css);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'glow':
        setShadows([{ x: 0, y: 0, blur: 10, color: '#00ff00' }]);
        break;
      case 'emboss':
        setShadows([
          { x: -1, y: -1, blur: 0, color: '#ffffff' },
          { x: 1, y: 1, blur: 0, color: '#000000' }
        ]);
        break;
      case '3d':
        setShadows([
          { x: 1, y: 1, blur: 0, color: '#666666' },
          { x: 2, y: 2, blur: 0, color: '#555555' },
          { x: 3, y: 3, blur: 0, color: '#444444' },
          { x: 4, y: 4, blur: 0, color: '#333333' }
        ]);
        break;
      case 'neon':
        setShadows([
          { x: 0, y: 0, blur: 5, color: '#ff00ff' },
          { x: 0, y: 0, blur: 10, color: '#ff00ff' },
          { x: 0, y: 0, blur: 20, color: '#ff00ff' }
        ]);
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => applyPreset('glow')} className="btn-secondary">{t('glow')}</button>
        <button onClick={() => applyPreset('emboss')} className="btn-secondary">{t('emboss')}</button>
        <button onClick={() => applyPreset('3d')} className="btn-secondary">{t('3d')}</button>
        <button onClick={() => applyPreset('neon')} className="btn-secondary">{t('neon')}</button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-32">
        <span
          style={{
            fontSize: `${fontSize}px`,
            color: textColor,
            textShadow: getCssValue()
          }}
        >
          {text}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('previewText')}</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('fontSize')}</label>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{fontSize}px</span>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('textColor')}</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">{t('shadows')}</h3>
          <button onClick={addShadow} className="btn-secondary text-sm">+ {t('addShadow')}</button>
        </div>
        {shadows.map((shadow, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 grid grid-cols-5 gap-2 items-center">
            <div>
              <label className="text-xs text-gray-500">X</label>
              <input
                type="number"
                value={shadow.x}
                onChange={(e) => updateShadow(index, 'x', Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={shadow.y}
                onChange={(e) => updateShadow(index, 'y', Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('blur')}</label>
              <input
                type="number"
                value={shadow.blur}
                onChange={(e) => updateShadow(index, 'blur', Number(e.target.value))}
                className="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('color')}</label>
              <input
                type="text"
                value={shadow.color}
                onChange={(e) => updateShadow(index, 'color', e.target.value)}
                className="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm"
              />
            </div>
            <button
              onClick={() => removeShadow(index)}
              disabled={shadows.length === 1}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">CSS</label>
          <button onClick={copyCSS} className="btn-secondary text-sm">
            {copied ? tg('copied') : tg('copy')}
          </button>
        </div>
        <code className="text-sm text-gray-800 dark:text-gray-200 font-mono">
          text-shadow: {getCssValue()};
        </code>
      </div>
    </div>
  );
}
