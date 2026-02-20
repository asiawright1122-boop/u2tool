<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-to-ico'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-to-ico.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let image = $state(null);

  let originalImage = $state(null);

  let selectedSizes = $state([16, 32, 48]);

  let previews = $state([]);

  // Functions
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        image = event.target?.result as string;
        generatePreviews(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  function generatePreviews(img: HTMLImageElement) {
    const newPreviews = ICO_SIZES.map((size) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
      }
      return { size, dataUrl: canvas.toDataURL('image/png') };
    });
    previews = newPreviews;
  }
  function toggleSize(size: number) {
    selectedSizes = selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size].sort((a, b) => a - b)
    ;
  }
  async function downloadIco() {
    if (!originalImage || selectedSizes.length === 0) return;

    // Generate ICO file
    const images: { size: number; data: Uint8Array }[] = [];

    for (const size of selectedSizes) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.drawImage(originalImage, 0, 0, size, size);

      // Get PNG data
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      images.push({ size, data: bytes });
    }

    // Build ICO file
    const iconDir = new ArrayBuffer(6 + images.length * 16);
    const iconDirView = new DataView(iconDir);

    // ICONDIR header
    iconDirView.setUint16(0, 0, true); // Reserved
    iconDirView.setUint16(2, 1, true); // Type (1 = ICO)
    iconDirView.setUint16(4, images.length, true); // Number of images

    let dataOffset = 6 + images.length * 16;
    const imageDataParts: Uint8Array[] = [];

    images.forEach((img, index) => {
      const offset = 6 + index * 16;
      iconDirView.setUint8(offset, img.size < 256 ? img.size : 0); // Width
      iconDirView.setUint8(offset + 1, img.size < 256 ? img.size : 0); // Height
      iconDirView.setUint8(offset + 2, 0); // Color palette
      iconDirView.setUint8(offset + 3, 0); // Reserved
      iconDirView.setUint16(offset + 4, 1, true); // Color planes
      iconDirView.setUint16(offset + 6, 32, true); // Bits per pixel
      iconDirView.setUint32(offset + 8, img.data.length, true); // Image size
      iconDirView.setUint32(offset + 12, dataOffset, true); // Image offset

      dataOffset += img.data.length;
      imageDataParts.push(img.data);
    });

    // Combine all parts
    const totalSize = 6 + images.length * 16 + imageDataParts.reduce((sum, p) => sum + p.length, 0);
    const icoData = new Uint8Array(totalSize);
    icoData.set(new Uint8Array(iconDir), 0);

    let currentOffset = 6 + images.length * 16;
    imageDataParts.forEach((part) => {
      icoData.set(part, currentOffset);
      currentOffset += part.length;
    });

    // Download
    const blob = new Blob([icoData], { type: 'image/x-icon' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'favicon.ico';
    link.click();
  }
  function downloadPng(size: number) {
    const preview = previews.find((p) => p.size === size);
    if (!preview) return;
    const link = document.createElement('a');
    link.href = preview.dataUrl;
    link.download = `icon-${size}x${size}.png`;
    link.click();
  }

</script>


    <div class="space-y-6">
      <!-- Upload -->
      {#if !image}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input type="file" accept="image/*" onchange={handleImageUpload} class="hidden" />
          <div class="text-4xl mb-2">🎯</div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
{:else}
<div class="space-y-6">
          <!-- Size Selection -->
          <div>
            <label class="block text-sm font-medium mb-2">{t('selectSizes')}</label>
            <div class="flex flex-wrap gap-2">
              {#each ICO_SIZES as size (size)}
<button 
                  onclick={() => toggleSize(size)}
                  class={`px-4 py-2 rounded-lg ${
                    selectedSizes.includes(size)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {size}×{size}
                </button>
{/each}
            </div>
          </div>

          <!-- Previews -->
          <div>
            <h3 class="text-sm font-medium mb-2">{t('preview')}</h3>
            <div class="flex flex-wrap gap-4 items-end">
              {#each previews as preview (preview.size)}
<div 
                  class={`text-center p-2 rounded-lg ${
                    selectedSizes.includes(preview.size)
                      ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  style="min-width: {Math.max(preview.size + 16, 60)}"
                >
                  <img
                    src={preview.dataUrl}
                    alt={`${preview.size}x${preview.size}`}
                    width={preview.size}
                    height={preview.size}
                    class="mx-auto border border-gray-300 dark:border-gray-600"
                    style="width: {preview.size}; height: {preview.size}; image-rendering: pixelated; aspect-ratio: 1/1"
                  />
                  <p class="text-xs mt-1 text-gray-600 dark:text-gray-400">{preview.size}px</p>
                  <button
                    onclick={() => downloadPng(preview.size)}
                    class="text-xs text-blue-600 hover:underline mt-1"
                  >
                    PNG
                  </button>
                </div>
{/each}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              onclick={downloadIco}
              disabled={selectedSizes.length === 0}
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
            >
              {t('downloadIco')} ({selectedSizes.length} {t('sizes')})
            </button>
            <button
              onclick={() => { image = null; previews = []; }}
              class="btn-secondary"
            >
              {tg('clear')}
            </button>
          </div>
        </div>
{/if}
    </div>
  
