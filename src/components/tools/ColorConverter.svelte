<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let hex = $state('#3b82f6');

  let rgb = $state({ r: 59, g: 130, b: 246 });

  let hsl = $state({ h: 217, s: 91, l: 60 });

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
  function rgbToHex(r: number, g: number, b: number) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function updateFromHex(newHex: string) {
    hex = newHex;
    const rgbVal = hexToRgb(newHex);
    if (rgbVal) {
      rgb = rgbVal;
      hsl = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
    }
  }
  function updateFromRgb(newRgb: typeof rgb) {
    rgb = newRgb;
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    hex = newHex;
    hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
  }
  async function copyValue(type: string, value: string) {
    await navigator.clipboard.writeText(value);
    copied = type;
    setTimeout(() => copied = '', 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Color Preview -->
      <div
        class="w-full h-32 rounded-lg border border-gray-200 dark:border-gray-700"
        style="background-color: {hex}"></div>

      <!-- Color Picker -->
      <div>
        <label for="color-picker" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('color.preview')}</label>
        <input
          id="color-picker"
          type="color"
          value={hex}
          onchange={(e) => updateFromHex(e.target.value)}
          class="w-full h-12 cursor-pointer"
        />
      </div>

      <!-- HEX -->
      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <label for="color-hex" class="text-sm font-medium text-gray-700 dark:text-gray-300">HEX</label>
          <button
            onclick={() => copyValue('hex', hex)}
            class={`text-xs px-2 py-1 rounded ${copied === 'hex' ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            {copied === 'hex' ? t('copied') : t('copy')}
          </button>
        </div>
        <input
          id="color-hex"
          name="hexColor"
          type="text"
          value={hex}
          onchange={(e) => updateFromHex(e.target.value)}
          class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-gray-900 dark:text-gray-100"
        />
      </div>

      <!-- RGB -->
      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <label for="color-rgb" class="text-sm font-medium text-gray-700 dark:text-gray-300">RGB</label>
          <button
            onclick={() => copyValue('rgb', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
            class={`text-xs px-2 py-1 rounded ${copied === 'rgb' ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            {copied === 'rgb' ? t('copied') : t('copy')}
          </button>
        </div>
        <div class="grid grid-cols-3 gap-2">
          {#each (['r', 'g', 'b'] as const) as c (c)}
<div >
              <label for={`color-rgb-${c}`} class="text-xs text-gray-500 dark:text-gray-300 uppercase">{c}</label>
              <input
                id={`color-rgb-${c}`}
                name={`rgb${c.toUpperCase()}`}
                type="number"
                min="0"
                max="255"
                value={rgb[c]}
                onchange={(e) => updateFromRgb({ ...rgb, [c]: parseInt(e.target.value) || 0 })}
                class="w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              />
            </div>
{/each}
        </div>
      </div>

      <!-- HSL -->
      <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">HSL</div>
          <button
            onclick={() => copyValue('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            class={`text-xs px-2 py-1 rounded ${copied === 'hsl' ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
          >
            {copied === 'hsl' ? t('copied') : t('copy')}
          </button>
        </div>
        <div class="font-mono text-sm text-gray-700 dark:text-gray-300">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
      </div>
    </div>
  
