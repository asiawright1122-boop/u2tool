'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Unit = 'metric' | 'imperial';

interface Wall {
  id: number;
  width: string;
  height: string;
}

interface Opening {
  id: number;
  width: string;
  height: string;
  quantity: string;
}

export default function PaintCalculator() {
  const t = useTranslations('tools.paint-calculator');
  const tc = useTranslations('tools');
  
  const [unit, setUnit] = useState<Unit>('metric');
  const [walls, setWalls] = useState<Wall[]>([{ id: 1, width: '', height: '' }]);
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState('10'); // m² per liter
  
  const addWall = () => {
    setWalls([...walls, { id: Date.now(), width: '', height: '' }]);
  };

  const removeWall = (id: number) => {
    if (walls.length > 1) {
      setWalls(walls.filter(w => w.id !== id));
    }
  };

  const updateWall = (id: number, field: 'width' | 'height', value: string) => {
    setWalls(walls.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const addOpening = () => {
    setOpenings([...openings, { id: Date.now(), width: '', height: '', quantity: '1' }]);
  };

  const removeOpening = (id: number) => {
    setOpenings(openings.filter(o => o.id !== id));
  };

  const updateOpening = (id: number, field: 'width' | 'height' | 'quantity', value: string) => {
    setOpenings(openings.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const calculate = () => {
    // Convert to meters if imperial
    const toMeters = (val: string) => {
      const num = parseFloat(val);
      if (isNaN(num)) return 0;
      return unit === 'imperial' ? num * 0.3048 : num;
    };

    // Calculate total wall area
    let totalWallArea = 0;
    walls.forEach(wall => {
      const w = toMeters(wall.width);
      const h = toMeters(wall.height);
      if (w && h) {
        totalWallArea += w * h;
      }
    });

    // Calculate opening area to subtract
    let openingArea = 0;
    openings.forEach(opening => {
      const w = toMeters(opening.width);
      const h = toMeters(opening.height);
      const qty = parseInt(opening.quantity) || 1;
      if (w && h) {
        openingArea += w * h * qty;
      }
    });

    const paintableArea = totalWallArea - openingArea;
    if (paintableArea <= 0) return null;

    const numCoats = parseInt(coats) || 2;
    const coverageRate = parseFloat(coverage) || 10;
    
    const totalArea = paintableArea * numCoats;
    const litersNeeded = totalArea / coverageRate;
    const gallonsNeeded = litersNeeded * 0.264172;

    return {
      wallArea: totalWallArea,
      openingArea,
      paintableArea,
      totalArea,
      liters: litersNeeded,
      gallons: gallonsNeeded,
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
            unit === 'metric' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('metric')} (m)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-3 py-1 rounded text-sm ${
            unit === 'imperial' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('imperial')} (ft)
        </button>
      </div>

      {/* Walls */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('walls')}</h3>
          <button
            onClick={addWall}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            + {t('addWall')}
          </button>
        </div>
        <div className="space-y-3">
          {walls.map((wall, idx) => (
            <div key={wall.id} className="flex gap-2 items-center">
              <span className="text-sm text-gray-500 w-8">{idx + 1}.</span>
              <input
                type="number"
                value={wall.width}
                onChange={(e) => updateWall(wall.id, 'width', e.target.value)}
                placeholder={t('width')}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
              <span className="text-gray-500">×</span>
              <input
                type="number"
                value={wall.height}
                onChange={(e) => updateWall(wall.id, 'height', e.target.value)}
                placeholder={t('height')}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
              <span className="text-sm text-gray-500">{unit === 'metric' ? 'm' : 'ft'}</span>
              {walls.length > 1 && (
                <button
                  onClick={() => removeWall(wall.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Openings (Doors/Windows) */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{t('openings')}</h3>
          <button
            onClick={addOpening}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            + {t('addOpening')}
          </button>
        </div>
        {openings.length === 0 ? (
          <p className="text-sm text-gray-500">{t('noOpenings')}</p>
        ) : (
          <div className="space-y-3">
            {openings.map((opening, idx) => (
              <div key={opening.id} className="flex gap-2 items-center flex-wrap">
                <span className="text-sm text-gray-500 w-8">{idx + 1}.</span>
                <input
                  type="number"
                  value={opening.width}
                  onChange={(e) => updateOpening(opening.id, 'width', e.target.value)}
                  placeholder={t('width')}
                  className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <span className="text-gray-500">×</span>
                <input
                  type="number"
                  value={opening.height}
                  onChange={(e) => updateOpening(opening.id, 'height', e.target.value)}
                  placeholder={t('height')}
                  className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <span className="text-gray-500">×</span>
                <input
                  type="number"
                  value={opening.quantity}
                  onChange={(e) => updateOpening(opening.id, 'quantity', e.target.value)}
                  placeholder={t('qty')}
                  min="1"
                  className="w-16 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <button
                  onClick={() => removeOpening(opening.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('coats')}
          </label>
          <select
            value={coats}
            onChange={(e) => setCoats(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('coverage')} (m²/L)
          </label>
          <input
            type="number"
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Results */}
      {result && result.paintableArea > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('results')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 mb-1">{t('wallArea')}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.wallArea.toFixed(1)} m²
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 mb-1">{t('openingArea')}</div>
              <div className="text-lg font-bold text-red-600">
                -{result.openingArea.toFixed(1)} m²
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div className="text-xs text-gray-500 mb-1">{t('paintableArea')}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {result.paintableArea.toFixed(1)} m²
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-gray-500 mb-1">{t('paintNeeded')}</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {result.liters.toFixed(1)} L
              </div>
              <div className="text-sm text-gray-500">
                ({result.gallons.toFixed(1)} gal)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
