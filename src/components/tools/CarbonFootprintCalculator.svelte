<script lang="ts">
  import { emissionFactors } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['carbon-footprint-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.carbon-footprint-calculator.${key}`;
  }

  // Types
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

  let carKm = $state('0');

  let carType = $state('petrol');

  let flightHours = $state('0');

  let flightType = $state('medium');

  let trainKm = $state('0');

  let busKm = $state('0');

  let electricityKwh = $state('0');

  let gasM3 = $state('0');

  let heatingLiters = $state('0');

  let dietType = $state('average');

  let period = $state('monthly');

  let results = $state(null);

  $effect(() => {
    calculate();
  });

  // Functions
  function calculate() {
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

    results = {
      transport: transportTotal / 1000, // Convert to tonnes
      energy: energyTotal / 1000,
      lifestyle: lifestyleTotal / 1000,
      total: total / 1000,
      treesNeeded,
    };
  }
  function getEmissionLevel(tonnes: number) {
    if (tonnes < 2) return { level: t('levels.low'), color: 'text-green-600' };
    if (tonnes < 6) return { level: t('levels.average'), color: 'text-yellow-600' };
    if (tonnes < 12) return { level: t('levels.high'), color: 'text-orange-600' };
    return { level: t('levels.veryHigh'), color: 'text-red-600' };
  }

</script>


    <div class="space-y-6">
      <div class="flex justify-end">
        <select
          value={period}
          onchange={(e) => period = e.target.value as 'monthly' | 'yearly'}
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="monthly">{t('monthly')}</option>
          <option value="yearly">{t('yearly')}</option>
        </select>
      </div>

      <!-- Transportation Section -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h3 class="text-lg font-medium text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg> {t('transportation')}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('carDistance')} (km/{period === 'yearly' ? t('year') : t('month')})
            </label>
            <div class="flex gap-2">
              <input
                type="number"
                bind:value={carKm}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
              />
              <select
                value={carType}
                onchange={(e) => carType = e.target.value as typeof carType}
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="petrol">{t('petrol')}</option>
                <option value="diesel">{t('diesel')}</option>
                <option value="hybrid">{t('hybrid')}</option>
                <option value="electric">{t('electric')}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('flightHours')} ({period === 'yearly' ? t('year') : t('month')})
            </label>
            <div class="flex gap-2">
              <input
                type="number"
                bind:value={flightHours}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min="0"
                step="0.5"
              />
              <select
                value={flightType}
                onchange={(e) => flightType = e.target.value as typeof flightType}
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="short">{t('shortHaul')}</option>
                <option value="medium">{t('mediumHaul')}</option>
                <option value="long">{t('longHaul')}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('trainDistance')} (km)
            </label>
            <input
              type="number"
              bind:value={trainKm}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('busDistance')} (km)
            </label>
            <input
              type="number"
              bind:value={busKm}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
        </div>
      </div>

      <!-- Energy Section -->
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-300 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> {t('homeEnergy')}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('electricity')} (kWh/{period === 'yearly' ? t('year') : t('month')})
            </label>
            <input
              type="number"
              bind:value={electricityKwh}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('naturalGas')} (m³)
            </label>
            <input
              type="number"
              bind:value={gasM3}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('heatingOil')} (L)
            </label>
            <input
              type="number"
              bind:value={heatingLiters}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>
        </div>
      </div>

      <!-- Lifestyle Section -->
      <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 class="text-lg font-medium text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.13 1.33l-12.44 1.62"/></svg> {t('lifestyle')}
        </h3>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('dietType')}
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            {#each (['meat', 'average', 'vegetarian', 'vegan'] as const) as diet (diet)}
<button 
                onclick={() => dietType = diet}
                class={`px-4 py-2 rounded-lg border transition-colors ${
                  dietType === diet
                    ? 'btn-success border-green-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {t(`diets.${diet}`)}
              </button>
{/each}
          </div>
        </div>
      </div>

      <!-- Results -->
      {#if results}
<div class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t('results')} ({period === 'yearly' ? t('yearly') : t('monthly')})
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg> {t('transportation')}</div>
              <div class="text-xl font-bold text-amber-600">{results.transport.toFixed(2)} t</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg> {t('homeEnergy')}</div>
              <div class="text-xl font-bold text-yellow-600">{results.energy.toFixed(2)} t</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.13 1.33l-12.44 1.62"/></svg> {t('lifestyle')}</div>
              <div class="text-xl font-bold text-green-600">{results.lifestyle.toFixed(2)} t</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg text-center">
              <div class="text-sm text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> {t('total')}</div>
              <div class={`text-2xl font-bold ${getEmissionLevel(results.total).color}`}>
                {results.total.toFixed(2)} t CO₂
              </div>
              <div class={`text-sm ${getEmissionLevel(results.total).color}`}>
                {getEmissionLevel(results.total).level}
              </div>
            </div>
          </div>

          <div class="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div class="flex items-center gap-3">
              <span class="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7l-2-2"/><path d="M17 8v.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8h0a5 5 0 0 1 10 0Z"/><path d="m14 14-2 2"/></svg></span>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('treesNeeded')}</div>
                <div class="text-xl font-bold text-green-700 dark:text-green-400">
                  {results.treesNeeded} {t('trees')}
                </div>
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
