<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['imageCropper'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.imageCropper.${key}`;
  }

  // Types
  interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

  const ASPECT_RATIOS: Array<{ label: string; value: number | null }> = [
    { label: 'Free', value: null },
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: '9:16', value: 9 / 16 },
  ];

  let originalImage = $state(null);

  let croppedImage = $state(null);

  let fileName = $state('');

  let aspectRatio = $state(null);

  let cropArea = $state({ x: 0, y: 0, width: 100, height: 100 });

  let isDragging = $state(false);

  let dragStart = $state({ x: 0, y: 0 });

  let imageSize = $state({ width: 0, height: 0 });

  let fileInputRef = $state(null);

  let containerRef = $state(null);

  function handleMouseDown(e: MouseEvent) {
      if (!containerRef) return;
      const rect = containerRef.getBoundingClientRect();
      const scaleX = imageSize.width / rect.width;
      const scaleY = imageSize.height / rect.height;
      isDragging = true;
      dragStart = {
        x: (e.clientX - rect.left) * scaleX - cropArea.x,
        y: (e.clientY - rect.top) * scaleY - cropArea.y,
      };
    }

  function handleMouseMove(e: MouseEvent) {
      if (!isDragging || !containerRef) return;
      const rect = containerRef.getBoundingClientRect();
      const scaleX = imageSize.width / rect.width;
      const scaleY = imageSize.height / rect.height;

      let newX = (e.clientX - rect.left) * scaleX - dragStart.x;
      let newY = (e.clientY - rect.top) * scaleY - dragStart.y;

      // Constrain to image bounds
      newX = Math.max(0, Math.min(newX, imageSize.width - cropArea.width));
      newY = Math.max(0, Math.min(newY, imageSize.height - cropArea.height));

      cropArea = ({ ...cropArea, x: newX, y: newY });
    }

  function handleMouseUp() {
    isDragging = false;
  }

  // Functions
  function handleFileSelect(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    fileName = file.name;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        imageSize = { width: img.width, height: img.height };
        // Initialize crop area to center 50%
        const size = Math.min(img.width, img.height) * 0.5;
        cropArea = {
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          width: size,
          height: aspectRatio ? size / aspectRatio : size,
        };
      };
      img.src = event.target?.result as string;
      originalImage = event.target?.result as string;
      croppedImage = null;
    };
    reader.readAsDataURL(file);
  }
  function handleSizeChange(dimension: 'width' | 'height', value: number) {
    const newValue = Math.max(10, Math.min(value, imageSize[dimension]));
    if (aspectRatio) {
      if (dimension === 'width') {
        cropArea = ({
          ...cropArea,
          width: newValue,
          height: newValue / aspectRatio,
        });
      } else {
        cropArea = ({
          ...cropArea,
          height: newValue,
          width: newValue * aspectRatio,
        });
      }
    } else {
      cropArea = ({ ...cropArea, [dimension]: newValue });
    }
  }
  function handleAspectRatioChange(ratio: number | null) {
    aspectRatio = ratio;
    if (ratio) {
      cropArea = ({
        ...cropArea,
        height: cropArea.width / ratio,
      });
    }
  }
  function cropImage() {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      croppedImage = canvas.toDataURL('image/png');
    };
    img.src = originalImage;
  }
  function downloadCropped() {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.href = croppedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_cropped.png`;
    link.click();
  }
  function clearAll() {
    originalImage = null;
    croppedImage = null;
    fileName = '';
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-6">
      <!-- Controls -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('aspectRatio')}:</label>
          <select
            value={aspectRatio?.toString() || 'free'}
            onchange={(e) =>
              handleAspectRatioChange(e.target.value === 'free' ? null : parseFloat(e.target.value))
            }
            class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm text-gray-900 dark:text-white"
          >
            {#each ASPECT_RATIOS as r (r.label)}
<option  value={r.value?.toString() || 'free'}>
                {r.label}
              </option>
{/each}
          </select>
        </div>
        <button
          onclick={clearAll}
          class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm"
        >
          {t('clear')}
        </button>
      </div>

      <!-- File Input -->
      {#if !originalImage}
<div
          onclick={() => fileInputRef?.click()}
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <input
            bind:this={fileInputRef}
            type="file"
            accept="image/*"
            onchange={handleFileSelect}
            class="hidden"
          />
          <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg></div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </div>
{/if}

      <!-- Crop Area -->
      {#if originalImage}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('selectArea')}</label>
              <button
                onclick={() => fileInputRef?.click()}
                class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-xs"
              >
                {t('changeImage')}
              </button>
              <input
                bind:this={fileInputRef}
                type="file"
                accept="image/*"
                onchange={handleFileSelect}
                class="hidden"
              />
            </div>
            <div
              bind:this={containerRef}
              class="relative bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden cursor-move"
              onmousedown={handleMouseDown}
              onmousemove={handleMouseMove}
              onmouseup={handleMouseUp}
              onmouseleave={handleMouseUp}
            >
              <img src={originalImage} alt="Original" class="w-full h-auto" />
              <!-- Overlay -->
              <div class="absolute inset-0 bg-black/50 pointer-events-none"></div>
              <!-- Crop selection -->
              <div
                class="absolute border-2 border-white bg-transparent pointer-events-none"
                style="left: {(cropArea.x / imageSize.width) * 100}%; top: {(cropArea.y / imageSize.height) * 100}%; width: {(cropArea.width / imageSize.width) * 100}%; height: {(cropArea.height / imageSize.height) * 100}%; box-shadow: 0 0 0 9999px rgba(0,0,0,0.5)"></div>
            </div>

            <!-- Size inputs -->
            <div class="flex gap-4 mt-4">
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600 dark:text-gray-300">{t('width')}:</label>
                <input
                  type="number"
                  value={Math.round(cropArea.width)}
                  onchange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                  class="w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
                />
              </div>
              <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600 dark:text-gray-300">{t('height')}:</label>
                <input
                  type="number"
                  value={Math.round(cropArea.height)}
                  onchange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                  class="w-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">{t('preview')}</label>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {#if croppedImage}
<img
                  src={croppedImage}
                  alt="Cropped"
                  class="max-w-full max-h-64 object-contain"
                />
{:else}
<p class="text-gray-500 dark:text-gray-300">{t('cropFirst')}</p>
{/if}
            </div>
          </div>
        </div>
{/if}

      <!-- Actions -->
      {#if originalImage}
<div class="flex justify-center gap-4">
          <button
            onclick={cropImage}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            {t('crop')}
          </button>
          {#if croppedImage}
<button
              onclick={downloadCropped}
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              {t('download')}
            </button>
{/if}
        </div>
{/if}
    </div>
  
