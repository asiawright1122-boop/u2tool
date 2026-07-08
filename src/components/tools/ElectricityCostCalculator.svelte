<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['electricity-cost-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.electricity-cost-calculator.${key}`;
  }

  // Imports
  import { Zap, Clock, DollarSign, Plus, Trash2 } from 'lucide-svelte';
  import { CURRENCY_SYMBOLS } from '@/lib/tool-stubs';

  // Types
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

  let appliances = $state([
    { id: '1', name: '', wattage: 10, hoursPerDay: 8 },
  ]);

  let electricityRate = $state('0.12');

  let initialized = $state(false);

  let result = $derived.by(() => {
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
  });

  // Functions
  const PRESET_APPLIANCE_KEYS = [
    { key: 'ledBulb', wattage: 9 },
    { key: 'incandescentBulb', wattage: 60 },
    { key: 'laptop', wattage: 65 },
    { key: 'desktop', wattage: 250 },
    { key: 'tv', wattage: 120 },
    { key: 'refrigerator', wattage: 150 },
    { key: 'airConditioner', wattage: 1500 },
    { key: 'spaceHeater', wattage: 1500 },
    { key: 'washingMachine', wattage: 500 },
    { key: 'dryer', wattage: 3000 },
    { key: 'microwave', wattage: 1000 },
    { key: 'electricOven', wattage: 2400 },
  ] as const;
  const currencySymbol = CURRENCY_SYMBOLS.USD || '$';
  /*


    <div class="space-y-6">
      <!-- Electricity Rate -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <DollarSign class="w-4 h-4" />
          {t('electricityRate')} ({currencySymbol}/kWh)
        </label>
        <input
          type="number"
          bind:value={electricityRate}
          min="0"
          step="0.01"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Appliances List -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="tool-label">
            {t('appliances')} ({appliances.length})
          </label>
        </div>

        {#each appliances as appliance (appliance.id)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <input
                type="text"
                value={appliance.name}
                onchange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
                class="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onclick={() => removeAppliance(appliance.id)}
                disabled={appliances.length === 1}
                class="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-gray-500 flex items-center gap-1">
                  <Zap class="w-3 h-3" />
                  {t('wattage')} (W)
                </label>
                <input
                  type="number"
                  value={appliance.wattage}
                  onchange={(e) => updateAppliance(appliance.id, 'wattage', parseFloat(e.target.value) || 0)}
                  min="0"
                  class="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-500 flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  {t('hoursPerDay')}
                </label>
                <input
                  type="number"
                  value={appliance.hoursPerDay}
                  onchange={(e) => updateAppliance(appliance.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="24"
                  step="0.5"
                  class="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
{/each}

        <!-- Add Appliance -->
        <div class="space-y-2">
          <button
            onclick={() => addAppliance()}
            class="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
          >
            <Plus class="w-4 h-4" />
            {t('addAppliance')}
          </button>

          <!-- Preset Appliances -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-gray-500">{t('presets')}:</span>
            {#each PRESET_APPLIANCE_KEYS.slice(0, 8) as preset, index (index)}
<button 
                onclick={() => addAppliance(preset)}
                class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t(`appliance.${preset.key}`)}
              </button>
{/each}
          </div>
        </div>
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- Energy Consumption -->
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 class="font-medium text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
              <Zap class="w-5 h-5" />
              {t('energyConsumption')}
            </h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.dailyKwh}</div>
                <div class="text-sm text-gray-500">kWh/{t('day')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.monthlyKwh}</div>
                <div class="text-sm text-gray-500">kWh/{t('month')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.yearlyKwh}</div>
                <div class="text-sm text-gray-500">kWh/{t('year')}</div>
              </div>
            </div>
          </div>

          <!-- Cost -->
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 class="font-medium text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
              <DollarSign class="w-5 h-5" />
              {t('estimatedCost')}
            </h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.dailyCost}</div>
                <div class="text-sm text-gray-500">{t('perDay')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.monthlyCost}</div>
                <div class="text-sm text-gray-500">{t('perMonth')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.yearlyCost}</div>
                <div class="text-sm text-gray-500">{t('perYear')}</div>
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
*/
  function addAppliance(preset?: { key: string; wattage: number }) {
    const newAppliance: Appliance = {
      id: Date.now().toString(),
      name: preset ? t(`appliance.${preset.key}`) : t('newAppliance'),
      wattage: preset?.wattage || 100,
      hoursPerDay: 1,
    };
    appliances = [...appliances, newAppliance];
  }
  function removeAppliance(id: string) {
    if (appliances.length > 1) {
      appliances = appliances.filter(a => a.id !== id);
    }
  }
  function updateAppliance(id: string, field: keyof Appliance, value: string | number) {
    appliances = appliances.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
  }

</script>


    <div class="space-y-6">
      <!-- Electricity Rate -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <DollarSign class="w-4 h-4" />
          {t('electricityRate')} ({currencySymbol}/kWh)
        </label>
        <input
          type="number"
          bind:value={electricityRate}
          min="0"
          step="0.01"
          class="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Appliances List -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="tool-label">
            {t('appliances')} ({appliances.length})
          </div>
        </div>

        {#each appliances as appliance (appliance.id)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <input
                type="text"
                value={appliance.name}
                onchange={(e) => updateAppliance(appliance.id, 'name', e.target.value)}
                class="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onclick={() => removeAppliance(appliance.id)}
                disabled={appliances.length === 1}
                class="ml-2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-gray-500 flex items-center gap-1">
                  <Zap class="w-3 h-3" />
                  {t('wattage')} (W)
                </label>
                <input
                  type="number"
                  value={appliance.wattage}
                  onchange={(e) => updateAppliance(appliance.id, 'wattage', parseFloat(e.target.value) || 0)}
                  min="0"
                  class="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-500 flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  {t('hoursPerDay')}
                </label>
                <input
                  type="number"
                  value={appliance.hoursPerDay}
                  onchange={(e) => updateAppliance(appliance.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                  min="0"
                  max="24"
                  step="0.5"
                  class="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
{/each}

        <!-- Add Appliance -->
        <div class="space-y-2">
          <button
            onclick={() => addAppliance()}
            class="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
          >
            <Plus class="w-4 h-4" />
            {t('addAppliance')}
          </button>

          <!-- Preset Appliances -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-gray-500">{t('presets')}:</span>
            {#each PRESET_APPLIANCE_KEYS.slice(0, 8) as preset, index (index)}
<button 
                onclick={() => addAppliance(preset)}
                class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t(`appliance.${preset.key}`)}
              </button>
{/each}
          </div>
        </div>
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- Energy Consumption -->
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 class="font-medium text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
              <Zap class="w-5 h-5" />
              {t('energyConsumption')}
            </h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.dailyKwh}</div>
                <div class="text-sm text-gray-500">kWh/{t('day')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.monthlyKwh}</div>
                <div class="text-sm text-gray-500">kWh/{t('month')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.yearlyKwh}</div>
                <div class="text-sm text-gray-500">kWh/{t('year')}</div>
              </div>
            </div>
          </div>

          <!-- Cost -->
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 class="font-medium text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
              <DollarSign class="w-5 h-5" />
              {t('estimatedCost')}
            </h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.dailyCost}</div>
                <div class="text-sm text-gray-500">{t('perDay')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.monthlyCost}</div>
                <div class="text-sm text-gray-500">{t('perMonth')}</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{currencySymbol}{result.yearlyCost}</div>
                <div class="text-sm text-gray-500">{t('perYear')}</div>
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
