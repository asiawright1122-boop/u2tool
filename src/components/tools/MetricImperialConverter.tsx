'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type ConversionCategory = 'length' | 'weight' | 'volume' | 'temperature' | 'area' | 'speed';

interface ConversionUnit {
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
  symbol: string;
  system: 'metric' | 'imperial';
}

const conversions: Record<ConversionCategory, Record<string, ConversionUnit>> = {
  length: {
    meter: { name: 'Meter', symbol: 'm', system: 'metric', toBase: (v) => v, fromBase: (v) => v },
    kilometer: { name: 'Kilometer', symbol: 'km', system: 'metric', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    centimeter: { name: 'Centimeter', symbol: 'cm', system: 'metric', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    millimeter: { name: 'Millimeter', symbol: 'mm', system: 'metric', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    inch: { name: 'Inch', symbol: 'in', system: 'imperial', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    foot: { name: 'Foot', symbol: 'ft', system: 'imperial', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    yard: { name: 'Yard', symbol: 'yd', system: 'imperial', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    mile: { name: 'Mile', symbol: 'mi', system: 'imperial', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    kilogram: { name: 'Kilogram', symbol: 'kg', system: 'metric', toBase: (v) => v, fromBase: (v) => v },
    gram: { name: 'Gram', symbol: 'g', system: 'metric', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    milligram: { name: 'Milligram', symbol: 'mg', system: 'metric', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    tonne: { name: 'Tonne', symbol: 't', system: 'metric', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    pound: { name: 'Pound', symbol: 'lb', system: 'imperial', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    ounce: { name: 'Ounce', symbol: 'oz', system: 'imperial', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    stone: { name: 'Stone', symbol: 'st', system: 'imperial', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  },
  volume: {
    liter: { name: 'Liter', symbol: 'L', system: 'metric', toBase: (v) => v, fromBase: (v) => v },
    milliliter: { name: 'Milliliter', symbol: 'mL', system: 'metric', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    cubicMeter: { name: 'Cubic Meter', symbol: 'm³', system: 'metric', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    gallon: { name: 'Gallon (US)', symbol: 'gal', system: 'imperial', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    gallonUK: { name: 'Gallon (UK)', symbol: 'gal UK', system: 'imperial', toBase: (v) => v * 4.54609, fromBase: (v) => v / 4.54609 },
    quart: { name: 'Quart', symbol: 'qt', system: 'imperial', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    pint: { name: 'Pint', symbol: 'pt', system: 'imperial', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    fluidOunce: { name: 'Fluid Ounce', symbol: 'fl oz', system: 'imperial', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
  },
  temperature: {
    celsius: { name: 'Celsius', symbol: '°C', system: 'metric', toBase: (v) => v, fromBase: (v) => v },
    fahrenheit: { name: 'Fahrenheit', symbol: '°F', system: 'imperial', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    kelvin: { name: 'Kelvin', symbol: 'K', system: 'metric', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  area: {
    squareMeter: { name: 'Square Meter', symbol: 'm²', system: 'metric', toBase: (v) => v, fromBase: (v) => v },
    squareKilometer: { name: 'Square Kilometer', symbol: 'km²', system: 'metric', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    hectare: { name: 'Hectare', symbol: 'ha', system: 'metric', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    squareFoot: { name: 'Square Foot', symbol: 'ft²', system: 'imperial', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    squareYard: { name: 'Square Yard', symbol: 'yd²', system: 'imperial', toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
    acre: { name: 'Acre', symbol: 'ac', system: 'imperial', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    squareMile: { name: 'Square Mile', symbol: 'mi²', system: 'imperial', toBase: (v) => v * 2589988, fromBase: (v) => v / 2589988 },
  },
  speed: {
    meterPerSecond: { name: 'Meter/Second', symbol: 'm/s', system: 'metric', toBase: (v) => v, fromBase: (v) => v },
    kilometerPerHour: { name: 'Kilometer/Hour', symbol: 'km/h', system: 'metric', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    milePerHour: { name: 'Mile/Hour', symbol: 'mph', system: 'imperial', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    footPerSecond: { name: 'Foot/Second', symbol: 'ft/s', system: 'imperial', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    knot: { name: 'Knot', symbol: 'kn', system: 'imperial', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  },
};

const categoryIcons: Record<ConversionCategory, string> = {
  length: '📏',
  weight: '⚖️',
  volume: '🧪',
  temperature: '🌡️',
  area: '📐',
  speed: '🚀',
};

export default function MetricImperialConverter() {
  const t = useTranslations('tools.metric-imperial-converter');

  const [category, setCategory] = useState<ConversionCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('meter');
  const [toUnit, setToUnit] = useState<string>('foot');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const units = Object.keys(conversions[category]);
    const metricUnit = units.find(u => conversions[category][u].system === 'metric') || units[0];
    const imperialUnit = units.find(u => conversions[category][u].system === 'imperial') || units[1];
    setFromUnit(metricUnit);
    setToUnit(imperialUnit);
  }, [category]);

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit, category]);

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(null);
      return;
    }

    const fromConversion = conversions[category][fromUnit];
    const toConversion = conversions[category][toUnit];

    if (!fromConversion || !toConversion) {
      setResult(null);
      return;
    }

    const baseValue = fromConversion.toBase(value);
    const convertedValue = toConversion.fromBase(baseValue);
    setResult(convertedValue);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result !== null) {
      setInputValue(result.toString());
    }
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) < 0.0001 || Math.abs(value) >= 1000000) {
      return value.toExponential(6);
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  const categoryUnits = conversions[category];
  const metricUnits = Object.entries(categoryUnits).filter(([, u]) => u.system === 'metric');
  const imperialUnits = Object.entries(categoryUnits).filter(([, u]) => u.system === 'imperial');

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {(Object.keys(conversions) as ConversionCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`p-3 rounded-lg border transition-colors text-center ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">{categoryIcons[cat]}</div>
            <div className="text-xs font-medium">{t(`categories.${cat}`)}</div>
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('from')}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg mb-2"
            placeholder="1"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('metric')}>
              {metricUnits.map(([key, unit]) => (
                <option key={key} value={key}>{unit.name} ({unit.symbol})</option>
              ))}
            </optgroup>
            <optgroup label={t('imperial')}>
              {imperialUnits.map(([key, unit]) => (
                <option key={key} value={key}>{unit.name} ({unit.symbol})</option>
              ))}
            </optgroup>
          </select>
        </div>

        <button
          onClick={handleSwap}
          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors self-center mb-6"
          title={t('swap')}
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('to')}
          </label>
          <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg mb-2 min-h-[52px] flex items-center">
            {result !== null ? formatResult(result) : '-'}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('metric')}>
              {metricUnits.map(([key, unit]) => (
                <option key={key} value={key}>{unit.name} ({unit.symbol})</option>
              ))}
            </optgroup>
            <optgroup label={t('imperial')}>
              {imperialUnits.map(([key, unit]) => (
                <option key={key} value={key}>{unit.name} ({unit.symbol})</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Result Display */}
      {result !== null && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center">
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {inputValue} {categoryUnits[fromUnit]?.symbol} =
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatResult(result)} {categoryUnits[toUnit]?.symbol}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('quickReference')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('metric')}</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {metricUnits.map(([key, unit]) => (
                <li key={key}>{unit.name} ({unit.symbol})</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">{t('imperial')}</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {imperialUnits.map(([key, unit]) => (
                <li key={key}>{unit.name} ({unit.symbol})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
