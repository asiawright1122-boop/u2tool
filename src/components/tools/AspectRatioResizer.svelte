<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['aspect-ratio-resizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.aspect-ratio-resizer.${key}`;
  }

  // Types
  interface AspectRatio {
  name: string;
  width: number;
  height: number;
}

  let image = $state(null);

  let originalSize = $state({ width: 0, height: 0 });

  let targetWidth = $state(1920);

  let targetHeight = $state(1080);

  let lockRatio = $state(true);

  let selectedRatio = $state(null);

  let canvasRef = $state(null);

  let imageRef = $state(null);

  // Functions
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          originalSize = { width: img.width, height: img.height };
          targetWidth = img.width;
          targetHeight = img.height;
          imageRef = img;
        };
        img.src = event.target?.result as string;
        image = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  function handleWidthChange(newWidth: number) {
    targetWidth = newWidth;
    if (lockRatio && originalSize.width > 0) {
      const ratio = originalSize.height / originalSize.width;
      targetHeight = Math.round(newWidth * ratio);
    }
  }
  function handleHeightChange(newHeight: number) {
    targetHeight = newHeight;
    if (lockRatio && originalSize.height > 0) {
      const ratio = originalSize.width / originalSize.height;
      targetWidth = Math.round(newHeight * ratio);
    }
  }
  function applyRatio(ratio: AspectRatio) {
    selectedRatio = ratio;
    lockRatio = false;
    const newHeight = Math.round(targetWidth * (ratio.height / ratio.width));
    targetHeight = newHeight;
  }
  function applySocialSize(size: { width: number; height: number }) {
    lockRatio = false;
    targetWidth = size.width;
    targetHeight = size.height;
  }
  function downloadImage() {
    if (!imageRef || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const img = imageRef;
    const imgRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > targetRatio) {
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgRatio;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    const link = document.createElement('a');
    link.download = `resized-${targetWidth}x${targetHeight}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="tool-label">
          {t('uploadImage')}
        </label>
        <input
          type="file"
          accept="image/*"
          onchange={handleImageUpload}
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {#if image}
<div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('originalSize')}</div>
            <div class="text-lg font-mono text-gray-900 dark:text-white">
              {originalSize.width} × {originalSize.height} px
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="tool-label">
                {t('width')} (px)
              </label>
              <input
                type="number"
                value={targetWidth}
                onchange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="tool-label">
                {t('height')} (px)
              </label>
              <input
                type="number"
                value={targetHeight}
                onchange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="lockRatio"
              bind:checked={lockRatio}
              class="w-4 h-4 text-amber-600 rounded"
            />
            <label for="lockRatio" class="text-sm text-gray-700 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> {t('lockAspectRatio')}
            </label>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('presetRatios')}</h3>
            <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
              {#each presetRatios as ratio (ratio.name)}
<button 
                  onclick={() => applyRatio(ratio)}
                  class={`p-2 text-xs rounded-lg border transition-colors ${
                    selectedRatio?.name === ratio.name
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {ratio.width}:{ratio.height}
                </button>
{/each}
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('socialMediaSizes')}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              {#each socialMediaSizes as size (size.name)}
<button 
                  onclick={() => applySocialSize(size)}
                  class="p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 transition-colors"
                >
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{size.name}</div>
                  <div class="text-xs text-gray-500">{size.width} × {size.height}</div>
                </button>
{/each}
            </div>
          </div>

          <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('outputSize')}</div>
                <div class="text-xl font-mono text-gray-900 dark:text-white">
                  {targetWidth} × {targetHeight} px
                </div>
              </div>
              <button
                onclick={downloadImage}
                class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                {t('download')}
              </button>
            </div>
          </div>

          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div class="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-800">{t('preview')}</div>
            <div class="p-4 flex justify-center bg-gray-100 dark:bg-gray-900">
              <div
                class="relative bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                style="width: Math.min(targetWidth, 400); height: Math.min(targetHeight, 300); aspect-ratio: {targetWidth}/{targetHeight}"
              >
                <img
                  src={image}
                  alt="Preview"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        
</div>
{/if}

      <canvas bind:this={canvasRef} class="hidden"></canvas>
    </div>
  
