'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Unit = 'metric' | 'imperial';
type Pattern = 'straight' | 'diagonal' | 'herringbone';

export default function TileCalculator() {
  const t = useTranslations('tools.tile-calculator');
  const tc = useTranslations('tools');
  
  const [unit, setUnit] = useState<Unit>('metric');
  const [pattern, setPattern] = useState<Pattern>('straight');
  
  // Room dimensions
  const [roomLength, setRoomLength] = useState('');
  const [roomWidth, setRoomWidth] = useState('');
  
  // Tile dimensions
  const [tileLength, setTileLength] = useState('');
  const [tileWidth, setTileWidth] = useState('');
  
  // Grout and waste
  const [groutWidth, setGroutWidth] = useState('3');
  const [wastePercent, setWastePercent] = useState('10');
  const [tilesPerBox, setTilesPerBox] = useState('');
  
  const patterns: { id: Pattern; icon: string }[] = [
    { id: 'straight', icon: '▦' },
    { id: 'diagonal', icon: '◇' },
    { id: 'herringbone', icon: '⋈' },
  ];

  const calculate = () => {
    // Convert to meters
    const toMeters = (val: string, isTile = false) => {
      const num = parseFloat(val);
      if (isNaN(num)) return 0;
      if (unit === 'imperial') {
        return isTile ? num * 0.0254 : num * 0.3048;
      }
      return isTile ? num / 100 : num;
    };

    const rL = toMeters(roomLength);
    const rW = toMeters(roomWidth);
    const tL = toMeters(tileLength, true);
    const tW = toMeters(tileWidth, true);
    const grout = parseFloat(groutWidth) / 1000 || 0.003;
    const waste = parseFloat(wastePercent) / 100 || 0.1;

    if (!rL || !rW || !tL || !tW) return null;

    const roomArea = rL * rW;
    const tileArea = (tL + grout) * (tW + grout);
    
    // Pattern waste factor
    let patternFactor = 1;
    if (pattern === 'diagonal') patternFactor = 1.15;
    if (pattern === 'herringbone') patternFactor = 1.2;

    const tilesNeeded = Math.ceil((roomArea / tileArea) * patternFactor * (1 + waste));
    const boxesNeeded = tilesPerBox ? Math.ceil(tilesNeeded / parseInt(tilesPerBox)) : null;

    return {
      roomArea,
      tileArea: tL * tW,
      tilesNeeded,
      boxesNeeded,
      totalTileArea: tilesNeeded * tL * tW,
    };
  };

  const result = calculate();

  return (
    <div className="space-y-6">
      {/* Unit Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`px-3 py-1 rounded text-sm ${
            unit === 'metric' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('metric')} (m, cm)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-3 py-1 rounded text-sm ${
            unit === 'imperial' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('imperial')} (ft, in)
        </button>
      </div>

      {/* Pattern Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('pattern')}
        </label>
        <div className="flex gap-2">
          {patterns.map(p => (
            <button
              key={p.id}
              onClick={() => setPattern(p.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                pattern === p.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{p.icon}</span>
              <span>{t(p.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Room Dimensions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('roomDimensions')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('length')} ({unit === 'metric' ? 'm' : 'ft'})
            </label>
            <input
              type="number"
              value={roomLength}
              onChange={(e) => setRoomLength(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('width')} ({unit === 'metric' ? 'm' : 'ft'})
            </label>
            <input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Tile Dimensions */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('tileDimensions')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('tileLength')} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              value={tileLength}
              onChange={(e) => setTileLength(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('tileWidth')} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              value={tileWidth}
              onChange={(e) => setTileWidth(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('groutWidth')} (mm)
          </label>
          <input
            type="number"
            value={groutWidth}
            onChange={(e) => setGroutWidth(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('waste')} (%)
          </label>
          <input
            type="number"
            value={wastePercent}
            onChange={(e) => setWastePercent(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('tilesPerBox')}
          </label>
          <input
            type="number"
            value={tilesPerBox}
            onChange={(e) => setTilesPerBox(e.target.value)}
            placeholder={t('optional')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('results')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 mb-1">{t('roomArea')}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.roomArea.toFixed(2)} m²
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 mb-1">{t('tileArea')}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {(result.tileArea * 10000).toFixed(0)} cm²
              </div>
            </div>
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-800 text-center">
              <div className="text-xs text-gray-500 mb-1">{t('tilesNeeded')}</div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {result.tilesNeeded}
              </div>
            </div>
            {result.boxesNeeded && (
              <div className="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-center">
                <div className="text-xs text-gray-500 mb-1">{t('boxesNeeded')}</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {result.boxesNeeded}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
