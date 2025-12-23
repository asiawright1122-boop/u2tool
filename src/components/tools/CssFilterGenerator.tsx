'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function CssFilterGenerator() {
  const t = useTranslations('tools.css-filter-generator');
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [invert, setInvert] = useState(0);
  const [saturate, setSaturate] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/400/300');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFilterString = (): string => {
    const filters: string[] = [];
    if (blur !== 0) filters.push(`blur(${blur}px)`);
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (grayscale !== 0) filters.push(`grayscale(${grayscale}%)`);
    if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`);
    if (invert !== 0) filters.push(`invert(${invert}%)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
    if (sepia !== 0) filters.push(`sepia(${sepia}%)`);
    if (opacity !== 100) filters.push(`opacity(${opacity}%)`);
    return filters.length > 0 ? filters.join(' ') : 'none';
  };

  const getCss = (): string => {
    return `filter: ${getFilterString()};`;
  };

  const reset = () => {
    setBlur(0); setBrightness(100); setContrast(100); setGrayscale(0);
    setHueRotate(0); setInvert(0); setSaturate(100); setSepia(0); setOpacity(100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImageUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCss());
  };

  const presets: { nameKey: string; values: Record<string, number> }[] = [
    { nameKey: 'presetGrayscale', values: { grayscale: 100 } },
    { nameKey: 'presetSepia', values: { sepia: 100 } },
    { nameKey: 'presetVintage', values: { sepia: 50, contrast: 120, brightness: 90 } },
    { nameKey: 'presetDramatic', values: { contrast: 150, brightness: 110, saturate: 130 } },
    { nameKey: 'presetFaded', values: { contrast: 80, brightness: 110, saturate: 80 } },
    { nameKey: 'presetInverted', values: { invert: 100 } },
  ];

  const applyPreset = (values: Record<string, number>) => {
    reset();
    Object.entries(values).forEach(([key, value]) => {
      switch (key) {
        case 'blur': setBlur(value); break;
        case 'brightness': setBrightness(value); break;
        case 'contrast': setContrast(value); break;
        case 'grayscale': setGrayscale(value); break;
        case 'hueRotate': setHueRotate(value); break;
        case 'invert': setInvert(value); break;
        case 'saturate': setSaturate(value); break;
        case 'sepia': setSepia(value); break;
        case 'opacity': setOpacity(value); break;
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((preset) => (
              <button key={preset.nameKey} onClick={() => applyPreset(preset.values)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">{t(preset.nameKey)}</button>
            ))}
            <button onClick={reset} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">{t('reset')}</button>
          </div>

          {[
            { label: t('blur'), value: blur, set: setBlur, min: 0, max: 20, unit: 'px' },
            { label: t('brightness'), value: brightness, set: setBrightness, min: 0, max: 200, unit: '%' },
            { label: t('contrast'), value: contrast, set: setContrast, min: 0, max: 200, unit: '%' },
            { label: t('grayscale'), value: grayscale, set: setGrayscale, min: 0, max: 100, unit: '%' },
            { label: t('hueRotate'), value: hueRotate, set: setHueRotate, min: 0, max: 360, unit: '°' },
            { label: t('invert'), value: invert, set: setInvert, min: 0, max: 100, unit: '%' },
            { label: t('saturate'), value: saturate, set: setSaturate, min: 0, max: 200, unit: '%' },
            { label: t('sepia'), value: sepia, set: setSepia, min: 0, max: 100, unit: '%' },
            { label: t('opacity'), value: opacity, set: setOpacity, min: 0, max: 100, unit: '%' },
          ].map(({ label, value, set, min, max, unit }) => (
            <div key={label}>
              <label className="block text-sm text-gray-300 mb-1">{label}: {value}{unit}</label>
              <input type="range" min={min} max={max} value={value}
                onChange={(e) => set(parseInt(e.target.value))} className="w-full" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()}
              className="mb-4 px-4 py-2 bg-gray-600 hover:bg-gray-9000 rounded text-sm">{t('uploadImage')}</button>
            <img src={imageUrl} alt="Preview" className="w-full rounded-lg"
              style={{ filter: getFilterString() }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('output')}</label>
            <pre className="bg-gray-700 rounded-lg p-4 font-mono text-sm text-green-400">{getCss()}</pre>
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
