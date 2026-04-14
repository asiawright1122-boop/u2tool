<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['video-to-base64'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.video-to-base64.${key}`;
  }

  let base64 = $state('');

  let fileName = $state('');

  let fileSize = $state(0);

  let mimeType = $state('');

  let includeDataUri = $state(true);

  let error = $state('');

  let videoUrl = $state('');

  let isLoading = $state(false);

  let videoRef = $state(null);

  function handleFileChange(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      error = t('errorNotVideo');
      return;
    }

    if (file.size > maxFileSize) {
      error = t('errorTooLarge');
      return;
    }

    error = '';
    isLoading = true;
    fileName = file.name;
    fileSize = file.size;
    mimeType = file.type;
    videoUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        base64 = result;
      } else {
        base64 = result.split(',')[1] || '';
      }
      isLoading = false;
    };
    reader.onerror = () => {
      error = t('errorReading');
      isLoading = false;
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      error = t('errorNotVideo');
      return;
    }

    if (file.size > maxFileSize) {
      error = t('errorTooLarge');
      return;
    }

    error = '';
    isLoading = true;
    fileName = file.name;
    fileSize = file.size;
    mimeType = file.type;
    videoUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        base64 = result;
      } else {
        base64 = result.split(',')[1] || '';
      }
      isLoading = false;
    };
    reader.readAsDataURL(file);
  }

  // Functions
  const maxFileSize = 10 * 1024 * 1024;
  function handleCopy() {
    navigator.clipboard.writeText(base64);
  }
  function handleClear() {
    base64 = '';
    fileName = '';
    fileSize = 0;
    mimeType = '';
    error = '';
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      videoUrl = '';
    }
  }
  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  function toggleDataUri() {
    includeDataUri = !includeDataUri;
    if (base64) {
      if (!includeDataUri && mimeType) {
        base64 = `data:${mimeType};base64,` + base64;
      } else {
        base64 = base64.split(',')[1] || '';
      }
    }
  }

</script>


    <div class="space-y-6">
      <div
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-amber-500 transition-colors bg-gray-50 dark:bg-transparent"
      >
        <input
          type="file"
          accept="video/*"
          onchange={handleFileChange}
          class="hidden"
          id="video-input"
        />
        <label for="video-input" class="cursor-pointer">
          <div class="text-4xl mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/><line x1="17" x2="22" y1="17" y2="17"/></svg></div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">{t('dropzone')}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">{t('maxSize')}</p>
        </label>
      </div>

      {#if error}
<div class="tool-error">
          {error}
        </div>
{/if}

      {#if isLoading}
<div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-center">
          <div class="animate-spin inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full mb-2"></div>
          <p class="text-amber-700 dark:text-amber-400">{t('processing')}</p>
        </div>
{/if}

      {#if fileName}
{#if !isLoading}
        <div class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {mimeType} | {t('originalSize')}: {formatFileSize(fileSize)} | Base64: {formatFileSize(base64.length)}
              </p>
            </div>
            <button
              onclick={handleClear}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          {#if videoUrl}
<video bind:this={videoRef} controls class="w-full max-h-64 rounded">
              <source src={videoUrl} type={mimeType} />
            </video>
{/if}
        </div>
      {/if}
{/if}

      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDataUri}
            onchange={toggleDataUri}
            class="w-4 h-4 text-amber-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('includeDataUri')}</span>
        </label>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="tool-label mb-0">
            {t('base64Output')}
          </label>
          {#if base64}
<button
              onclick={handleCopy}
              class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
            >
              {t('copy')}
            </button>
{/if}
        </div>
        <textarea
          value={base64}
          readOnly
          placeholder={t('outputPlaceholder')}
          class="tool-textarea text-xs"></textarea>
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <h3 class="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('warning')}</h3>
        <p class="text-sm text-yellow-700 dark:text-yellow-400">{t('warningText')}</p>
      </div>
    </div>
  
