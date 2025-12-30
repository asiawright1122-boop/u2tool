'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';

interface UnitDef {
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const units: Record<UnitCategory, Record<string, UnitDef>> = {
  length: {
    m: { name: 'Meter', toBase: v => v, fromBase: v => v },
    km: { name: 'Kilometer', toBase: v => v * 1000, fromBase: v => v / 1000 },
    cm: { name: 'Centimeter', toBase: v => v / 100, fromBase: v => v * 100 },
    mm: { name: 'Millimeter', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mi: { name: 'Mile', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    yd: { name: 'Yard', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    ft: { name: 'Foot', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    in: { name: 'Inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  },
  weight: {
    kg: { name: 'Kilogram', toBase: v => v, fromBase: v => v },
    g: { name: 'Gram', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mg: { name: 'Milligram', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    lb: { name: 'Pound', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    oz: { name: 'Ounce', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    t: { name: 'Ton', toBase: v => v * 1000, fromBase: v => v / 1000 },
  },
  temperature: {
    c: { name: 'Celsius', toBase: v => v, fromBase: v => v },
    f: { name: 'Fahrenheit', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    k: { name: 'Kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  },
  area: {
    m2: { name: 'Square Meter', toBase: v => v, fromBase: v => v },
    km2: { name: 'Square Kilometer', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
    ha: { name: 'Hectare', toBase: v => v * 10000, fromBase: v => v / 10000 },
    acre: { name: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    ft2: { name: 'Square Foot', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
  },
  volume: {
    l: { name: 'Liter', toBase: v => v, fromBase: v => v },
    ml: { name: 'Milliliter', toBase: v => v / 1000, fromBase: v => v * 1000 },
    m3: { name: 'Cubic Meter', toBase: v => v * 1000, fromBase: v => v / 1000 },
    gal: { name: 'Gallon (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    qt: { name: 'Quart', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    pt: { name: 'Pint', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
  },
  speed: {
    mps: { name: 'm/s', toBase: v => v, fromBase: v => v },
    kmh: { name: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    mph: { name: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    knot: { name: 'Knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  },
  data: {
    b: { name: 'Byte', toBase: v => v, fromBase: v => v },
    kb: { name: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
    mb: { name: 'MB', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
    gb: { name: 'GB', toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
    tb: { name: 'TB', toBase: v => v * 1024 * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024 * 1024) },
  },
};

export default function UnitConverter() {
  const t = useTranslations('tools');
  const tu = useTranslations('tools.unit-converter');
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [inputValue, setInputValue] = useState('1');
  const [copied, setCopied] = useState(false);

  const convert = (): string => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    const fromDef = units[category][fromUnit];
    const toDef = units[category][toUnit];
    
    if (!fromDef || !toDef) return '';
    
    const baseValue = fromDef.toBase(value);
    const result = toDef.fromBase(baseValue);
    
    return result.toLocaleString(undefined, { maximumFractionDigits: 10 });
  };

  const result = convert();

  const copyResult = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const categoryUnits = Object.entries(units[category]);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div>
        <label className="tool-label">{t('unit.category')}</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(units) as UnitCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                const unitKeys = Object.keys(units[cat]);
                setFromUnit(unitKeys[0]);
                setToUnit(unitKeys[1] || unitKeys[0]);
              }}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {t(`unit.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion */}
      <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label className="tool-label">{t('unit.from')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 tool-input"
              placeholder={tu('enterValue')}
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="tool-input w-auto"
            >
              {categoryUnits.map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={swapUnits}
          className="p-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
          title={tu('swapUnits')}
        >
          ⇄
        </button>

        <div>
          <label className="tool-label">{t('unit.to')}</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white">
              {result || '0'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="tool-input w-auto"
            >
              {categoryUnits.map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result && (
        <div className="flex justify-center">
          <button
            onClick={copyResult}
            className={`px-6 py-2 rounded-lg text-white ${copied ? 'bg-green-600' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')} {t('result')}
          </button>
        </div>
      )}

      {/* Quick Reference */}
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('unit.quickRef')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
          {categoryUnits.slice(0, 6).map(([key, def]) => (
            <div key={key}>
              <span className="text-blue-600 dark:text-blue-400">{key}</span> = {def.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
