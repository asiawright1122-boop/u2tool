<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-splitter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-splitter.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import JSZip from 'jszip';

  // Types
  interface GridConfig {
  rows: number;
  cols: number;
}

  let image = $state(null);

  let imageSize = $state({ width: 0, height: 0 });

  let grid = $state({ rows: 3, cols: 3 });

  let parts = $state([]);

  let isProcessing = $state(false);

  let canvasRef = $state(null);

  // Functions
  const presets = [
    { label: '2×2', rows: 2, cols: 2 },
    { label: '3×3', rows: 3, cols: 3 },
    { label: '4×4', rows: 4, cols: 4 },
    { label: '2×3', rows: 2, cols: 3 },
    { label: '3×2', rows: 3, cols: 2 },
  ];
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageSize = { width: img.width, height: img.height };
        image = event.target?.result as string;
        parts = [];
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  function splitImage() {
    if (!image) return;
    isProcessing = true;

    const img = new Image();
    img.onload = () => {
      const partWidth = Math.floor(img.width / grid.cols);
      const partHeight = Math.floor(img.height / grid.rows);
      const newParts: string[] = [];

      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          const canvas = document.createElement('canvas');
          canvas.width = partWidth;
          canvas.height = partHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.drawImage(
            img,
            col * partWidth,
            row * partHeight,
            partWidth,
            partHeight,
            0,
            0,
            partWidth,
            partHeight
          );

          newParts.push(canvas.toDataURL('image/png'));
        }
      }

      parts = newParts;
      isProcessing = false;
    };
    img.src = image;
  }
  async function downloadAll() {
    if (parts.length === 0) return;

    const zip = new JSZip();
    parts.forEach((part, index) => {
      const base64Data = part.split(',')[1];
      const row = Math.floor(index / grid.cols) + 1;
      const col = (index % grid.cols) + 1;
      zip.file(`part_${row}_${col}.png`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `split_${grid.rows}x${grid.cols}.zip`;
    link.click();
  }
  function downloadSingle(dataUrl: string, index: number) {
    const row = Math.floor(index / grid.cols) + 1;
    const col = (index % grid.cols) + 1;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `part_${row}_${col}.png`;
    link.click();
  }

</script>


    <div class="space-y-6">
      <canvas bind:this={canvasRef} class="hidden"></canvas>

      <!-- Grid Settings -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex gap-2">
          {#each presets as preset (preset.label)}
<button 
              onclick={() => { grid = { rows: preset.rows, cols: preset.cols }; parts = []; }}
              class={`px-3 py-1.5 rounded text-sm ${
                grid.rows === preset.rows && grid.cols === preset.cols
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset.label}
            </button>
{/each}
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm">{t('rows')}:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={grid.rows}
            onchange={(e) => { grid = { ...grid, rows: Number(e.target.value) }; parts = []; }}
            class="w-16 tool-input"
          />
          <label class="text-sm">{t('cols')}:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={grid.cols}
            onchange={(e) => { grid = { ...grid, cols: Number(e.target.value) }; parts = []; }}
            class="w-16 tool-input"
          />
        </div>
      </div>

      <!-- Upload Area -->
      {#if !image}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input type="file" accept="image/*" onchange={handleImageUpload} class="hidden" />
          <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg></div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
{:else}
<div class="space-y-4">
          <!-- Preview with Grid Overlay -->
          <div class="relative inline-block">
            <img src={image} alt="Original" class="max-w-full max-h-96 rounded-lg" />
            <div
              class="absolute inset-0 pointer-events-none"
              style="display: grid; grid-template-rows: repeat({grid.rows}, 1fr); grid-template-columns: repeat({grid.cols}, 1fr)"
            >
              {#each Array.from({ length: grid.rows * grid.cols }) as _, i (i)}
<div  class="border border-red-500 border-dashed"></div>
{/each}
            </div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {t('originalSize')}: {imageSize.width}×{imageSize.height} → {t('partSize')}: {Math.floor(imageSize.width / grid.cols)}×{Math.floor(imageSize.height / grid.rows)}
          </p>

          <!-- Actions -->
          <div class="flex gap-4">
            <button onclick={splitImage} disabled={isProcessing} class="btn-primary">
              {isProcessing ? t('processing') : t('split')}
            </button>
            <button onclick={() => { image = null; parts = []; }} class="btn-secondary">
              {tg('clear')}
            </button>
          </div>
        </div>
{/if}

      <!-- Results -->
      {#if parts.length > 0}
<div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">{t('result')} ({parts.length} {t('parts')})</h3>
            <button onclick={downloadAll} class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {t('downloadAll')}
            </button>
          </div>
          <div
            class="grid gap-2"
            style="grid-template-columns: repeat({grid.cols}, 1fr)"
          >
            {#each parts as part, index (index)}
<div  class="relative group">
                <img src={part} alt={`Part ${index + 1}`} class="w-full rounded border border-gray-200 dark:border-gray-700" />
                <button
                  onclick={() => downloadSingle(part, index)}
                  class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded"
                >
                  {tg('download')}
                </button>
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
