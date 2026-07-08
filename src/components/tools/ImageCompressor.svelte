<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['imageCompressor'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.imageCompressor.${key}`;
  }

  let originalImage = $state(null);

  let compressedImage = $state(null);

  let originalSize = $state(0);

  let compressedSize = $state(0);

  let quality = $state(80);

  let fileName = $state('');

  let isProcessing = $state(false);

  let fileInputRef = $state(null);

  // Functions
  function handleFileSelect(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    fileName = file.name;
    originalSize = file.size;

    const reader = new FileReader();
    reader.onload = (event) => {
      originalImage = event.target?.result as string;
      compressedImage = null;
      compressedSize = 0;
    };
    reader.readAsDataURL(file);
  }
  function compressImage() {
    if (!originalImage) return;

    isProcessing = true;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        isProcessing = false;
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Compress to JPEG with specified quality
      const compressed = canvas.toDataURL('image/jpeg', quality / 100);
      compressedImage = compressed;

      // Calculate compressed size
      const base64Length = compressed.split(',')[1].length;
      const compressedBytes = Math.ceil((base64Length * 3) / 4);
      compressedSize = compressedBytes;

      isProcessing = false;
    };
    img.src = originalImage;
  }
  function downloadCompressed() {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_compressed.jpg`;
    link.click();
  }
  function formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  function getSavingsPercent() {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round((1 - compressedSize / originalSize) * 100);
  }
  function clearAll() {
    originalImage = null;
    compressedImage = null;
    originalSize = 0;
    compressedSize = 0;
    fileName = '';
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-6">
      <!-- Quality Control -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="image-compressor-field-4" class="text-sm text-gray-600 dark:text-gray-300">{t('quality')}:</label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onchange={(e) => quality = Number(e.target.value)}
            class="w-32" id="image-compressor-field-4" />
          <span class="text-sm font-mono w-12 text-gray-900 dark:text-white">{quality}%</span>
        </div>
        <button
          onclick={clearAll}
          class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-white"
        >
          {t('clear')}
        </button>
      </div>

      <!-- File Input -->
      <div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
        onclick={() => fileInputRef?.click()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-transparent"
      >
        <input
          bind:this={fileInputRef}
          type="file"
          accept="image/*"
          onchange={handleFileSelect}
          class="hidden"
        />
        <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>
        <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        {#if fileName}
<p class="text-sm text-gray-600 dark:text-gray-300 mt-2">{fileName}</p>
{/if}
      </div>

      <!-- Preview -->
      {#if originalImage}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('original')}</div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{formatSize(originalSize)}</span>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              <img
                src={originalImage}
                alt="Original"
                class="max-w-full max-h-64 object-contain"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('compressed')}</div>
              {#if compressedSize > 0}
<span class="text-sm text-green-600 dark:text-green-400">
                  {formatSize(compressedSize)} ({t('saved')} {getSavingsPercent()}%)
                </span>
{/if}
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
              {#if compressedImage}
<img
                  src={compressedImage}
                  alt="Compressed"
                  class="max-w-full max-h-64 object-contain"
                />
{:else}
<p class="text-gray-600 dark:text-gray-300">{t('compressFirst')}</p>
{/if}
            </div>
          </div>
        </div>
{/if}

      <!-- Actions -->
      {#if originalImage}
<div class="flex justify-center gap-4">
          <button
            onclick={compressImage}
            disabled={isProcessing}
            class="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium text-white"
          >
            {isProcessing ? t('processing') : t('compress')}
          </button>
          {#if compressedImage}
<button
              onclick={downloadCompressed}
              class="px-6 py-2 bg-emerald-500 hover:bg-green-700 rounded-lg font-medium text-white"
            >
              {t('download')}
            </button>
{/if}
        </div>
{/if}

      <!-- Stats -->
      {#if compressedSize > 0}
<div class="grid grid-cols-3 gap-4 text-center">
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatSize(originalSize)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('originalSize')}</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{formatSize(compressedSize)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('compressedSize')}</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{getSavingsPercent()}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('reduction')}</div>
          </div>
        </div>
{/if}
    </div>

