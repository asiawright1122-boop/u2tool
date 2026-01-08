'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Shape = 'slab' | 'column' | 'stairs' | 'footing';
type Unit = 'metric' | 'imperial';

interface ConcreteResult {
  volume: number;
  bags40lb: number;
  bags60lb: number;
  bags80lb: number;
  yards: number;
}

export default function ConcreteCalculator() {
  const t = useTranslations('tools.concrete-calculator');
  const tc = useTranslations('tools');
  
  const [shape, setShape] = useState<Shape>('slab');
  const [unit, setUnit] = useState<Unit>('metric');
  
  // Slab dimensions
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  
  // Column dimensions
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState('1');
  
  // Stairs dimensions
  const [stairWidth, setStairWidth] = useState('');
  const [riseHeight, setRiseHeight] = useState('');
  const [runDepth, setRunDepth] = useState('');
  const [numSteps, setNumSteps] = useState('');
  
  const shapes: { id: Shape; icon: string }[] = [
    { id: 'slab', icon: '⬜' },
    { id: 'column', icon: '🔵' },
    { id: 'stairs', icon: '📶' },
    { id: 'footing', icon: '🏗️' },
  ];

  const calculateVolume = (): ConcreteResult | null => {
    let volumeCubicMeters = 0;
    const qty = parseInt(quantity) || 1;
    
    // Convert to meters if imperial
    const toMeters = (val: string, isDepth = false) => {
      const num = parseFloat(val);
      if (isNaN(num)) return 0;
      if (unit === 'imperial') {
        return isDepth ? num * 0.0254 : num * 0.3048; // inches to m for depth, feet to m for length
      }
      return isDepth ? num / 100 : num; // cm to m for depth, m for length
    };

    switch (shape) {
      case 'slab':
      case 'footing': {
        const l = toMeters(length);
        const w = toMeters(width);
        const d = toMeters(depth, true);
        if (l && w && d) {
          volumeCubicMeters = l * w * d * qty;
        }
        break;
      }
      case 'column': {
        const d = toMeters(diameter, true);
        const h = toMeters(height);
        if (d && h) {
          const radius = d / 2;
          volumeCubicMeters = Math.PI * radius * radius * h * qty;
        }
        break;
      }
      case 'stairs': {
        const sw = toMeters(stairWidth);
        const rh = toMeters(riseHeight, true);
        const rd = toMeters(runDepth, true);
        const steps = parseInt(numSteps) || 0;
        if (sw && rh && rd && steps) {
          // Volume of stairs = sum of each step
          // Each step is a rectangular prism
          volumeCubicMeters = sw * rh * rd * steps;
          // Add the triangular portion
          volumeCubicMeters += (sw * rh * rd * steps * (steps - 1)) / 2;
        }
        break;
      }
    }

    if (volumeCubicMeters <= 0) return null;

    // Convert to cubic yards
    const cubicYards = volumeCubicMeters * 1.30795;
    
    // Calculate bags needed (approximate)
    // 40lb bag = 0.011 cubic yards
    // 60lb bag = 0.017 cubic yards
    // 80lb bag = 0.022 cubic yards
    const bags40lb = Math.ceil(cubicYards / 0.011);
    const bags60lb = Math.ceil(cubicYards / 0.017);
    const bags80lb = Math.ceil(cubicYards / 0.022);

    return {
      volume: volumeCubicMeters,
      bags40lb,
      bags60lb,
      bags80lb,
      yards: cubicYards,
    };
  };

  const result = calculateVolume();

  return (
    <div className="space-y-6">
      {/* Shape Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectShape')}
        </label>
        <div className="flex flex-wrap gap-2">
          {shapes.map(s => (
            <button
              key={s.id}
              onClick={() => setShape(s.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                shape === s.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{s.icon}</span>
              <span>{t(s.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Unit Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`px-3 py-1 rounded text-sm ${
            unit === 'metric' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('metric')} (m, cm)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-3 py-1 rounded text-sm ${
            unit === 'imperial' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('imperial')} (ft, in)
        </button>
      </div>

      {/* Dimension Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(shape === 'slab' || shape === 'footing') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('length')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('width')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('depth')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('quantity')}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </>
        )}

        {shape === 'column' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('diameter')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('height')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('quantity')}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </>
        )}

        {shape === 'stairs' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('stairWidth')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                value={stairWidth}
                onChange={(e) => setStairWidth(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('riseHeight')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={riseHeight}
                onChange={(e) => setRiseHeight(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('runDepth')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={runDepth}
                onChange={(e) => setRunDepth(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('numSteps')}
              </label>
              <input
                type="number"
                value={numSteps}
                onChange={(e) => setNumSteps(e.target.value)}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('results')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('volume')}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.volume.toFixed(2)} m³
              </div>
              <div className="text-sm text-gray-500">
                {result.yards.toFixed(2)} yd³
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">40 lb {t('bags')}</div>
              <div className="text-xl font-bold text-orange-600">{result.bags40lb}</div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">60 lb {t('bags')}</div>
              <div className="text-xl font-bold text-orange-600">{result.bags60lb}</div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">80 lb {t('bags')}</div>
              <div className="text-xl font-bold text-orange-600">{result.bags80lb}</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{t('note')}</p>
        </div>
      )}
    </div>
  );
}
