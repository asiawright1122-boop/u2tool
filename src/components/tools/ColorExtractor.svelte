<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['color-extractor'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.color-extractor.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
}

  let image = $state(null);

  let colors = $state([]);

  let colorCount = $state(8);

  let isProcessing = $state(false);

  let copiedColor = $state(null);

  let timerRef = $state(null);

  let fileInputRef = $state(null);

  let canvasRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      image = event.target?.result as string;
      colors = [];
    };
    reader.readAsDataURL(file);
  }
  function extractColors() {
    if (!image) return;
    isProcessing = true;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        isProcessing = false;
        return;
      }

      // Scale down for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Count colors
      const colorMap = new Map<string, number>();
      for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 16) * 16;
        const g = Math.round(pixels[i + 1] / 16) * 16;
        const b = Math.round(pixels[i + 2] / 16) * 16;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount);

      const totalPixels = pixels.length / 4;
      const extractedColors: ExtractedColor[] = sortedColors.map(([key, count]) => {
        const [r, g, b] = key.split(',').map(Number);
        const hex = '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
        return {
          hex,
          rgb: [r, g, b] as [number, number, number],
          percentage: Math.round((count / totalPixels) * 100),
        };
      });

      colors = extractedColors;
      isProcessing = false;
    };
    img.src = image;
  }
  function copyColor(color: string) {
    navigator.clipboard.writeText(color);
    copiedColor = color;
    setTimeout(() => copiedColor = null, 2000);
  }
  function downloadPalette() {
    if (colors.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const swatchSize = 100;
    const padding = 10;
    canvas.width = colors.length * (swatchSize + padding) + padding;
    canvas.height = swatchSize + padding * 2 + 30;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw swatches
    colors.forEach((color, index) => {
      const x = padding + index * (swatchSize + padding);
      ctx.fillStyle = color.hex;
      ctx.fillRect(x, padding, swatchSize, swatchSize);

      // Draw hex code
      ctx.fillStyle = '#000000';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(color.hex, x + swatchSize / 2, swatchSize + padding + 20);
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'color-palette.png';
    link.click();
  }
  function clearAll() {
    image = null;
    colors = [];
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-6">
      <canvas bind:this={canvasRef} class="hidden"></canvas>

      <!-- Settings -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">{t('colorCount')}:</label>
          <input
            type="range"
            min="5"
            max="10"
            value={colorCount}
            onchange={(e) => colorCount = Number(e.target.value)}
            class="w-24"
          />
          <span class="text-sm font-mono w-8">{colorCount}</span>
        </div>
        <button onclick={clearAll} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Upload -->
      {#if !image}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            bind:this={fileInputRef}
            type="file"
            accept="image/*"
            onchange={handleImageUpload}
            class="hidden"
          />
          <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
{:else}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Image Preview -->
          <div class="space-y-4">
            <h3 class="font-medium">{t('image')}</h3>
            <img
              src={image}
              alt="Source"
              class="max-w-full max-h-80 rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <button
              onclick={extractColors}
              disabled={isProcessing}
              class="btn-primary w-full"
            >
              {isProcessing ? t('processing') : t('extractColors')}
            </button>
          </div>

          <!-- Color Palette -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="font-medium">{t('palette')}</h3>
              {#if colors.length > 0}
<button
                  onclick={downloadPalette}
                  class="text-sm text-blue-600 hover:underline"
                >
                  {t('downloadPalette')}
                </button>
{/if}
            </div>

            {#if colors.length > 0}
<div class="space-y-2">
                {#each colors as color, index (index)}
<div 
                    class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onclick={() => copyColor(color.hex)}
                  >
                    <div
                      class="w-12 h-12 rounded-lg shadow-inner"
                      style="background-color: {color.hex}"></div>
                    <div class="flex-1">
                      <p class="font-mono text-sm">{color.hex}</p>
                      <p class="text-xs text-gray-500">
                        RGB({color.rgb.join(', ')}) · {color.percentage}%
                      </p>
                    </div>
                    <span class="text-xs text-gray-400">
                      {copiedColor === color.hex ? '✓ ' + tg('copied') : t('clickToCopy')}
                    </span>
                  </div>
{/each}
              </div>
{:else}
<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <p class="text-gray-500">{t('noColors')}</p>
              </div>
{/if}
          </div>
        </div>
{/if}
    </div>
  
