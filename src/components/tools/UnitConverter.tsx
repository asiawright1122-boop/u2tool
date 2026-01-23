'use client';

import { useState, useRef, useEffect } from 'react';
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
    f: { name: 'Fahrenheit', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const categoryUnits = Object.entries(units[category]);

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


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
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              {t(`unit.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion */}
      <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-stretch">
        {/* From Section */}
        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
          <label className="tool-label text-xs uppercase tracking-wider text-gray-500 mb-3 block text-center md:text-left">{t('unit.from')}</label>
          <div className="space-y-3">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="tool-input text-2xl md:text-3xl font-mono text-center h-16 bg-white dark:bg-gray-800 shadow-sm"
              placeholder={tu('enterValue')}
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="tool-select text-center font-medium bg-white dark:bg-gray-800 shadow-sm"
            >
              {categoryUnits.map(([key, def]) => (
                <option key={key} value={key}>{def.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center self-center py-2 md:py-0">
          <button
            onClick={swapUnits}
            className="p-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-blue-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 active:scale-90 group"
            title={tu('swapUnits')}
            aria-label={tu('swapUnits')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </button>
        </div>

        {/* To Section */}
        <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10">
          <label className="tool-label text-xs uppercase tracking-wider text-gray-500 mb-3 block text-center md:text-left">{t('unit.to')}</label>
          <div className="space-y-3">
            <div className="tool-input flex items-center justify-center text-2xl md:text-3xl font-mono h-16 bg-white dark:bg-gray-800 shadow-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {result || '0'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="tool-select text-center font-medium bg-white dark:bg-gray-800 shadow-sm"
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
