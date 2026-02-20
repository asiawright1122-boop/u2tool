<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['base64-image-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.base64-image-converter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Mode = 'encode' | 'decode';

  let mode = $state('encode');

  let base64Input = $state('');

  let base64Output = $state('');

  let imagePreview = $state(null);

  let error = $state('');

  let copied = $state(false);

  let fileInfo = $state(null);

  let fileInputRef = $state(null);

  function handleFileSelect(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error = 'Please select an image file';
      return;
    }

    fileInfo = {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    };

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      base64Output = result;
      imagePreview = result;
      error = '';
    };
    reader.onerror = () => {
      error = 'Failed to read file';
    };
    reader.readAsDataURL(file);
  }

  function handleBase64Decode() {
    if (!base64Input.trim()) {
      error = t('errorInvalidInput');
      imagePreview = null;
      return;
    }

    try {
      let dataUrl = base64Input.trim();
      
      // Add data URL prefix if missing
      if (!dataUrl.startsWith('data:')) {
        // Try to detect image type from base64
        const firstChars = dataUrl.substring(0, 10);
        let mimeType = 'image/png';
        if (firstChars.startsWith('/9j/')) mimeType = 'image/jpeg';
        else if (firstChars.startsWith('iVBOR')) mimeType = 'image/png';
        else if (firstChars.startsWith('R0lGO')) mimeType = 'image/gif';
        else if (firstChars.startsWith('UklGR')) mimeType = 'image/webp';
        
        dataUrl = `data:${mimeType};base64,${dataUrl}`;
      }

      // Validate by creating an image
      const img = new Image();
      img.onload = () => {
        imagePreview = dataUrl;
        error = '';
      };
      img.onerror = () => {
        error = t('errorInvalidFormat');
        imagePreview = null;
      };
      img.src = dataUrl;
    } catch {
      error = t('errorInvalidFormat');
      imagePreview = null;
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(base64Output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function handleDownload() {
    if (!imagePreview) return;

    const link = document.createElement('a');
    link.href = imagePreview;
    link.download = 'image.' + (imagePreview.includes('jpeg') ? 'jpg' : 'png');
    link.click();
  }

  function handleClear() {
    base64Input = '';
    base64Output = '';
    imagePreview = null;
    error = '';
    fileInfo = null;
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef;
      if (input) {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  // Functions
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

</script>


    <div class="space-y-6">
      <!-- Mode Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => { mode = 'encode'; handleClear(); }}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('imageToBase64')}
        </button>
        <button
          onclick={() => { mode = 'decode'; handleClear(); }}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('base64ToImage')}
        </button>
      </div>

      {#if mode === 'encode'}
<!-- Encode Mode: Image to Base64 -->
        <div class="space-y-6">
          <!-- File Upload -->
          <div
            ondrop={handleDrop}
            ondragover={(e) => e.preventDefault()}
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
            onclick={() => fileInputRef?.click()}
          >
            <input
              bind:this={fileInputRef}
              type="file"
              accept="image/*"
              onchange={handleFileSelect}
              class="hidden"
            />
            <div class="text-gray-500 dark:text-gray-400">
              <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-lg font-medium">{t('dropImageHere')}</p>
              <p class="text-sm mt-1">{t('supportsFormats')}</p>
            </div>
          </div>

          <!-- File Info -->
          {#if fileInfo}

            <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">{t('name')}:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{fileInfo.name}</span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">{t('size')}:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{fileInfo.size}</span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">{t('type')}:</span>
                  <span class="ml-2 text-gray-900 dark:text-white">{fileInfo.type}</span>
                </div>
              </div>
            </div>

          {/if}

          <!-- Preview and Output -->
          {#if imagePreview}

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('preview')}
                </label>
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" class="max-w-full max-h-64 mx-auto" style="aspect-ratio: auto" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Base64 {tCommon('output')}
                </label>
                <textarea
                  value={base64Output}
                  readOnly
                  class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs resize-none"></textarea>
              </div>
            </div>

          {/if}

          <!-- Actions -->
          {#if base64Output}

            <div class="flex gap-3 flex-wrap">
              <button
                onclick={handleCopy}
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={handleClear}
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {tCommon('clear')}
              </button>
            </div>

          {/if}
        </div>}
{:else}
<!-- Decode Mode: Base64 to Image -->
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base64 {tCommon('input')}
            </label>
            <textarea
              bind:value={base64Input}
              placeholder={t("inputPlaceholder")}
              class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none"></textarea>
          </div>

          <div class="flex gap-3 flex-wrap">
            <button
              onclick={handleBase64Decode}
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('decode')}
            </button>
            <button
              onclick={handleClear}
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {tCommon('clear')}
            </button>
          </div>

          <!-- Preview -->
          {#if imagePreview}

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('preview')}
              </label>
              <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] flex items-center justify-center">
                <img src={imagePreview} alt="Decoded" class="max-w-full max-h-96 mx-auto" style="aspect-ratio: auto" />
              </div>
              <div class="mt-4">
                <button
                  onclick={handleDownload}
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {tCommon('download')}
                </button>
              </div>
            </div>

          {/if}
        </div>}
{/if}

      <!-- Error -->
      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
{/if}
    </div>
  
