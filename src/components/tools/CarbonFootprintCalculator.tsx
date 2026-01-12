'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface EmissionFactors {
  car: { petrol: number; diesel: number; electric: number; hybrid: number };
  flight: { short: number; medium: number; long: number };
  train: number;
  bus: number;
  electricity: number;
  naturalGas: number;
  heating: number;
  diet: { meat: number; average: number; vegetarian: number; vegan: number };
}

const emissionFactors: EmissionFactors = {
  car: { petrol: 0.21, diesel: 0.17, electric: 0.05, hybrid: 0.12 }, // kg CO2 per km
  flight: { short: 0.255, medium: 0.195, long: 0.15 }, // kg CO2 per km
  train: 0.041, // kg CO2 per km
  bus: 0.089, // kg CO2 per km
  electricity: 0.4, // kg CO2 per kWh (EU average)
  naturalGas: 2.0, // kg CO2 per m³
  heating: 2.5, // kg CO2 per liter oil
  diet: { meat: 3.3, average: 2.5, vegetarian: 1.7, vegan: 1.5 }, // kg CO2 per day
};

export default function CarbonFootprintCalculator() {
  const t = useTranslations('tools.carbon-footprint-calculator');

  // Transportation
  const [carKm, setCarKm] = useState<string>('0');
  const [carType, setCarType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol');
  const [flightHours, setFlightHours] = useState<string>('0');
  const [flightType, setFlightType] = useState<'short' | 'medium' | 'long'>('medium');
  const [trainKm, setTrainKm] = useState<string>('0');
  const [busKm, setBusKm] = useState<string>('0');

  // Home Energy
  const [electricityKwh, setElectricityKwh] = useState<string>('0');
  const [gasM3, setGasM3] = useState<string>('0');
  const [heatingLiters, setHeatingLiters] = useState<string>('0');

  // Lifestyle
  const [dietType, setDietType] = useState<'meat' | 'average' | 'vegetarian' | 'vegan'>('average');

  // Time period
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const [results, setResults] = useState<{
    transport: number;
    energy: number;
    lifestyle: number;
    total: number;
    treesNeeded: number;
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [carKm, carType, flightHours, flightType, trainKm, busKm, electricityKwh, gasM3, heatingLiters, dietType, period]);

  const calculate = () => {
    const multiplier = period === 'yearly' ? 1 : 12;

    // Transport calculations
    const carEmissions = (parseFloat(carKm) || 0) * emissionFactors.car[carType];
    const flightKm = (parseFloat(flightHours) || 0) * 800; // Average 800 km/h
    const flightEmissions = flightKm * emissionFactors.flight[flightType];
    const trainEmissions = (parseFloat(trainKm) || 0) * emissionFactors.train;
    const busEmissions = (parseFloat(busKm) || 0) * emissionFactors.bus;
    const transportTotal = (carEmissions + flightEmissions + trainEmissions + busEmissions) * multiplier;

    // Energy calculations
    const electricityEmissions = (parseFloat(electricityKwh) || 0) * emissionFactors.electricity;
    const gasEmissions = (parseFloat(gasM3) || 0) * emissionFactors.naturalGas;
    const heatingEmissions = (parseFloat(heatingLiters) || 0) * emissionFactors.heating;
    const energyTotal = (electricityEmissions + gasEmissions + heatingEmissions) * multiplier;

    // Lifestyle calculations
    const daysInPeriod = period === 'yearly' ? 365 : 30;
    const lifestyleTotal = emissionFactors.diet[dietType] * daysInPeriod;

    const total = transportTotal + energyTotal + lifestyleTotal;
    const treesNeeded = Math.ceil(total / 21); // One tree absorbs ~21 kg CO2 per year

    setResults({
      transport: transportTotal / 1000, // Convert to tonnes
      energy: energyTotal / 1000,
      lifestyle: lifestyleTotal / 1000,
      total: total / 1000,
      treesNeeded,
    });
  };

  const getEmissionLevel = (tonnes: number): { level: string; color: string } => {
    if (tonnes < 2) return { level: t('levels.low'), color: 'text-green-600' };
    if (tonnes < 6) return { level: t('levels.average'), color: 'text-yellow-600' };
    if (tonnes < 12) return { level: t('levels.high'), color: 'text-orange-600' };
    return { level: t('levels.veryHigh'), color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="monthly">{t('monthly')}</option>
          <option value="yearly">{t('yearly')}</option>
        </select>
      </div>

      {/* Transportation Section */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
          🚗 {t('transportation')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('carDistance')} (km/{period === 'yearly' ? t('year') : t('month')})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={carKm}
                onChange={(e) => setCarKm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
              />
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value as typeof carType)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="petrol">{t('petrol')}</option>
                <option value="diesel">{t('diesel')}</option>
                <option value="hybrid">{t('hybrid')}</option>
                <option value="electric">{t('electric')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('flightHours')} ({period === 'yearly' ? t('year') : t('month')})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={flightHours}
                onChange={(e) => setFlightHours(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
                step="0.5"
              />
              <select
                value={flightType}
                onChange={(e) => setFlightType(e.target.value as typeof flightType)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="short">{t('shortHaul')}</option>
                <option value="medium">{t('mediumHaul')}</option>
                <option value="long">{t('longHaul')}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('trainDistance')} (km)
            </label>
            <input
              type="number"
              value={trainKm}
              onChange={(e) => setTrainKm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('busDistance')} (km)
            </label>
            <input
              type="number"
              value={busKm}
              onChange={(e) => setBusKm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Energy Section */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-4 flex items-center gap-2">
          ⚡ {t('homeEnergy')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('electricity')} (kWh/{period === 'yearly' ? t('year') : t('month')})
            </label>
            <input
              type="number"
              value={electricityKwh}
              onChange={(e) => setElectricityKwh(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('naturalGas')} (m³)
            </label>
            <input
              type="number"
              value={gasM3}
              onChange={(e) => setGasM3(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('heatingOil')} (L)
            </label>
            <input
              type="number"
              value={heatingLiters}
              onChange={(e) => setHeatingLiters(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
          🥗 {t('lifestyle')}
        </h3>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('dietType')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['meat', 'average', 'vegetarian', 'vegan'] as const).map((diet) => (
              <button
                key={diet}
                onClick={() => setDietType(diet)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  dietType === diet
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t(`diets.${diet}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('results')} ({period === 'yearly' ? t('yearly') : t('monthly')})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">🚗 {t('transportation')}</div>
              <div className="text-xl font-bold text-blue-600">{results.transport.toFixed(2)} t</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">⚡ {t('homeEnergy')}</div>
              <div className="text-xl font-bold text-yellow-600">{results.energy.toFixed(2)} t</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">🥗 {t('lifestyle')}</div>
              <div className="text-xl font-bold text-green-600">{results.lifestyle.toFixed(2)} t</div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">🌍 {t('total')}</div>
              <div className={`text-2xl font-bold ${getEmissionLevel(results.total).color}`}>
                {results.total.toFixed(2)} t CO₂
              </div>
              <div className={`text-sm ${getEmissionLevel(results.total).color}`}>
                {getEmissionLevel(results.total).level}
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌳</span>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('treesNeeded')}</div>
                <div className="text-xl font-bold text-green-700 dark:text-green-400">
                  {results.treesNeeded} {t('trees')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
