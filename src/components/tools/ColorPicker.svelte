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

  let color = $state('#3b82f6');

  let recentColors = $state([]);

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
    } : { r: 0, g: 0, b: 0 };
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
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colorFormats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];
  async function copyValue(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    copied = label;
    setTimeout(() => copied = '', 2000);
  }
  function addToRecent(newColor: string) {
    {
    const filtered = recentColors.filter(c => c !== newColor);
    recentColors = [newColor, ...filtered].slice(0, 12);
  };
  }
  function handleColorChange(newColor: string) {
    color = newColor;
    addToRecent(newColor);
  }
  const presetColors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#000000',
    '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
  ];

</script>


    <div class="space-y-6">
      <!-- Main Color Display -->
      <div class="flex gap-6 items-start">
        <div
          class="w-48 h-48 rounded-xl border-4 border-gray-300 dark:border-gray-700 shadow-lg"
          style="background-color: {color}"></div>
        <div class="flex-1 space-y-4">
          <div>
            <label for="color-picker-input" class="block text-sm font-medium mb-2">{t('colorPicker.selectColor')}</label>
            <input
              id="color-picker-input"
              name="colorValue"
              type="color"
              value={color}
              onchange={(e) => handleColorChange(e.target.value)}
              class="w-full h-12 cursor-pointer rounded-lg"
            />
          </div>
          <div>
            <label for="color-hex-input" class="block text-sm font-medium mb-2">HEX</label>
            <input
              id="color-hex-input"
              name="hexColor"
              type="text"
              value={color}
              onchange={(e) => {
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                  handleColorChange(e.target.value);
                }
              }}
              class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <!-- Color Values -->
      <div class="grid grid-cols-2 gap-3">
        {#each colorFormats as { label, value } (label)}
<div  class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-gray-600 dark:text-gray-300">{label}</span>
              <button
                onclick={() => copyValue(label, value)}
                class={`text-xs px-2 py-0.5 rounded ${copied === label ? 'bg-emerald-500' : 'bg-gray-700'}`}
              >
                {copied === label ? t('copied') : t('copy')}
              </button>
            </div>
            <div class="font-mono text-sm truncate">{value}</div>
          </div>
{/each}
      </div>

      <!-- Preset Colors -->
      <div>
        <label class="block text-sm font-medium mb-2">{t('colorPicker.presets')}</label>
        <div class="flex flex-wrap gap-2">
          {#each presetColors as c (c)}
<button 
              onclick={() => handleColorChange(c)}
              class={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                color === c ? 'border-white' : 'border-transparent'
              }`}
              style="background-color: {c}"
              title={c}
            ></button>
{/each}
        </div>
      </div>

      <!-- Recent Colors -->
      {#if recentColors.length > 0}
<div>
          <label class="block text-sm font-medium mb-2">{t('colorPicker.recent')}</label>
          <div class="flex flex-wrap gap-2">
            {#each recentColors as c, i (`${c}-${i}`)}
<button 
                onclick={() => color = c}
                class={`w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-white' : 'border-gray-600'
                }`}
                style="background-color: {c}"
                title={c}
              ></button>
{/each}
          </div>
        </div>
{/if}

      <!-- Color Info -->
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="text-sm font-medium mb-3">{t('colorPicker.info')}</h3>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-red-500 dark:text-red-400">{rgb.r}</div>
            <div class="text-xs text-gray-600 dark:text-gray-300">{t('colorPicker.red')}</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-500 dark:text-green-400">{rgb.g}</div>
            <div class="text-xs text-gray-600 dark:text-gray-300">{t('colorPicker.green')}</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-amber-500 dark:text-amber-400">{rgb.b}</div>
            <div class="text-xs text-gray-600 dark:text-gray-300">{t('colorPicker.blue')}</div>
          </div>
        </div>
      </div>
    </div>
  
