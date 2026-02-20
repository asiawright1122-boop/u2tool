<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['webp-to-png'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.webp-to-png.${key}`;
  }

  let imageUrl = $state('');

  let quality = $state(100);

  let fileName = $state('converted');

  let canvasRef = $state(null);

  let fileInputRef = $state(null);

  // Functions
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      fileName = file.name.replace(/\.[^/.]+$/, '');
      const reader = new FileReader();
      reader.onload = (event) => {
        imageUrl = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/webp') {
      fileName = file.name.replace(/\.[^/.]+$/, '');
      const reader = new FileReader();
      reader.onload = (event) => {
        imageUrl = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  function convertToPng() {
    if (!imageUrl) return;

    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${fileName}.png`;
          a.click();
          URL.revokeObjectURL(downloadUrl);
        }
      }, 'image/png', quality / 100);
    };
    img.src = imageUrl;
  }
  function clearImage() {
    imageUrl = '';
    fileName = 'converted';
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-6">
      <div
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors"
      >
        {#if imageUrl}
<div class="space-y-4">
            <img
              src={imageUrl}
              alt="Preview"
              class="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
            />
            <button
              onclick={clearImage}
              class="text-sm text-red-500 hover:text-red-600"
            >
              {t('removeImage')}
            </button>
          </div>
{:else}
<div class="space-y-4">
            <div class="text-6xl"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>
            <p class="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
            <input
              bind:this={fileInputRef}
              type="file"
              accept="image/webp"
              onchange={handleFileUpload}
              class="hidden"
              id="webp-upload"
            />
            <label
              for="webp-upload"
              class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {t('selectFile')}
            </label>
          </div>
{/if}
      </div>

      {#if imageUrl}
<div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fileName')}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  bind:value={fileName}
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <span class="text-gray-500">.png</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('quality')}: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onchange={(e) => quality = Number(e.target.value)}
                class="w-full"
              />
            </div>
          </div>

          <button
            onclick={convertToPng}
            class="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {t('download')}
          </button>
        </div>
{/if}

      <canvas bind:this={canvasRef} class="hidden"></canvas>
    </div>
  
