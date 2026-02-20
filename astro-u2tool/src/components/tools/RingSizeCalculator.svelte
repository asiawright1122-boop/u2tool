<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ring-size-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ring-size-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { 
  ringSizes, 
  ringSizeSystemNames,
  calculateRingSizeFromMeasurement,
  measurementTips,
  type RingSizeSystem,
  type RingSizeRow 
} from '@/lib/data/ring-sizes';

  let mode = $state('convert');

  let selectedUS = $state(null);

  let measurement = $state('');

  let measureType = $state('circumference');

  // Functions
  const systems: RingSizeSystem[] = ['us', 'uk', 'eu', 'jp', 'diameter', 'circumference'];
  const matchingRow = selectedUS !== null 
    ? ringSizes.find(row => row.us === selectedUS)
    : null;
  const calculatedRow = measurement 
    ? calculateRingSizeFromMeasurement(parseFloat(measurement), measureType)
    : null;
  const displayRow = mode === 'convert' ? matchingRow : calculatedRow;

</script>


    <div class="space-y-6">
      <!-- Mode Selection -->
      <div class="flex gap-2">
        <button
          onclick={() => mode = 'convert'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'convert'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('convertMode')}
        </button>
        <button
          onclick={() => mode = 'measure'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'measure'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('measureMode')}
        </button>
      </div>

      {#if mode === 'convert'}
<!-- Size Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectUSSize')}
          </label>
          <div class="flex flex-wrap gap-2">
            {#each ringSizes as row}
<button
                onclick={() => selectedUS = row.us}
                class={`px-3 py-2 rounded-lg font-medium transition-colors min-w-[50px] ${
                  selectedUS === row.us
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {row.us}
              </button>
{/each}
          </div>
        </div>}
{:else}
<!-- Measurement Input -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('measurementType')}
            </label>
            <div class="flex gap-2">
              <button
                onclick={() => measureType = 'circumference'}
                class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  measureType === 'circumference'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('circumference')}
              </button>
              <button
                onclick={() => measureType = 'diameter'}
                class={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  measureType === 'diameter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('diameter')}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('enterMeasurement')} (mm)
            </label>
            <input
              type="number"
              bind:value={measurement}
              placeholder={measureType === 'circumference' ? '44-75' : '14-24'}
              step="0.1"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>}
{/if}

      <!-- Conversion Results -->
      {#if displayRow}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('yourRingSize')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {#each systems as system (system)}
<div 
                class="p-4 rounded-lg text-center bg-white dark:bg-gray-700"
              >
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {ringSizeSystemNames[system]}
                </div>
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  {displayRow[system as keyof RingSizeRow]}
                </div>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Size Chart Table -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('sizeChart')}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-600">
                {#each systems as system (system)}
<th  class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    {ringSizeSystemNames[system]}
                  </th>
{/each}
              </tr>
            </thead>
            <tbody>
              {#each ringSizes as row, idx (idx)}
<tr  
                  class={`border-b border-gray-100 dark:border-gray-700 ${
                    displayRow === row ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  {#each systems as system (system)}
<td  class="px-3 py-2 text-gray-900 dark:text-white">
                      {row[system as keyof RingSizeRow]}
                    </td>
{/each}
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Measurement Tips -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
        <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          {t('measurementTips')}
        </h4>
        <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
          {#each measurementTips as tip, idx (idx)}
<li >{tip}</li>
{/each}
        </ul>
      </div>
    </div>
  
