<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['imageConverter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.imageConverter.${key}`;
  }

  // Types
  type ImageFormat = 'png' | 'jpeg' | 'webp';

  let originalImage = $state(null);

  let convertedImage = $state(null);

  let originalFormat = $state('');

  let targetFormat = $state('png');

  let quality = $state(90);

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
    const format = file.type.split('/')[1].toUpperCase();
    originalFormat = format;

    const reader = new FileReader();
    reader.onload = (event) => {
      originalImage = event.target?.result as string;
      convertedImage = null;
    };
    reader.readAsDataURL(file);
  }
  function convertImage() {
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

      // For PNG, fill with white background if original has transparency
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${targetFormat}`;
      const qualityValue = targetFormat === 'png' ? undefined : quality / 100;
      const converted = canvas.toDataURL(mimeType, qualityValue);
      convertedImage = converted;

      isProcessing = false;
    };
    img.src = originalImage;
  }
  function downloadConverted() {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.href = convertedImage;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}.${targetFormat}`;
    link.click();
  }
  function clearAll() {
    originalImage = null;
    convertedImage = null;
    originalFormat = '';
    fileName = '';
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }
  const formats: { value: ImageFormat; label: string }[] = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
  ];

</script>


    <div class="space-y-6">
      <!-- Controls -->
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('targetFormat')}:</label>
          <select
            value={targetFormat}
            onchange={(e) => {
              targetFormat = e.target.value as ImageFormat;
              convertedImage = null;
            }}
            class="tool-select py-1.5 px-3 text-sm h-9 w-auto"
          >
            {#each formats as f (f.value)}
<option  value={f.value}>
                {f.label}
              </option>
{/each}
          </select>
        </div>

        {#if targetFormat !== 'png'}
<div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 dark:text-gray-300">{t('quality')}:</label>
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
{/if}

        <button
          onclick={clearAll}
          class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm"
        >
          {t('clear')}
        </button>
      </div>

      <!-- File Input -->
      <div
        onclick={() => fileInputRef?.click()}
        class="tool-dropzone"
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
<p class="text-sm text-gray-500 dark:text-gray-300 mt-2">
            {fileName} ({originalFormat})
          </p>
{/if}
      </div>

      <!-- Preview -->
      {#if originalImage}
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('original')} ({originalFormat})
              </label>
            </div>
            <div class="tool-card flex items-center justify-center min-h-[200px] p-4">
              <img
                src={originalImage}
                alt="Original"
                class="max-w-full max-h-64 object-contain"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {t('converted')} ({targetFormat.toUpperCase()})
              </label>
            </div>
            <div class="tool-card flex items-center justify-center min-h-[200px] p-4">
              {#if convertedImage}
<img
                  src={convertedImage}
                  alt="Converted"
                  class="max-w-full max-h-64 object-contain"
                />
{:else}
<p class="text-gray-500 dark:text-gray-300">{t('convertFirst')}</p>
{/if}
            </div>
          </div>
        </div>
{/if}

      <!-- Actions -->
      {#if originalImage}
<div class="flex justify-center gap-4">
          <button
            onclick={convertImage}
            disabled={isProcessing}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
          >
            {isProcessing ? t('processing') : t('convert')}
          </button>
          {#if convertedImage}
<button
              onclick={downloadConverted}
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              {t('download')}
            </button>
{/if}
        </div>
{/if}

      <!-- Format Info -->
      <div class="tool-card bg-gray-50 dark:bg-gray-800/50">
        <h3 class="font-medium mb-3 text-gray-900 dark:text-white">{t('formatInfo')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div class="font-medium text-blue-600 dark:text-blue-400">PNG</div>
            <p class="text-gray-600 dark:text-gray-300">{t('pngDesc')}</p>
          </div>
          <div>
            <div class="font-medium text-green-600 dark:text-green-400">JPEG</div>
            <p class="text-gray-600 dark:text-gray-300">{t('jpegDesc')}</p>
          </div>
          <div>
            <div class="font-medium text-purple-600 dark:text-purple-400">WebP</div>
            <p class="text-gray-600 dark:text-gray-300">{t('webpDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  
