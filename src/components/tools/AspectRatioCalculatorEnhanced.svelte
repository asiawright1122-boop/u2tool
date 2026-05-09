<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['aspect-ratio-calculator-enhanced'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.aspect-ratio-calculator-enhanced.${key}`;
  }

  // Imports
  import { calculateAspectRatio, calculateDimensionFromRatio, type AspectRatioResult } from '@/lib/calculator-utils';

  let width = $state('1920');

  let height = $state('1080');

  let lockedRatio = $state(null);

  let result = $state(null);

  $effect(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      result = calculateAspectRatio(w, h);
    }
  });

  // Functions
  function handleWidthChange(value: string) {
    width = value;
    if (lockedRatio) {
      const w = parseFloat(value);
      if (!isNaN(w) && w > 0) {
        const newHeight = calculateDimensionFromRatio(w, true, lockedRatio.width, lockedRatio.height);
        height = Math.round(newHeight).toString();
      }
    }
  }
  function handleHeightChange(value: string) {
    height = value;
    if (lockedRatio) {
      const h = parseFloat(value);
      if (!isNaN(h) && h > 0) {
        const newWidth = calculateDimensionFromRatio(h, false, lockedRatio.width, lockedRatio.height);
        width = Math.round(newWidth).toString();
      }
    }
  }
  function applyPreset(preset: { width: number; height: number }) {
    lockedRatio = preset;
    const w = parseFloat(width);
    if (!isNaN(w) && w > 0) {
      const newHeight = calculateDimensionFromRatio(w, true, preset.width, preset.height);
      height = Math.round(newHeight).toString();
    }
  }
  function lockCurrentRatio() {
    if (result) {
      lockedRatio = { width: result.ratioWidth, height: result.ratioHeight };
    }
  }
  function unlockRatio() {
    lockedRatio = null;
  }

</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label class="tool-label">{t('width')}</label>
      <input
        type="number"
        value={width}
        oninput={(event) => handleWidthChange(event.currentTarget.value)}
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
    <div>
      <label class="tool-label">{t('height')}</label>
      <input
        type="number"
        value={height}
        oninput={(event) => handleHeightChange(event.currentTarget.value)}
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
      />
    </div>
  </div>

  {#if result}
    <div class="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
      <div class="text-sm text-gray-600 dark:text-gray-300">{t('ratio')}</div>
      <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">
        {result.ratioWidth}:{result.ratioHeight}
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-300 mt-1">
        {width} x {height}
      </div>
    </div>
  {/if}

  <div class="flex flex-wrap gap-2">
    <button onclick={lockCurrentRatio} class="px-4 py-2 bg-amber-600 text-white rounded-lg">{t('lockRatio')}</button>
    <button onclick={unlockRatio} class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">{t('unlockRatio')}</button>
  </div>

  <div>
    <label class="tool-label">{t('presets')}</label>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
      {#each [
        { name: '16:9', width: 16, height: 9 },
        { name: '4:3', width: 4, height: 3 },
        { name: '1:1', width: 1, height: 1 },
        { name: '3:2', width: 3, height: 2 },
      ] as preset (preset.name)}
        <button onclick={() => applyPreset(preset)} class="p-2 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
          {preset.name}
        </button>
      {/each}
    </div>
  </div>
</div>
