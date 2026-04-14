<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['bmi-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.bmi-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateBmi, type BmiResult } from '@/lib/calculator-utils';

  let weight = $state('70');

  let height = $state('170');

  let unit = $state('metric');

  let result = $state(null);

  // Functions
  function calculate() {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return;
    }

    const res = calculateBmi({ weight: w, height: h, unit });
    result = res;
  }
  function getCategoryColor(category: string) {
    switch (category) {
      case 'underweight': return 'text-amber-600 dark:text-amber-400';
      case 'normal': return 'text-green-600 dark:text-green-400';
      case 'overweight': return 'text-yellow-600 dark:text-yellow-400';
      case 'obese': return 'text-red-600 dark:text-red-400';
      default: return '';
    }
  }
  function getCategoryBg(category: string) {
    switch (category) {
      case 'underweight': return 'bg-amber-50 dark:bg-amber-900/20';
      case 'normal': return 'bg-green-50 dark:bg-green-900/20';
      case 'overweight': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'obese': return 'bg-red-50 dark:bg-red-900/20';
      default: return '';
    }
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-4 mb-4">
        <button
          onclick={() => unit = 'metric'}
          class={`px-4 py-2 rounded-lg transition-colors ${
            unit === 'metric'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('metric')}
        </button>
        <button
          onclick={() => unit = 'imperial'}
          class={`px-4 py-2 rounded-lg transition-colors ${
            unit === 'imperial'
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('imperial')}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="bmi-weight" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            id="bmi-weight"
            name="weightValue"
            type="number"
            bind:value={weight}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder={unit === 'metric' ? '70' : '154'}
          />
        </div>

        <div>
          <label for="bmi-height" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('height')} ({unit === 'metric' ? 'cm' : 'inches'})
          </label>
          <input
            id="bmi-height"
            name="heightValue"
            type="number"
            bind:value={height}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder={unit === 'metric' ? '170' : '67'}
          />
        </div>
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if result}
<div class="space-y-4">
          <div class={`p-6 rounded-lg ${getCategoryBg(result.category)}`}>
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">{result.bmi.toFixed(1)}</div>
              <div class={`text-xl font-semibold ${getCategoryColor(result.category)}`}>
                {t(result.category)}
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="font-semibold mb-2">{t('healthyWeightRange')}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {result.healthyWeightRange.min.toFixed(1)} - {result.healthyWeightRange.max.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
            </p>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="font-semibold mb-2">{t('bmiCategories')}</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-amber-600">{t('underweight')}</span>
                <span>&lt; 18.5</span>
              </div>
              <div class="flex justify-between">
                <span class="text-green-600">{t('normal')}</span>
                <span>18.5 - 24.9</span>
              </div>
              <div class="flex justify-between">
                <span class="text-yellow-600">{t('overweight')}</span>
                <span>25 - 29.9</span>
              </div>
              <div class="flex justify-between">
                <span class="text-red-600">{t('obese')}</span>
                <span>&ge; 30</span>
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
