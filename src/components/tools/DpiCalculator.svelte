<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['dpi-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.dpi-calculator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let mode = $state('toDpi');

  let pixelWidth = $state('3000');

  let pixelHeight = $state('2000');

  let printWidth = $state('10');

  let printHeight = $state('8');

  let targetDpi = $state('300');

  let targetPrintWidth = $state('10');

  let targetPrintHeight = $state('8');

  let copied = $state(false);

  let dpiResults = $derived.by(() => {
    const pw = parseFloat(pixelWidth) || 0;
    const ph = parseFloat(pixelHeight) || 0;
    const prw = parseFloat(printWidth) || 0;
    const prh = parseFloat(printHeight) || 0;

    if (pw <= 0 || ph <= 0 || prw <= 0 || prh <= 0) {
      return null;
    }

    const dpiW = pw / prw;
    const dpiH = ph / prh;
    const avgDpi = (dpiW + dpiH) / 2;

    let quality = '';
    if (avgDpi >= 300) quality = t('quality.excellent');
    else if (avgDpi >= 200) quality = t('quality.good');
    else if (avgDpi >= 150) quality = t('quality.acceptable');
    else quality = t('quality.low');

    return {
      dpiWidth: dpiW.toFixed(0),
      dpiHeight: dpiH.toFixed(0),
      avgDpi: avgDpi.toFixed(0),
      quality,
    };
  });

  let pixelResults = $derived.by(() => {
    const dpi = parseFloat(targetDpi) || 0;
    const prw = parseFloat(targetPrintWidth) || 0;
    const prh = parseFloat(targetPrintHeight) || 0;

    if (dpi <= 0 || prw <= 0 || prh <= 0) {
      return null;
    }

    const reqWidth = Math.ceil(dpi * prw);
    const reqHeight = Math.ceil(dpi * prh);
    const megapixels = (reqWidth * reqHeight) / 1000000;

    return {
      requiredWidth: reqWidth.toLocaleString(),
      requiredHeight: reqHeight.toLocaleString(),
      megapixels: megapixels.toFixed(2),
    };
  });

  // Functions
  function handlePrintSizePreset(preset: typeof PRINT_SIZES[0]) {
    if (mode === 'toDpi') {
      printWidth = preset.width.toString();
      printHeight = preset.height.toString();
    } else {
      targetPrintWidth = preset.width.toString();
      targetPrintHeight = preset.height.toString();
    }
  }
  async function handleCopy() {
    let text = '';
    if (mode === 'toDpi' && dpiResults) {
      text = `DPI: ${dpiResults.avgDpi} (${dpiResults.dpiWidth} x ${dpiResults.dpiHeight})`;
    } else if (mode === 'toPixels' && pixelResults) {
      text = `Required: ${pixelResults.requiredWidth} x ${pixelResults.requiredHeight} pixels (${pixelResults.megapixels} MP)`;
    }
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Mode Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => mode = 'toDpi'}
          class={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            mode === 'toDpi'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          {t('calculateDpi')}
        </button>
        <button
          onclick={() => mode = 'toPixels'}
          class={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            mode === 'toPixels'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
          }`}
        >
          {t('calculatePixels')}
        </button>
      </div>

      {#if mode === 'toDpi'}

          <!-- Calculate DPI Mode -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">{t('imageResolution')}</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('width')} (px)
                  </label>
                  <input
                    type="number"
                    bind:value={pixelWidth}
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('height')} (px)
                  </label>
                  <input
                    type="number"
                    bind:value={pixelHeight}
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">{t('printSize')}</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('width')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    bind:value={printWidth}
                    min="0.1"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('height')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    bind:value={printHeight}
                    min="0.1"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- DPI Results -->
          {#if dpiResults}
<div class="p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium">{t('calculatedDpi')}</h3>
                <button
                  onclick={handleCopy}
                  class="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  {copied ? common('copied') : common('copy')}
                </button>
              </div>
              <div class="text-5xl font-bold mb-2">{dpiResults.avgDpi} DPI</div>
              <div class="text-sm opacity-80 mb-2">
                {t('horizontal')}: {dpiResults.dpiWidth} | {t('vertical')}: {dpiResults.dpiHeight}
              </div>
              <div class="text-sm">{dpiResults.quality}</div>
            </div>
{/if}
        
{:else}

          <!-- Calculate Pixels Mode -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">{t('targetDpi')}</h4>
              <input
                type="number"
                bind:value={targetDpi}
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div class="flex flex-wrap gap-2">
                {#each DPI_PRESETS as dpi (dpi)}
<button 
                    onclick={() => targetDpi = dpi.toString()}
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {dpi} DPI
                  </button>
{/each}
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="font-medium text-gray-900 dark:text-white">{t('printSize')}</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('width')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    bind:value={targetPrintWidth}
                    min="0.1"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {t('height')} ({t('inches')})
                  </label>
                  <input
                    type="number"
                    bind:value={targetPrintHeight}
                    min="0.1"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Pixel Results -->
          {#if pixelResults}
<div class="p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium">{t('requiredResolution')}</h3>
                <button
                  onclick={handleCopy}
                  class="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
                >
                  {copied ? common('copied') : common('copy')}
                </button>
              </div>
              <div class="text-3xl font-bold mb-2">
                {pixelResults.requiredWidth} × {pixelResults.requiredHeight}
              </div>
              <div class="text-sm opacity-80">
                {pixelResults.megapixels} {t('megapixels')}
              </div>
            </div>
{/if}
        
{/if}

      <!-- Print Size Presets -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('commonPrintSizes')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each PRINT_SIZES as preset (preset.name)}
<button 
              onclick={() => handlePrintSizePreset(preset)}
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
{/each}
        </div>
      </div>

      <!-- DPI Guide -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('dpiGuide')}
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>72 DPI: {t('screen')}</div>
          <div>150 DPI: {t('draft')}</div>
          <div>300 DPI: {t('print')}</div>
          <div>600 DPI: {t('highQuality')}</div>
        </div>
      </div>
    </div>
  
