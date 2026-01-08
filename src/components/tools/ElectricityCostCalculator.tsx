'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Zap, Clock, DollarSign, Plus, Trash2 } from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  wattage: number;
  hoursPerDay: number;
}

interface CostResult {
  dailyKwh: number;
  monthlyKwh: number;
  yearlyKwh: number;
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
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

// Preset appliance keys for translation
const PRESET_APPLIANCE_KEYS = [
  { key: 'ledBulb', wattage: 10 },
  { key: 'incandescentBulb', wattage: 60 },
  { key: 'laptop', wattage: 50 },
  { key: 'desktop', wattage: 200 },
  { key: 'tv', wattage: 100 },
  { key: 'refrigerator', wattage: 150 },
  { key: 'airConditioner', wattage: 1500 },
  { key: 'spaceHeater', wattage: 1500 },
  { key: 'washingMachine', wattage: 500 },
  { key: 'dryer', wattage: 3000 },
  { key: 'microwave', wattage: 1000 },
  { key: 'electricOven', wattage: 2500 },
  { key: 'hairDryer', wattage: 1500 },
  { key: 'vacuumCleaner', wattage: 1000 },
  { key: 'electricKettle', wattage: 1500 },
  { key: 'coffeeMaker', wattage: 800 },
  { key: 'toaster', wattage: 850 },
  { key: 'gamingConsole', wattage: 150 },
  { key: 'router', wattage: 10 },
  { key: 'phoneCharger', wattage: 5 },
];

export default function ElectricityCostCalculator() {
  const t = useTranslations('tools.electricity-cost-calculator');
  const locale = useLocale();
  const currencySymbol = CURRENCY_SYMBOLS[locale] || '$';

  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: '', wattage: 10, hoursPerDay: 8 },
  ]);
  const [electricityRate, setElectricityRate] = useState<string>('0.12');
  const [initialized, setInitialized] = useState(false);

  // Initialize default appliance name after component mounts
  if (!initialized && appliances[0].name === '') {
    setAppliances([{ id: '1', name: t('appliance.ledBulb'), wattage: 10, hoursPerDay: 8 }]);
    setInitialized(true);
  }

  const addAppliance = (preset?: { key: string; wattage: number }) => {
    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: preset ? t(`appliance.${preset.key}`) : t('newAppliance'),
      wattage: preset?.wattage || 100,
      hoursPerDay: 1,
    };
    setAppliances([...appliances, newAppliance]);
  };

  const removeAppliance = (id: string) => {
    if (appliances.length > 1) {
      setAppliances(appliances.filter(a => a.id !== id));
    }
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: string | number) => {
    setAppliances(appliances.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const result = useMemo<CostResult | null>(() => {
    const rate = parseFloat(electricityRate);
    if (isNaN(rate) || rate <= 0) return null;

    let totalDailyWh = 0;
    for (const appliance of appliances) {
      if (appliance.wattage > 0 && appliance.hoursPerDay > 0) {
        totalDailyWh += appliance.wattage * appliance.hoursPerDay;
      }
    }

    const dailyKwh = totalDailyWh / 1000;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    return {
      dailyKwh: Math.round(dailyKwh * 100) / 100,
      monthlyKwh: Math.round(monthlyKwh * 100) / 100,
      yearlyKwh: Math.round(yearlyKwh * 100) / 100,
      dailyCost: Math.round(dailyKwh * rate * 100) / 100,
      monthlyCost: Math.round(monthlyKwh * rate * 100) / 100,
      yearlyCost: Math.round(yearlyKwh * rate * 100) / 100,
    };
  }, [appliances, electricityRate]);

  return (
    <div className="space-y-6">
      {/* Electricity Rate */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {t('electricityRate')} ({currencySymbol}/kWh)
        </label>
        <input
          type="number"
          value={electricityRate}
          onChange={(e) => setElectricityRate(e.target.value)}
          min="0"
          step="0.01"
          className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Appliances List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('appliances')} ({appliances.length})
          </label>
        </div>

        {appliances.map((appliance) => (
          <div key={appliance.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={appliance.name}
                onChange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => removeAppliance(appliance.id)}
                disabled={appliances.length === 1}
                className="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t('wattage')} (W)
                </label>
                <input
                  type="number"
                  value={appliance.wattage}
                  onChange={(e) => updateAppliance(appliance.id, 'wattage', parseFloat(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t('hoursPerDay')}
                </label>
                <input
                  type="number"
                  value={appliance.hoursPerDay}
                  onChange={(e) => updateAppliance(appliance.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="24"
                  step="0.5"
                  className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Appliance */}
        <div className="space-y-2">
          <button
            onClick={() => addAppliance()}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            {t('addAppliance')}
          </button>

          {/* Preset Appliances */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">{t('presets')}:</span>
            {PRESET_APPLIANCE_KEYS.slice(0, 8).map((preset, index) => (
              <button
                key={index}
                onClick={() => addAppliance(preset)}
                className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t(`appliance.${preset.key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Energy Consumption */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-medium text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {t('energyConsumption')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.dailyKwh}</div>
                <div className="text-sm text-gray-500">kWh/{t('day')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.monthlyKwh}</div>
                <div className="text-sm text-gray-500">kWh/{t('month')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.yearlyKwh}</div>
                <div className="text-sm text-gray-500">kWh/{t('year')}</div>
              </div>
            </div>
          </div>

          {/* Cost */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-medium text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t('estimatedCost')}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.dailyCost}</div>
                <div className="text-sm text-gray-500">{t('perDay')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.monthlyCost}</div>
                <div className="text-sm text-gray-500">{t('perMonth')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.yearlyCost}</div>
                <div className="text-sm text-gray-500">{t('perYear')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
