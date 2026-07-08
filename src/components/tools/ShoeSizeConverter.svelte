<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['shoe-size-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.shoe-size-converter.${key}`;
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
  getShoeSizes, 
  sizeSystemNames, 
  type SizeSystem, 
  type Gender,
  type ShoeSizeRow 
} from '@/lib/data/shoe-sizes';

  let gender = $state('men');

  let selectedSize = $state(null);

  let fromSystem = $state('us_men');

  // Functions
  const sizes = getShoeSizes(gender);
  const systems: SizeSystem[] = ['us_men', 'us_women', 'uk', 'eu', 'jp', 'cn'];
  const matchingRow = selectedSize !== null 
    ? sizes.find(row => Math.abs(row[fromSystem] - selectedSize) < 0.5)
    : null;
  function handleGenderChange(newGender: Gender) {
    gender = newGender;
    selectedSize = null;
  }
  function handleSystemChange(system: SizeSystem) {
    fromSystem = system;
    selectedSize = null;
  }

</script>


    <div class="space-y-6">
      <!-- Gender Selection -->
      <div>
        <div class="tool-label">
          {t('gender')}
        </div>
        <div class="flex gap-2">
          <button
            onclick={() => handleGenderChange('men')}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gender === 'men'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('men')}
          </button>
          <button
            onclick={() => handleGenderChange('women')}
            class={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gender === 'women'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('women')}
          </button>
        </div>
      </div>

      <!-- Size System Selection -->
      <div>
        <div class="tool-label">
          {t('selectSystem')}
        </div>
        <div class="flex flex-wrap gap-2">
          {#each systems as system (system)}
<button 
              onclick={() => handleSystemChange(system)}
              class={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                fromSystem === system
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {sizeSystemNames[system]}
            </button>
{/each}
        </div>
      </div>

      <!-- Size Selection -->
      <div>
        <div class="tool-label">
          {t('selectSize')} ({sizeSystemNames[fromSystem]})
        </div>
        <div class="flex flex-wrap gap-2">
          {#each sizes as row, idx (idx)}
<button 
              onclick={() => selectedSize = row[fromSystem]}
              class={`px-3 py-2 rounded-lg font-medium transition-colors min-w-[50px] ${
                selectedSize === row[fromSystem]
                  ? 'btn-success'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {row[fromSystem]}
            </button>
{/each}
        </div>
      </div>

      <!-- Conversion Results -->
      {#if matchingRow}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('conversionResults')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {#each systems as system (system)}
<div 
                class={`p-4 rounded-lg text-center ${
                  system === fromSystem
                    ? 'bg-amber-100 dark:bg-amber-900 border-2 border-amber-500'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {sizeSystemNames[system]}
                </div>
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  {matchingRow[system]}
                </div>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Size Chart Table -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('sizeChart')} - {gender === 'men' ? t('men') : t('women')}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-600">
                {#each systems as system (system)}
<th  class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    {sizeSystemNames[system]}
                  </th>
{/each}
              </tr>
            </thead>
            <tbody>
              {#each sizes as row, idx (idx)}
<tr  
                  class={`border-b border-gray-100 dark:border-gray-700 ${
                    matchingRow === row ? 'bg-amber-50 dark:bg-amber-900/30' : ''
                  }`}
                >
                  {#each systems as system (system)}
<td  class="px-3 py-2 text-gray-900 dark:text-white">
                      {row[system]}
                    </td>
{/each}
                </tr>
{/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tips -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
        <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          {t('tips')}
        </h4>
        <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
