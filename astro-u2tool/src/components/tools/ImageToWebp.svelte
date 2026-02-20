<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-to-webp'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-to-webp.${key}`;
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
  interface ImageFile {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
  originalSize: number;
  convertedDataUrl?: string;
  convertedSize?: number;
}

  let images = $state([]);

  let quality = $state(80);

  let isProcessing = $state(false);

  let fileInputRef = $state(null);

  function handleImageUpload(e: Event) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: ImageFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          dataUrl: event.target?.result as string,
          name: file.name,
          originalSize: file.size,
        };
        images = [...images, newImage];
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

  // Functions
  async function convertToWebp() {
    isProcessing = true;

    const convertedImages = await Promise.all(
      images.map(async (img) => {
        return new Promise<ImageFile>((resolve) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(image, 0, 0);
              const webpDataUrl = canvas.toDataURL('image/webp', quality / 100);
              const base64Length = webpDataUrl.split(',')[1].length;
              const convertedSize = Math.ceil((base64Length * 3) / 4);
              resolve({
                ...img,
                convertedDataUrl: webpDataUrl,
                convertedSize,
              });
            } else {
              resolve(img);
            }
          };
          image.src = img.dataUrl;
        });
      })
    );

    images = convertedImages;
    isProcessing = false;
  }
  function downloadSingle(img: ImageFile) {
    if (!img.convertedDataUrl) return;
    const link = document.createElement('a');
    link.href = img.convertedDataUrl;
    const baseName = img.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}.webp`;
    link.click();
  }
  async function downloadAll() {
    const convertedImages = images.filter((img) => img.convertedDataUrl);
    if (convertedImages.length === 0) return;

    if (convertedImages.length === 1) {
      downloadSingle(convertedImages[0]);
      return;
    }

    const zip = new JSZip();
    convertedImages.forEach((img) => {
      if (img.convertedDataUrl) {
        const base64Data = img.convertedDataUrl.split(',')[1];
        const baseName = img.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}.webp`, base64Data, { base64: true });
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `webp-images-${convertedImages.length}.zip`;
    link.click();
  }
  function removeImage(id: string) {
    images = images.filter((img) => img.id !== id);
  }
  function clearAll() {
    images = [];
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }
  function formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  function getTotalSavings() {
    const originalTotal = images.reduce((sum, img) => sum + img.originalSize, 0);
    const convertedTotal = images.reduce((sum, img) => sum + (img.convertedSize || img.originalSize), 0);
    if (originalTotal === 0) return 0;
    return Math.round((1 - convertedTotal / originalTotal) * 100);
  }

</script>


    <div class="space-y-6">
      <!-- Settings -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium">{t('quality')}:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onchange={(e) => quality = Number(e.target.value)}
            class="w-32"
          />
          <span class="text-sm font-mono w-12">{quality}%</span>
        </div>
        <button onclick={clearAll} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <!-- Upload Area -->
      <div
        onclick={() => fileInputRef?.click()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
      >
        <input
          bind:this={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          onchange={handleImageUpload}
          class="hidden"
        />
        <div class="text-4xl mb-2">🌐</div>
        <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        <p class="text-sm text-gray-500">{t('supportedFormats')}</p>
      </div>

      <!-- Image List -->
      {#if images.length > 0}
<div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">{t('images')} ({images.length})</h3>
            {#if images.some((img) => img.convertedDataUrl)}
<span class="text-sm text-green-600 dark:text-green-400">
                {t('totalSavings')}: {getTotalSavings()}%
              </span>
{/if}
          </div>

          <div class="space-y-2">
            {#each images as img (img.id)}
<div 
                class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <img
                  src={img.convertedDataUrl || img.dataUrl}
                  alt={img.name}
                  class="w-16 h-16 object-cover rounded"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{img.name}</p>
                  <p class="text-xs text-gray-500">
                    {formatSize(img.originalSize)}
                    {#if img.convertedSize}
<span class="text-green-600 dark:text-green-400">
                        {' → '}{formatSize(img.convertedSize)}
                        {' ('}{Math.round((1 - img.convertedSize / img.originalSize) * 100)}%{' '}{t('saved')})
                      </span>
{/if}
                  </p>
                </div>
                <div class="flex gap-2">
                  {#if img.convertedDataUrl}
<button
                      onclick={() => downloadSingle(img)}
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                    >
                      {tg('download')}
                    </button>
{/if}
                  <button
                    onclick={() => removeImage(img.id)}
                    class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Actions -->
      {#if images.length > 0}
<div class="flex justify-center gap-4">
          <button
            onclick={convertToWebp}
            disabled={isProcessing}
            class="btn-primary px-8"
          >
            {isProcessing ? t('processing') : t('convert')}
          </button>
          {#if images.some((img) => img.convertedDataUrl)}
<button onclick={downloadAll} class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {t('downloadAll')}
            </button>
{/if}
        </div>
{/if}
    </div>
  
