<script lang="ts">
  import { COMMON_RESOLUTIONS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['pixel-density-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.pixel-density-calculator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let width = $state('1920');

  let height = $state('1080');

  let diagonal = $state('24');

  let copied = $state(false);

  let results = $derived.by(() => {
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const d = parseFloat(diagonal) || 0;

    if (w <= 0 || h <= 0 || d <= 0) {
      return null;
    }

    // Calculate diagonal in pixels
    const diagonalPixels = Math.sqrt(w * w + h * h);
    
    // Calculate PPI
    const ppi = diagonalPixels / d;
    
    // Calculate pixel pitch (distance between pixels in mm)
    const pixelPitch = 25.4 / ppi;
    
    // Calculate physical dimensions
    const aspectRatio = w / h;
    const physicalHeight = d / Math.sqrt(1 + aspectRatio * aspectRatio);
    const physicalWidth = physicalHeight * aspectRatio;
    
    // Calculate total pixels
    const totalPixels = w * h;
    const megapixels = totalPixels / 1000000;

    // Determine quality rating
    let quality = '';
    if (ppi >= 300) quality = t('quality.excellent');
    else if (ppi >= 200) quality = t('quality.good');
    else if (ppi >= 100) quality = t('quality.average');
    else quality = t('quality.low');

    return {
      ppi: ppi.toFixed(2),
      pixelPitch: pixelPitch.toFixed(4),
      physicalWidth: physicalWidth.toFixed(2),
      physicalHeight: physicalHeight.toFixed(2),
      totalPixels: totalPixels.toLocaleString(),
      megapixels: megapixels.toFixed(2),
      aspectRatio: `${Math.round(w / gcd(w, h))}:${Math.round(h / gcd(w, h))}`,
      quality,
    };
  });

  // Functions
  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }
  function handlePreset(preset: typeof COMMON_RESOLUTIONS[0]) {
    width = preset.width.toString();
    height = preset.height.toString();
  }
  async function handleCopy() {
    if (!results) return;
    const text = `PPI: ${results.ppi}, Pixel Pitch: ${results.pixelPitch}mm, Resolution: ${width}x${height}`;
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Input Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('width')} (px)
          </label>
          <input
            type="number"
            bind:value={width}
            min="1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('height')} (px)
          </label>
          <input
            type="number"
            bind:value={height}
            min="1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('diagonal')} ({t('inches')})
          </label>
          <input
            type="number"
            bind:value={diagonal}
            min="0.1"
            step="0.1"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Preset Resolutions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('commonResolutions')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each COMMON_RESOLUTIONS as preset (preset.name)}
<button 
              onclick={() => handlePreset(preset)}
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
{/each}
        </div>
      </div>

      <!-- Results -->
      {#if results}
<div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('results')}
            </h3>
            <button
              onclick={handleCopy}
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? common('copied') : common('copy')}
            </button>
          </div>

          <!-- Main Result -->
          <div class="p-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white text-center">
            <div class="text-5xl font-bold mb-2">{results.ppi}</div>
            <div class="text-lg opacity-90">PPI ({t('pixelsPerInch')})</div>
            <div class="mt-2 text-sm opacity-80">{results.quality}</div>
          </div>

          <!-- Detailed Results -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {results.pixelPitch}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('pixelPitch')} (mm)
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {results.aspectRatio}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('aspectRatio')}
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {results.megapixels}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('megapixels')}
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {results.physicalWidth}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('physicalWidth')} ({t('inches')})
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {results.physicalHeight}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('physicalHeight')} ({t('inches')})
              </div>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {results.totalPixels}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {t('totalPixels')}
              </div>
            </div>
          </div>
        </div>
{/if}

      <!-- PPI Reference -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('ppiReference')}
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>Print: 300+ PPI</div>
          <div>Retina: 220+ PPI</div>
          <div>Desktop: 90-120 PPI</div>
          <div>Mobile: 300-500 PPI</div>
        </div>
      </div>
    </div>
  
