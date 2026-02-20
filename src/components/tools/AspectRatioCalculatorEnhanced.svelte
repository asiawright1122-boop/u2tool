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
  import { calculateAspectRatio, calculateDimensionFromRatio, AspectRatioResult } from '@/lib/calculator-utils';

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


                  <div
                    class={`p-2 rounded ${matches ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                  >
                    <span class="font-medium">{res.name}</span>
                    <span class="text-gray-500 ml-2">{res.w}×{res.h}</span>
                    {#if matches}
<span class="ml-2">✓</span>
{/if}
                  </div>
                
