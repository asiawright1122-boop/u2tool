<script lang="ts">
  import { bandConversions, cupSizes, euCupSizes } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['bra-size-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.bra-size-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type SizeSystem = 'us' | 'uk' | 'eu' | 'fr' | 'au' | 'jp';
  interface BraSize {
  band: number;
  cup: string;
}

  let mode = $state('calculate');

  let underbust = $state('');

  let bust = $state('');

  let unit = $state('cm');

  let selectedBand = $state(null);

  let selectedCup = $state(null);

  // Functions
  function calculateSize(): BraSize | null {
    const underVal = parseFloat(underbust);
    const bustVal = parseFloat(bust);
    
    if (isNaN(underVal) || isNaN(bustVal)) return null;
    
    // Convert to inches if needed
    const underInch = unit === 'cm' ? underVal / 2.54 : underVal;
    const bustInch = unit === 'cm' ? bustVal / 2.54 : bustVal;
    
    // Calculate band size (round to nearest even number)
    let band = Math.round(underInch);
    if (band % 2 !== 0) band += 1;
    if (band < 28) band = 28;
    if (band > 46) band = 46;
    
    // Calculate cup size
    const diff = bustInch - underInch;
    let cupIndex = Math.round(diff) - 1;
    if (cupIndex < 0) cupIndex = 0;
    if (cupIndex >= cupSizes.length) cupIndex = cupSizes.length - 1;
    
    return { band, cup: cupSizes[cupIndex] };
  }
  const calculatedSize = calculateSize();
  const displayBand = mode === 'calculate' ? calculatedSize?.band : selectedBand;
  const displayCup = mode === 'calculate' ? calculatedSize?.cup : selectedCup;
  function getConvertedSizes() {
    if (!displayBand || !displayCup) return null;
    
    const bandData = bandConversions[displayBand];
    if (!bandData) return null;
    
    const cupIndex = cupSizes.indexOf(displayCup);
    
    return {
      us: `${bandData.us}${displayCup}`,
      uk: `${bandData.uk}${displayCup}`,
      eu: `${bandData.eu}${euCupSizes[cupIndex] || displayCup}`,
      fr: `${bandData.fr}${euCupSizes[cupIndex] || displayCup}`,
      au: `${bandData.au}${displayCup}`,
      jp: `${bandData.jp}${euCupSizes[cupIndex] || displayCup}`,
    };
  }
  const convertedSizes = getConvertedSizes();

</script>


    <div class="space-y-6">
      <!-- Mode Selection -->
      <div class="flex gap-2">
        <button
          onclick={() => mode = 'calculate'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'calculate'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculateMode')}
        </button>
        <button
          onclick={() => mode = 'convert'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'convert'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('convertMode')}
        </button>
      </div>

      {#if mode === 'calculate'}
<!-- Measurement Input -->
        <div class="space-y-4">
          <div class="flex gap-2 mb-4">
            <button
              onclick={() => unit = 'cm'}
              class={`px-3 py-1 rounded text-sm ${
                unit === 'cm' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              cm
            </button>
            <button
              onclick={() => unit = 'inch'}
              class={`px-3 py-1 rounded text-sm ${
                unit === 'inch' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              inches
            </button>
          </div>
          
          <div>
            <label class="tool-label">
              {t('underbust')} ({unit})
            </label>
            <input
              type="number"
              bind:value={underbust}
              placeholder={unit === 'cm' ? '70-120' : '28-46'}
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p class="text-xs text-gray-500 mt-1">{t('underbustHelp')}</p>
          </div>
          
          <div>
            <label class="tool-label">
              {t('bust')} ({unit})
            </label>
            <input
              type="number"
              bind:value={bust}
              placeholder={unit === 'cm' ? '80-140' : '32-54'}
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p class="text-xs text-gray-500 mt-1">{t('bustHelp')}</p>
          </div>
        </div>}
{:else}
<!-- Size Selection -->
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('selectBand')}
            </label>
            <div class="flex flex-wrap gap-2">
              {#each Object.keys(bandConversions) as band}
<button
                  onclick={() => selectedBand = parseInt(band)}
                  class={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedBand === parseInt(band)
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {band}
                </button>
{/each}
            </div>
          </div>
          
          <div>
            <label class="tool-label">
              {t('selectCup')}
            </label>
            <div class="flex flex-wrap gap-2">
              {#each cupSizes as cup}
<button
                  onclick={() => selectedCup = cup}
                  class={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedCup === cup
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cup}
                </button>
{/each}
            </div>
          </div>
        </div>}
{/if}

      <!-- Results -->
      {#if convertedSizes}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('yourSize')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {#each (Object.keys(systemNames) as SizeSystem[]) as system (system)}
<div  class="p-4 rounded-lg text-center bg-white dark:bg-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {systemNames[system]}
                </div>
                <div class="text-xl font-bold text-gray-900 dark:text-white">
                  {convertedSizes[system]}
                </div>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Tips -->
      <div class="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
        <h4 class="font-medium text-pink-800 dark:text-pink-200 mb-2">
          {t('fittingTips')}
        </h4>
        <ul class="text-sm text-pink-700 dark:text-pink-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
        </ul>
      </div>
    </div>
  
