<script lang="ts">
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

  let image = $state(null);

  let originalSize = $state({ width: 0, height: 0 });

  let newWidth = $state(0);

  let newHeight = $state(0);

  let lockRatio = $state(true);

  let resizedImage = $state(null);

  let canvasRef = $state(null);

  // Functions
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalSize = { width: img.width, height: img.height };
        newWidth = img.width;
        newHeight = img.height;
        image = event.target?.result as string;
        resizedImage = null;
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  function handleWidthChange(w: number) {
    newWidth = w;
    if (lockRatio && originalSize.width > 0) {
      newHeight = Math.round((w / originalSize.width) * originalSize.height);
    }
  }
  function handleHeightChange(h: number) {
    newHeight = h;
    if (lockRatio && originalSize.height > 0) {
      newWidth = Math.round((h / originalSize.height) * originalSize.width);
    }
  }
  function resizeImage() {
    if (!image || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = newWidth;
    canvas.height = newHeight;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      resizedImage = canvas.toDataURL('image/png');
    };
    img.src = image;
  }
  function downloadImage() {
    if (!resizedImage) return;
    const link = document.createElement('a');
    link.download = `resized-${newWidth}x${newHeight}.png`;
    link.href = resizedImage;
    link.click();
  }

</script>


    <div class="space-y-6">
      <canvas bind:this={canvasRef} class="hidden"></canvas>
      
      {#if !image}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50 dark:bg-transparent">
          <input type="file" accept="image/*" onchange={handleImageUpload} class="hidden" />
          <div class="text-gray-600 dark:text-gray-300">{t('imageResizer.dropzone')}</div>
        </label>
{:else}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {t('imageResizer.original')}: {originalSize.width} × {originalSize.height}
              </div>
              <img src={image} alt="Original" class="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700" style="aspect-ratio: auto" />
            </div>
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <div>
                  <label for="image-resizer-field-4" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('imageResizer.width')}</label>
                  <input
                    type="number"
                    value={newWidth}
                    onchange={(e) => handleWidthChange(Number(e.target.value))}
                    class="w-24 tool-input" id="image-resizer-field-4" />
                </div>
                <div>
                  <label for="image-resizer-field-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('imageResizer.height')}</label>
                  <input
                    type="number"
                    value={newHeight}
                    onchange={(e) => handleHeightChange(Number(e.target.value))}
                    class="w-24 tool-input" id="image-resizer-field-3" />
                </div>
                <label class="flex items-center gap-2 mt-5">
                  <input type="checkbox" bind:checked={lockRatio} />
                  <span class="text-sm text-gray-600 dark:text-gray-300">{t('imageResizer.lockRatio')}</span>
                </label>
              </div>
              <div class="flex gap-3">
                <button onclick={resizeImage} class="btn-primary">
                  {t('imageResizer.resize')}
                </button>
                <button onclick={() => { image = null; resizedImage = null; }} class="btn-secondary">
                  {t('clear')}
                </button>
              </div>
              {#if resizedImage}
<div>
                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('imageResizer.resized')}: {newWidth} × {newHeight}</div>
                  <img src={resizedImage} alt="Resized" class="max-w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700" style="aspect-ratio: auto" />
                  <button onclick={downloadImage} class="mt-2 px-4 py-2 bg-emerald-500 hover:bg-green-700 text-white rounded-lg">
                    {t('download')}
                  </button>
                </div>
{/if}
            </div>
          </div>
        
{/if}
    </div>
  
