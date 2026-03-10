<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['fuel-cost-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.fuel-cost-calculator.${key}`;
  }

  // Imports
  import { Fuel, Car, DollarSign, ArrowLeftRight } from 'lucide-svelte';

  // Types
  type Unit = 'metric' | 'imperial';
  interface FuelResult {
  fuelNeeded: number;
  totalCost: number;
  costPerKm: number;
  costPerMile: number;
}

  let unit = $state('metric');

  let distance = $state('100');

  let fuelEfficiency = $state('8');

  let fuelPrice = $state('1.50');

  let isRoundTrip = $state(false);

  let result = $derived.by(() => {
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
  });

  // Functions
const currencySymbol = CURRENCY_SYMBOLS[locale] || '$';

</script>


    <div class="space-y-6">
      <!-- Unit Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => unit = 'metric'}
          class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'metric'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('metric')} (km, L/100km)
        </button>
        <button
          onclick={() => unit = 'imperial'}
          class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'imperial'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('imperial')} (mi, MPG)
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Distance -->
        <div class="space-y-2">
          <label for="fuel-distance" class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Car class="w-4 h-4" />
            {t('distance')} ({unit === 'metric' ? 'km' : 'miles'})
          </label>
          <input
            id="fuel-distance"
            name="distanceValue"
            type="number"
            bind:value={distance}
            min="0"
            step="1"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Fuel Efficiency -->
        <div class="space-y-2">
          <label for="fuel-efficiency" class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Fuel class="w-4 h-4" />
            {t('fuelEfficiency')} ({unit === 'metric' ? 'L/100km' : 'MPG'})
          </label>
          <input
            id="fuel-efficiency"
            name="fuelEfficiency"
            type="number"
            bind:value={fuelEfficiency}
            min="0"
            step="0.1"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Fuel Price -->
        <div class="space-y-2">
          <label for="fuel-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <DollarSign class="w-4 h-4" />
            {t('fuelPrice')} ({unit === 'metric' ? t('perLiter') : t('perGallon')})
          </label>
          <input
            id="fuel-price"
            name="fuelPrice"
            type="number"
            bind:value={fuelPrice}
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Round Trip Toggle -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <ArrowLeftRight class="w-4 h-4" />
            {t('tripType')}
          </label>
          <div class="flex gap-2">
            <button
              onclick={() => isRoundTrip = false}
              class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                !isRoundTrip
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('oneWay')}
            </button>
            <button
              onclick={() => isRoundTrip = true}
              class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
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

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- Main Result -->
          <div class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div class="grid grid-cols-2 gap-6">
              <div class="text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <Fuel class="w-6 h-6 text-green-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">{t('fuelNeeded')}</span>
                </div>
                <div class="text-4xl font-bold text-green-600 dark:text-green-400">
                  {result.fuelNeeded}
                </div>
                <div class="text-sm text-gray-500">
                  {unit === 'metric' ? t('liters') : t('gallons')}
                </div>
              </div>
              <div class="text-center">
                <div class="flex items-center justify-center gap-2 mb-2">
                  <DollarSign class="w-6 h-6 text-green-500" />
                  <span class="text-sm text-gray-600 dark:text-gray-400">{t('totalCost')}</span>
                </div>
                <div class="text-4xl font-bold text-green-600 dark:text-green-400">
                  {currencySymbol}{result.totalCost.toFixed(2)}
                </div>
                <div class="text-sm text-gray-500">
                  {isRoundTrip ? t('roundTripCost') : t('oneWayCost')}
                </div>
              </div>
            </div>
          </div>

          <!-- Cost per Distance -->
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {currencySymbol}{result.costPerKm.toFixed(3)}
              </div>
              <div class="text-sm text-gray-500">{t('perKm')}</div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {currencySymbol}{result.costPerMile.toFixed(3)}
              </div>
              <div class="text-sm text-gray-500">{t('perMile')}</div>
            </div>
          </div>

          <!-- Trip Summary -->
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="text-sm text-gray-600 dark:text-gray-400">
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
{/if}
    </div>
  
