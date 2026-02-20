<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['random-color-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.random-color-generator.${key}`;
  }

  let colors = $state(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']);

  let copied = $state(null);

  let count = $state(5);

  let format = $state('hex');

  let timerRef = $state(null);

  function formatColor(hex: string) {
    switch (format) {
      case 'rgb': return hexToRgb(hex);
      case 'hsl': return hexToHsl(hex);
      default: return hex;
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateRandomHex(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  }
  function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  function hexToHsl(hex: string): string {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
  function generateColors() {
    const newColors = Array.from({ length: count }, () => generateRandomHex());
    colors = newColors;
  }
  function copyColor(index: number) {
    navigator.clipboard.writeText(formatColor(colors[index]));
    copied = index;
    setTimeout(() => copied = null, 2000);
  }
  function copyAll() {
    navigator.clipboard.writeText(colors.map(c => formatColor(c)).join('\n'));
    copied = -1;
    setTimeout(() => copied = null, 2000);
  }
  function getLuminance(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">{t('count')}:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onchange={(e) => count = Math.min(20, Math.max(1, parseInt(e.target.value) || 1))}
            class="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-400">{t('format')}:</label>
          <select
            value={format}
            onchange={(e) => format = e.target.value as 'hex' | 'rgb' | 'hsl'}
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
            <option value="hsl">HSL</option>
          </select>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button
          onclick={generateColors}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🎲 {t('generate')}
        </button>
        <button
          onclick={copyAll}
          class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {copied === -1 ? t('copied') : t('copyAll')}
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {#each colors as color, index (index)}
<div 
            onclick={() => copyColor(index)}
            class="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div
              class="h-32 flex items-center justify-center"
              style="background-color: {color}"
            >
              <span class={`text-sm font-mono ${getLuminance(color) > 0.5 ? 'text-gray-900' : 'text-white'}`}>
                {copied === index ? t('copied') : t('clickToCopy')}
              </span>
            </div>
            <div class="p-3 bg-white dark:bg-gray-800 text-center">
              <span class="font-mono text-sm text-gray-900 dark:text-white">{formatColor(color)}</span>
            </div>
          </div>
{/each}
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('palettePreview')}</h3>
        <div class="flex h-16 rounded-lg overflow-hidden">
          {#each colors as color, index (index)}
<div  class="flex-1" style="background-color: {color}"></div>
{/each}
        </div>
      </div>
    </div>
  
