'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Fuel, Car, DollarSign, ArrowLeftRight } from 'lucide-react';

type Unit = 'metric' | 'imperial';

interface FuelResult {
  fuelNeeded: number;
  totalCost: number;
  costPerKm: number;
  costPerMile: number;
}

// Currency symbols by locale
const CURRENCY_SYMBOLS: Record<string, string> = {
  en: '$',
  zh: '¥',
  ja: '¥',
  ko: '₩',
  es: '€',
  pt: 'R$',
  fr: '€',
  de: '€',
  ru: '₽',
  ar: '$',
};

export default function FuelCostCalculator() {
  const t = useTranslations('tools.fuel-cost-calculator');
  const locale = useLocale();
  const currencySymbol = CURRENCY_SYMBOLS[locale] || '$';

  const [unit, setUnit] = useState<Unit>('metric');
  const [distance, setDistance] = useState<string>('100');
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('8');
  const [fuelPrice, setFuelPrice] = useState<string>('1.50');
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const result = useMemo<FuelResult | null>(() => {
    const distanceNum = parseFloat(distance);
    const efficiencyNum = parseFloat(fuelEfficiency);
    const priceNum = parseFloat(fuelPrice);

    if (isNaN(distanceNum) || isNaN(efficiencyNum) || isNaN(priceNum) ||
        distanceNum <= 0 || efficiencyNum <= 0 || priceNum <= 0) {
      return null;
    }

    let actualDistance = isRoundTrip ? distanceNum * 2 : distanceNum;
    let fuelNeeded: number;

    if (unit === 'metric') {
      // L/100km
      fuelNeeded = (actualDistance / 100) * efficiencyNum;
    } else {
      // MPG - convert to gallons needed
      fuelNeeded = actualDistance / efficiencyNum;
    }

    const totalCost = fuelNeeded * priceNum;

    // Cost per distance
    const costPerKm = unit === 'metric' 
      ? totalCost / actualDistance 
      : (totalCost / actualDistance) * 1.60934;
    const costPerMile = unit === 'imperial'
      ? totalCost / actualDistance
      : (totalCost / actualDistance) / 1.60934;

    return {
      fuelNeeded: Math.round(fuelNeeded * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      costPerKm: Math.round(costPerKm * 1000) / 1000,
      costPerMile: Math.round(costPerMile * 1000) / 1000,
    };
  }, [unit, distance, fuelEfficiency, fuelPrice, isRoundTrip]);

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setUnit('metric')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'metric'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('metric')} (km, L/100km)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'imperial'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('imperial')} (mi, MPG)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distance */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Car className="w-4 h-4" />
            {t('distance')} ({unit === 'metric' ? 'km' : 'miles'})
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            min="0"
            step="1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Fuel Efficiency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Fuel className="w-4 h-4" />
            {t('fuelEfficiency')} ({unit === 'metric' ? 'L/100km' : 'MPG'})
          </label>
          <input
            type="number"
            value={fuelEfficiency}
            onChange={(e) => setFuelEfficiency(e.target.value)}
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Fuel Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {t('fuelPrice')} ({unit === 'metric' ? t('perLiter') : t('perGallon')})
          </label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Round Trip Toggle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            {t('tripType')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRoundTrip(false)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                !isRoundTrip
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('oneWay')}
            </button>
            <button
              onClick={() => setIsRoundTrip(true)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRoundTrip
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('roundTrip')}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Fuel className="w-6 h-6 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('fuelNeeded')}</span>
                </div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {result.fuelNeeded}
                </div>
                <div className="text-sm text-gray-500">
                  {unit === 'metric' ? t('liters') : t('gallons')}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-6 h-6 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('totalCost')}</span>
                </div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {currencySymbol}{result.totalCost.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {isRoundTrip ? t('roundTripCost') : t('oneWayCost')}
                </div>
              </div>
            </div>
          </div>

          {/* Cost per Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currencySymbol}{result.costPerKm.toFixed(3)}
              </div>
              <div className="text-sm text-gray-500">{t('perKm')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {currencySymbol}{result.costPerMile.toFixed(3)}
              </div>
              <div className="text-sm text-gray-500">{t('perMile')}</div>
            </div>
          </div>

          {/* Trip Summary */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('tripSummary', {
                distance: isRoundTrip ? parseFloat(distance) * 2 : parseFloat(distance),
                unit: unit === 'metric' ? 'km' : 'miles',
                fuel: result.fuelNeeded,
                fuelUnit: unit === 'metric' ? 'L' : 'gal',
                cost: `${currencySymbol}${result.totalCost.toFixed(2)}`,
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
