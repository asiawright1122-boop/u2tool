'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const UNITS = ['px', 'rem', 'em', 'pt', 'vw', 'vh', '%'];

export default function CssUnitConverter() {
  const t = useTranslations('tools');
  const [value, setValue] = useState('16');
  const [fromUnit, setFromUnit] = useState('px');
  const [baseFontSize, setBaseFontSize] = useState('16');
  const [viewportWidth, setViewportWidth] = useState('1920');
  const [viewportHeight, setViewportHeight] = useState('1080');

  const convert = (toUnit: string): string => {
    const val = parseFloat(value);
    const base = parseFloat(baseFontSize);
    const vw = parseFloat(viewportWidth);
    const vh = parseFloat(viewportHeight);
    if (isNaN(val)) return '-';

    let px = val;
    if (fromUnit === 'rem' || fromUnit === 'em') px = val * base;
    else if (fromUnit === 'pt') px = val * 1.333;
    else if (fromUnit === 'vw') px = (val / 100) * vw;
    else if (fromUnit === 'vh') px = (val / 100) * vh;
    else if (fromUnit === '%') px = (val / 100) * base;

    if (toUnit === 'px') return px.toFixed(2);
    if (toUnit === 'rem' || toUnit === 'em') return (px / base).toFixed(4);
    if (toUnit === 'pt') return (px / 1.333).toFixed(2);
    if (toUnit === 'vw') return ((px / vw) * 100).toFixed(4);
    if (toUnit === 'vh') return ((px / vh) * 100).toFixed(4);
    if (toUnit === '%') return ((px / base) * 100).toFixed(2);
    return '-';
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.value')}</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.unit')}</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.baseFontSize')}</label>
          <input type="number" value={baseFontSize} onChange={(e) => setBaseFontSize(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.viewportWidth')}</label>
          <input type="number" value={viewportWidth} onChange={(e) => setViewportWidth(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.viewportHeight')}</label>
          <input type="number" value={viewportHeight} onChange={(e) => setViewportHeight(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('result')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {UNITS.map(u => (
            <div key={u} className="bg-gray-200 dark:bg-gray-700 rounded p-3 text-center">
              <p className="text-lg font-mono text-blue-600 dark:text-blue-400">{convert(u)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{u}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
