<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-collage'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-collage.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type LayoutDirection = 'horizontal' | 'vertical';
  interface ImageFile {
  id: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  name: string;
}

  let images = $state([]);

  let direction = $state('horizontal');

  let spacing = $state(10);

  let backgroundColor = $state('#ffffff');

  let result = $state(null);

  let canvasRef = $state(null);

  let fileInputRef = $state(null);

  function handleImageUpload(e: Event) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newImage: ImageFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
            name: file.name,
          };
          images = [...images, newImage];
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

  // Functions
  function removeImage(id: string) {
    images = images.filter((img) => img.id !== id);
    result = null;
  }
  function moveImage(index: number, direction: 'up' | 'down') {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    images = newImages;
    result = null;
  }
  function createCollage() {
    if (images.length === 0 || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let totalWidth = 0;
    let totalHeight = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    images.forEach((img) => {
      totalWidth += img.width;
      totalHeight += img.height;
      maxWidth = Math.max(maxWidth, img.width);
      maxHeight = Math.max(maxHeight, img.height);
    });

    const totalSpacing = spacing * (images.length - 1);

    if (direction === 'horizontal') {
      canvas.width = totalWidth + totalSpacing;
      canvas.height = maxHeight;
    } else {
      canvas.width = maxWidth;
      canvas.height = totalHeight + totalSpacing;
    }

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw images
    let currentX = 0;
    let currentY = 0;

    images.forEach((imgData) => {
      const img = new Image();
      img.src = imgData.dataUrl;

      if (direction === 'horizontal') {
        const y = (maxHeight - imgData.height) / 2;
        ctx.drawImage(img, currentX, y, imgData.width, imgData.height);
        currentX += imgData.width + spacing;
      } else {
        const x = (maxWidth - imgData.width) / 2;
        ctx.drawImage(img, x, currentY, imgData.width, imgData.height);
        currentY += imgData.height + spacing;
      }
    });

    result = canvas.toDataURL('image/png');
  }
  function downloadImage() {
    if (!result) return;
    const link = document.createElement('a');
    link.download = `collage-${Date.now()}.png`;
    link.href = result;
    link.click();
  }
  function clearAll() {
    images = [];
    result = null;
  }

</script>


    <div class="space-y-6">
      <canvas bind:this={canvasRef} class="hidden"></canvas>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">{t('direction')}</label>
          <select
            value={direction}
            onchange={(e) => { direction = e.target.value as LayoutDirection; result = null; }}
            class="tool-input"
          >
            <option value="horizontal">{t('horizontal')}</option>
            <option value="vertical">{t('vertical')}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">{t('spacing')}: {spacing}px</label>
          <input
            type="range"
            min="0"
            max="50"
            value={spacing}
            onchange={(e) => { spacing = Number(e.target.value); result = null; }}
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">{t('backgroundColor')}</label>
          <div class="flex gap-2">
            <input
              type="color"
              value={backgroundColor}
              onchange={(e) => { backgroundColor = e.target.value; result = null; }}
              class="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={backgroundColor}
              onchange={(e) => { backgroundColor = e.target.value; result = null; }}
              class="tool-input flex-1"
            />
          </div>
        </div>
        <div class="flex items-end">
          <button onclick={clearAll} class="btn-secondary w-full">
            {tg('clear')}
          </button>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        onclick={() => fileInputRef?.click()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      >
        <input
          bind:this={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onchange={handleImageUpload}
          class="hidden"
        />
        <div class="text-4xl mb-2">🖼️</div>
        <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('multipleHint')}</p>
      </div>

      <!-- Image List -->
      {#if images.length > 0}
<div class="space-y-4">
          <h3 class="font-medium">{t('imageList')} ({images.length})</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {#each images as img, index (img.id)}
<div  class="relative group">
                <img
                  src={img.dataUrl}
                  alt={img.name}
                  class="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
                <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  <button
                    onclick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    class="p-1 bg-white rounded text-sm disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onclick={() => removeImage(img.id)}
                    class="p-1 bg-red-500 text-white rounded text-sm"
                  >
                    ✕
                  </button>
                  <button
                    onclick={() => moveImage(index, 'down')}
                    disabled={index === images.length - 1}
                    class="p-1 bg-white rounded text-sm disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
                <p class="text-xs text-gray-500 truncate mt-1">{img.width}×{img.height}</p>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Actions -->
      {#if images.length > 0}
<div class="flex justify-center gap-4">
          <button onclick={createCollage} class="btn-primary px-8">
            {t('createCollage')}
          </button>
          {#if result}
<button onclick={downloadImage} class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {tg('download')}
            </button>
{/if}
        </div>
{/if}

      <!-- Result Preview -->
      {#if result}
<div class="space-y-2">
          <h3 class="font-medium">{t('result')}</h3>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-center">
            <img src={result} alt="Collage Result" class="max-w-full max-h-96 object-contain rounded" />
          </div>
        </div>
{/if}
    </div>
  
