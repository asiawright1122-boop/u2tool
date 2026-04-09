<script lang="ts">
  import { conversions } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['metric-imperial-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.metric-imperial-converter.${key}`;
  }

  // Types
  type ConversionCategory = 'length' | 'weight' | 'volume' | 'temperature' | 'area' | 'speed';
  interface ConversionUnit {
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
  symbol: string;
  system: 'metric' | 'imperial';
}

  let category = $state('length');

  let fromUnit = $state('meter');

  let toUnit = $state('foot');

  let inputValue = $state('1');

  let result = $state(null);

  $effect(() => {
    const units = Object.keys(conversions[category]);
    const metricUnit = units.find(u => conversions[category][u].system === 'metric') || units[0];
    const imperialUnit = units.find(u => conversions[category][u].system === 'imperial') || units[1];
    fromUnit = metricUnit;
    toUnit = imperialUnit;
  });

  $effect(() => {
    convert();
  });

  // Functions
  function convert() {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      result = null;
      return;
    }

    const fromConversion = conversions[category][fromUnit];
    const toConversion = conversions[category][toUnit];

    if (!fromConversion || !toConversion) {
      result = null;
      return;
    }

    const baseValue = fromConversion.toBase(value);
    const convertedValue = toConversion.fromBase(baseValue);
    result = convertedValue;
  }
  function handleSwap() {
    fromUnit = toUnit;
    toUnit = fromUnit;
    if (result !== null) {
      inputValue = result.toString();
    }
  }
  function formatResult(value: number): string {
    if (Math.abs(value) < 0.0001 || Math.abs(value) >= 1000000) {
      return value.toExponential(6);
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 6 });
  }
  const categoryUnits = conversions[category];
  const metricUnits = Object.entries(categoryUnits).filter(([, u]) => u.system === 'metric');
  const imperialUnits = Object.entries(categoryUnits).filter(([, u]) => u.system === 'imperial');

</script>


    <div class="space-y-6">
      <!-- Category Selection -->
      <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
        {#each (Object.keys(conversions) as ConversionCategory[]) as cat (cat)}
<button 
            onclick={() => category = cat}
            class={`p-3 rounded-lg border transition-colors text-center ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div class="text-2xl mb-1">{categoryIcons[cat]}</div>
            <div class="text-xs font-medium">{t(`categories.${cat}`)}</div>
          </button>
{/each}
      </div>

      <!-- Converter -->
      <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('from')}
          </label>
          <input
            type="number"
            bind:value={inputValue}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg mb-2"
            placeholder="1"
          />
          <select
            bind:value={fromUnit}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('metric')}>
              {#each metricUnits as [key, unit] (key)}
<option  value={key}>{unit.name} ({unit.symbol})</option>
{/each}
            </optgroup>
            <optgroup label={t('imperial')}>
              {#each imperialUnits as [key, unit] (key)}
<option  value={key}>{unit.name} ({unit.symbol})</option>
{/each}
            </optgroup>
          </select>
        </div>

        <button
          onclick={handleSwap}
          class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors self-center mb-6"
          title={t('swap')}
        >
          <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
        </button>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('to')}
          </label>
          <div class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg mb-2 min-h-[52px] flex items-center">
            {result !== null ? formatResult(result) : '-'}
          </div>
          <select
            bind:value={toUnit}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <optgroup label={t('metric')}>
              {#each metricUnits as [key, unit] (key)}
<option  value={key}>{unit.name} ({unit.symbol})</option>
{/each}
            </optgroup>
            <optgroup label={t('imperial')}>
              {#each imperialUnits as [key, unit] (key)}
<option  value={key}>{unit.name} ({unit.symbol})</option>
{/each}
            </optgroup>
          </select>
        </div>
      </div>

      <!-- Result Display -->
      {#if result !== null}
<div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl text-center">
          <div class="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {inputValue} {categoryUnits[fromUnit]?.symbol} =
          </div>
          <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {formatResult(result)} {categoryUnits[toUnit]?.symbol}
          </div>
        </div>
{/if}

      <!-- Quick Reference -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">
          {t('quickReference')}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('metric')}</h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {#each metricUnits as [key, unit] (key)}
<li >{unit.name} ({unit.symbol})</li>
{/each}
            </ul>
          </div>
          <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <h4 class="font-medium text-orange-800 dark:text-orange-300 mb-2">{t('imperial')}</h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {#each imperialUnits as [key, unit] (key)}
<li >{unit.name} ({unit.symbol})</li>
{/each}
            </ul>
          </div>
        </div>
      </div>
    </div>
  
