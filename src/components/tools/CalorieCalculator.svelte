<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['calorie-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.calorie-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Calculator, Activity, Scale, Ruler } from 'lucide-svelte';

  // Types
  type Gender = 'male' | 'female';
  type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  type Unit = 'metric' | 'imperial';
  interface CalorieResult {
  bmr: number;
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
}

  let gender = $state('male');

  let age = $state('30');

  let unit = $state('metric');

  let height = $state('175');

  let heightFeet = $state('5');

  let heightInches = $state('9');

  let weight = $state('70');

  let activityLevel = $state('moderate');

  let result = $derived.by(() => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    
    if (isNaN(ageNum) || isNaN(weightNum) || ageNum <= 0 || weightNum <= 0) {
      return null;
    }

    let heightCm: number;
    let weightKg: number;

    if (unit === 'metric') {
      heightCm = parseFloat(height);
      weightKg = weightNum;
    } else {
      // Convert imperial to metric
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightCm = (feet * 12 + inches) * 2.54;
      weightKg = weightNum * 0.453592;
    }

    if (isNaN(heightCm) || heightCm <= 0) {
      return null;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }

    const maintenance = bmr * ACTIVITY_MULTIPLIERS[activityLevel];

    return {
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      mildLoss: Math.round(maintenance - 250),      // 0.25 kg/week
      weightLoss: Math.round(maintenance - 500),    // 0.5 kg/week
      extremeLoss: Math.round(maintenance - 1000),  // 1 kg/week
      mildGain: Math.round(maintenance + 250),      // 0.25 kg/week
      weightGain: Math.round(maintenance + 500)     // 0.5 kg/week
    };
  });

</script>


    <div class="space-y-6">
      <!-- Unit Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => unit = 'metric'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'metric'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('metric')}
        </button>
        <button
          onclick={() => unit = 'imperial'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            unit === 'imperial'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('imperial')}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Gender -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('gender')}
          </label>
          <div class="flex gap-2">
            <button
              onclick={() => gender = 'male'}
              class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                gender === 'male'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('male')}
            </button>
            <button
              onclick={() => gender = 'female'}
              class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                gender === 'female'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('female')}
            </button>
          </div>
        </div>

        <!-- Age -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('age')}
          </label>
          <input
            type="number"
            bind:value={age}
            min="1"
            max="120"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <!-- Height -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Ruler class="w-4 h-4" />
            {t('height')} ({unit === 'metric' ? 'cm' : 'ft/in'})
          </label>
          {#if unit === 'metric'}
<input
              type="number"
              bind:value={height}
              min="50"
              max="300"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
{:else}
<div class="flex gap-2">
              <input
                type="number"
                bind:value={heightFeet}
                min="1"
                max="8"
                placeholder="ft"
                class="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                bind:value={heightInches}
                min="0"
                max="11"
                placeholder="in"
                class="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
{/if}
        </div>

        <!-- Weight -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Scale class="w-4 h-4" />
            {t('weight')} ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            bind:value={weight}
            min="20"
            max="500"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Activity Level -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Activity class="w-4 h-4" />
          {t('activityLevel')}
        </label>
        <select
          value={activityLevel}
          onchange={(e) => activityLevel = e.target.value as ActivityLevel}
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="sedentary">{t('sedentary')}</option>
          <option value="light">{t('light')}</option>
          <option value="moderate">{t('moderate')}</option>
          <option value="active">{t('active')}</option>
          <option value="very_active">{t('veryActive')}</option>
        </select>
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-4">
          <!-- BMR -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <Calculator class="w-5 h-5 text-gray-500" />
              <span class="font-medium text-gray-700 dark:text-gray-300">{t('bmr')}</span>
            </div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">
              {result.bmr.toLocaleString()} <span class="text-lg font-normal">{t('caloriesPerDay')}</span>
            </div>
            <p class="text-sm text-gray-500 mt-1">{t('bmrDescription')}</p>
          </div>

          <!-- Maintenance -->
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div class="font-medium text-blue-700 dark:text-blue-300 mb-2">{t('maintenance')}</div>
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {result.maintenance.toLocaleString()} <span class="text-lg font-normal">{t('caloriesPerDay')}</span>
            </div>
          </div>

          <!-- Weight Loss Options -->
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div class="font-medium text-green-700 dark:text-green-300 mb-3">{t('weightLoss')}</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{t('mildLoss')}</span>
                <span class="font-semibold text-green-600 dark:text-green-400">{result.mildLoss.toLocaleString()} cal</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{t('moderateLoss')}</span>
                <span class="font-semibold text-green-600 dark:text-green-400">{result.weightLoss.toLocaleString()} cal</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{t('extremeLoss')}</span>
                <span class="font-semibold text-green-600 dark:text-green-400">{result.extremeLoss.toLocaleString()} cal</span>
              </div>
            </div>
          </div>

          <!-- Weight Gain Options -->
          <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div class="font-medium text-orange-700 dark:text-orange-300 mb-3">{t('weightGain')}</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{t('mildGain')}</span>
                <span class="font-semibold text-orange-600 dark:text-orange-400">{result.mildGain.toLocaleString()} cal</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{t('moderateGain')}</span>
                <span class="font-semibold text-orange-600 dark:text-orange-400">{result.weightGain.toLocaleString()} cal</span>
              </div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
