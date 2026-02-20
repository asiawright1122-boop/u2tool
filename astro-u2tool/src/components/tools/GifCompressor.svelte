<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gif-compressor'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gif-compressor.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let originalGif = $state(null);

  let compressedGif = $state(null);

  let originalSize = $state(0);

  let compressedSize = $state(0);

  let compressionLevel = $state(50);

  let colorReduction = $state(false);

  let maxColors = $state(128);

  let isProcessing = $state(false);

  let fileInputRef = $state(null);

  // Functions
  function handleGifUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('gif')) return;

    originalSize = file.size;
    originalGif = URL.createObjectURL(file);
    compressedGif = null;
    compressedSize = 0;
  }
  async function compressGif() {
    if (!originalGif) return;
    isProcessing = true;

    try {
      // Fetch the original GIF
      const response = await fetch(originalGif);
      const blob = await response.blob();

      // For now, we'll use a simple approach - re-encode with reduced quality
      // In production, you'd use a proper GIF compression library
      const { parseGIF, decompressFrames } = await import('gifuct-js');
      const GIF = (await import('gif.js')).default;

      const arrayBuffer = await blob.arrayBuffer();
      const gif = parseGIF(arrayBuffer);
      const frames = decompressFrames(gif, true);

      if (frames.length === 0) {
        throw new Error('No frames found');
      }

      // Calculate new dimensions based on compression level
      const scale = compressionLevel / 100;
      const newWidth = Math.max(Math.floor(frames[0].dims.width * scale), 10);
      const newHeight = Math.max(Math.floor(frames[0].dims.height * scale), 10);

      const encoder = new GIF({
        workers: 2,
        quality: colorReduction ? Math.floor(maxColors / 10) : 10,
        width: newWidth,
        height: newHeight,
        workerScript: '/gif.worker.js',
      });

      for (const frame of frames) {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Create temp canvas with original frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) continue;

        const imageData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        tempCtx.putImageData(imageData, 0, 0);

        // Scale down
        ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        encoder.addFrame(canvas, { delay: frame.delay, copy: true });
      }

      encoder.on('finished', (blob: Blob) => {
        compressedGif = URL.createObjectURL(blob);
        compressedSize = blob.size;
        isProcessing = false;
      });

      encoder.render();
    } catch (error) {
      console.error('Compression error:', error);
      isProcessing = false;
    }
  }
  function downloadCompressed() {
    if (!compressedGif) return;
    const link = document.createElement('a');
    link.href = compressedGif;
    link.download = 'compressed.gif';
    link.click();
  }
  function formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  function getSavingsPercent() {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round((1 - compressedSize / originalSize) * 100);
  }
  function clearAll() {
    originalGif = null;
    compressedGif = null;
    originalSize = 0;
    compressedSize = 0;
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-6">
      <!-- Settings -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">
            {t('compressionLevel')}: {compressionLevel}%
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={compressionLevel}
            onchange={(e) => compressionLevel = Number(e.target.value)}
            class="w-full"
          />
          <p class="text-xs text-gray-500">{t('compressionHint')}</p>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              bind:checked={colorReduction}
              class="w-4 h-4"
            />
            <span class="text-sm font-medium">{t('reduceColors')}</span>
          </label>
          {#if colorReduction}
<div>
              <label class="text-sm">{t('maxColors')}: {maxColors}</label>
              <input
                type="range"
                min="16"
                max="256"
                step="16"
                value={maxColors}
                onchange={(e) => maxColors = Number(e.target.value)}
                class="w-full"
              />
            </div>
{/if}
        </div>
        <div class="flex items-end">
          <button onclick={clearAll} class="btn-secondary w-full">
            {tg('clear')}
          </button>
        </div>
      </div>

      <!-- Upload -->
      {#if !originalGif}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input
            bind:this={fileInputRef}
            type="file"
            accept="image/gif"
            onchange={handleGifUpload}
            class="hidden"
          />
          <div class="text-4xl mb-2">📦</div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
{:else}
<div class="space-y-6">
          <!-- Preview -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">{t('original')}</label>
                <span class="text-sm text-gray-600 dark:text-gray-400">{formatSize(originalSize)}</span>
              </div>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                <img src={originalGif} alt="Original GIF" class="max-w-full max-h-64 object-contain" style="aspect-ratio: auto" />
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="text-sm font-medium">{t('compressed')}</label>
                {#if compressedSize > 0}
<span class="text-sm text-green-600 dark:text-green-400">
                    {formatSize(compressedSize)} ({t('saved')} {getSavingsPercent()}%)
                  </span>
{/if}
              </div>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                {#if compressedGif}
<img src={compressedGif} alt="Compressed GIF" class="max-w-full max-h-64 object-contain" style="aspect-ratio: auto" />
{:else}
<p class="text-gray-500">{t('compressFirst')}</p>
{/if}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-center gap-4">
            <button
              onclick={compressGif}
              disabled={isProcessing}
              class="btn-primary px-8"
            >
              {isProcessing ? t('processing') : t('compress')}
            </button>
            {#if compressedGif}
<button onclick={downloadCompressed} class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                {tg('download')}
              </button>
{/if}
          </div>

          <!-- Stats -->
          {#if compressedSize > 0}
<div class="grid grid-cols-3 gap-4 text-center">
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatSize(originalSize)}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('originalSize')}</div>
              </div>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{formatSize(compressedSize)}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('compressedSize')}</div>
              </div>
              <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{getSavingsPercent()}%</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('reduction')}</div>
              </div>
            </div>
{/if}
        </div>
{/if}
    </div>
  
