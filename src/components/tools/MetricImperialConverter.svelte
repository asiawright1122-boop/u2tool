<script lang="ts">
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

  const categoryIcons: Record<ConversionCategory, string> = {
    length: '📏',
    weight: '⚖️',
    volume: '🧪',
    temperature: '🌡️',
    area: '▦',
    speed: '⚡',
  };

  const conversions: Record<ConversionCategory, Record<string, ConversionUnit>> = {
    length: {
      meter: { name: 'Meter', symbol: 'm', system: 'metric', toBase: (value) => value, fromBase: (value) => value },
      kilometer: { name: 'Kilometer', symbol: 'km', system: 'metric', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      centimeter: { name: 'Centimeter', symbol: 'cm', system: 'metric', toBase: (value) => value / 100, fromBase: (value) => value * 100 },
      inch: { name: 'Inch', symbol: 'in', system: 'imperial', toBase: (value) => value * 0.0254, fromBase: (value) => value / 0.0254 },
      foot: { name: 'Foot', symbol: 'ft', system: 'imperial', toBase: (value) => value * 0.3048, fromBase: (value) => value / 0.3048 },
      yard: { name: 'Yard', symbol: 'yd', system: 'imperial', toBase: (value) => value * 0.9144, fromBase: (value) => value / 0.9144 },
      mile: { name: 'Mile', symbol: 'mi', system: 'imperial', toBase: (value) => value * 1609.344, fromBase: (value) => value / 1609.344 },
    },
    weight: {
      kilogram: { name: 'Kilogram', symbol: 'kg', system: 'metric', toBase: (value) => value, fromBase: (value) => value },
      gram: { name: 'Gram', symbol: 'g', system: 'metric', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      tonne: { name: 'Tonne', symbol: 't', system: 'metric', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      ounce: { name: 'Ounce', symbol: 'oz', system: 'imperial', toBase: (value) => value * 0.028349523125, fromBase: (value) => value / 0.028349523125 },
      pound: { name: 'Pound', symbol: 'lb', system: 'imperial', toBase: (value) => value * 0.45359237, fromBase: (value) => value / 0.45359237 },
      stone: { name: 'Stone', symbol: 'st', system: 'imperial', toBase: (value) => value * 6.35029318, fromBase: (value) => value / 6.35029318 },
    },
    volume: {
      liter: { name: 'Liter', symbol: 'L', system: 'metric', toBase: (value) => value, fromBase: (value) => value },
      milliliter: { name: 'Milliliter', symbol: 'mL', system: 'metric', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      cubicMeter: { name: 'Cubic meter', symbol: 'm³', system: 'metric', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      fluidOunce: { name: 'Fluid ounce', symbol: 'fl oz', system: 'imperial', toBase: (value) => value * 0.0295735295625, fromBase: (value) => value / 0.0295735295625 },
      pint: { name: 'Pint', symbol: 'pt', system: 'imperial', toBase: (value) => value * 0.473176473, fromBase: (value) => value / 0.473176473 },
      gallon: { name: 'Gallon', symbol: 'gal', system: 'imperial', toBase: (value) => value * 3.785411784, fromBase: (value) => value / 3.785411784 },
    },
    temperature: {
      celsius: { name: 'Celsius', symbol: '°C', system: 'metric', toBase: (value) => value, fromBase: (value) => value },
      kelvin: { name: 'Kelvin', symbol: 'K', system: 'metric', toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 },
      fahrenheit: { name: 'Fahrenheit', symbol: '°F', system: 'imperial', toBase: (value) => (value - 32) * 5 / 9, fromBase: (value) => value * 9 / 5 + 32 },
      rankine: { name: 'Rankine', symbol: '°R', system: 'imperial', toBase: (value) => (value - 491.67) * 5 / 9, fromBase: (value) => (value + 273.15) * 9 / 5 },
    },
    area: {
      squareMeter: { name: 'Square meter', symbol: 'm²', system: 'metric', toBase: (value) => value, fromBase: (value) => value },
      squareKilometer: { name: 'Square kilometer', symbol: 'km²', system: 'metric', toBase: (value) => value * 1_000_000, fromBase: (value) => value / 1_000_000 },
      hectare: { name: 'Hectare', symbol: 'ha', system: 'metric', toBase: (value) => value * 10_000, fromBase: (value) => value / 10_000 },
      squareFoot: { name: 'Square foot', symbol: 'ft²', system: 'imperial', toBase: (value) => value * 0.09290304, fromBase: (value) => value / 0.09290304 },
      squareYard: { name: 'Square yard', symbol: 'yd²', system: 'imperial', toBase: (value) => value * 0.83612736, fromBase: (value) => value / 0.83612736 },
      acre: { name: 'Acre', symbol: 'ac', system: 'imperial', toBase: (value) => value * 4046.8564224, fromBase: (value) => value / 4046.8564224 },
    },
    speed: {
      meterPerSecond: { name: 'Meter per second', symbol: 'm/s', system: 'metric', toBase: (value) => value, fromBase: (value) => value },
      kilometerPerHour: { name: 'Kilometer per hour', symbol: 'km/h', system: 'metric', toBase: (value) => value / 3.6, fromBase: (value) => value * 3.6 },
      footPerSecond: { name: 'Foot per second', symbol: 'ft/s', system: 'imperial', toBase: (value) => value * 0.3048, fromBase: (value) => value / 0.3048 },
      milePerHour: { name: 'Mile per hour', symbol: 'mph', system: 'imperial', toBase: (value) => value * 0.44704, fromBase: (value) => value / 0.44704 },
      knot: { name: 'Knot', symbol: 'kn', system: 'imperial', toBase: (value) => value * 0.514444, fromBase: (value) => value / 0.514444 },
    },
  };

  let category = $state<ConversionCategory>('length');

  let fromUnit = $state('meter');

  let toUnit = $state('foot');

  let inputValue = $state('1');

  let result = $state<number | null>(null);

  const categoryUnits = $derived(conversions[category]);
  const metricUnits = $derived(Object.entries(categoryUnits).filter(([, unit]) => unit.system === 'metric'));
  const imperialUnits = $derived(Object.entries(categoryUnits).filter(([, unit]) => unit.system === 'imperial'));

  $effect(() => {
    if (categoryUnits[fromUnit] && categoryUnits[toUnit]) {
      return;
    }

    const units = Object.keys(categoryUnits);
    const metricUnit = units.find(unit => categoryUnits[unit].system === 'metric') || units[0];
    const imperialUnit = units.find(unit => categoryUnits[unit].system === 'imperial') || units[1] || metricUnit;
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

    const fromConversion = categoryUnits[fromUnit];
    const toConversion = categoryUnits[toUnit];

    if (!fromConversion || !toConversion) {
      result = null;
      return;
    }

    const baseValue = fromConversion.toBase(value);
    const convertedValue = toConversion.fromBase(baseValue);
    result = convertedValue;
  }
  function handleSwap() {
    const previousFromUnit = fromUnit;
    fromUnit = toUnit;
    toUnit = previousFromUnit;
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
</script>


    <div class="space-y-6">
      <!-- Category Selection -->
      <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
        {#each (Object.keys(conversions) as ConversionCategory[]) as cat (cat)}
<button 
            onclick={() => category = cat}
            class={`p-3 rounded-lg border transition-colors text-center ${
              category === cat
                ? 'bg-amber-600 text-white border-amber-600'
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
          <label for="metric-imperial-converter-field-3" class="tool-label">
            {t('from')}
          </label>
          <input
            type="number"
            bind:value={inputValue}
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg mb-2"
            placeholder="1" id="metric-imperial-converter-field-3" />
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
          <div class="tool-label">
            {t('to')}
          </div>
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
<div class="p-6 bg-gradient-to-r from-amber-50 to-slate-50 dark:from-amber-900/20 dark:to-slate-900/20 rounded-xl text-center">
          <div class="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {inputValue} {categoryUnits[fromUnit]?.symbol} =
          </div>
          <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">
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
          <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <h4 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('metric')}</h4>
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
  
