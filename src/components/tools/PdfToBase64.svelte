<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['pdf-to-base64'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.pdf-to-base64.${key}`;
  }

  let base64 = $state('');

  let fileName = $state('');

  let fileSize = $state(0);

  let includeDataUri = $state(true);

  let error = $state('');

  function handleFileChange(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      error = t('errorNotPdf');
      return;
    }

    error = '';
    fileName = file.name;
    fileSize = file.size;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        base64 = result;
      } else {
        base64 = result.split(',')[1] || '';
      }
    };
    reader.onerror = () => {
      error = t('errorReading');
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      error = t('errorNotPdf');
      return;
    }

    error = '';
    fileName = file.name;
    fileSize = file.size;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (includeDataUri) {
        base64 = result;
      } else {
        base64 = result.split(',')[1] || '';
      }
    };
    reader.readAsDataURL(file);
  }

  // Functions
  function handleCopy() {
    navigator.clipboard.writeText(base64);
  }
  function handleClear() {
    base64 = '';
    fileName = '';
    fileSize = 0;
    error = '';
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
      if (includeDataUri) {
        base64 = base64.startsWith('data:') ? base64 : `data:application/pdf;base64,${base64}`;
      } else {
        base64 = base64.split(',')[1] || base64;
      }
    }
  }

</script>


    <div class="space-y-6">
      <div role="region"
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-amber-500 transition-colors"
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onchange={handleFileChange}
          class="hidden"
          id="pdf-input"
        />
        <label for="pdf-input" class="cursor-pointer">
          <div class="text-4xl mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></div>
          <p class="text-gray-600 dark:text-gray-300 mb-2">{t('dropzone')}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('acceptedFormat')}</p>
        </label>
      </div>

      {#if error}
<div class="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
{/if}

      {#if fileName}
<div class="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{fileName}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {t('originalSize')}: {formatFileSize(fileSize)} |
                Base64: {formatFileSize(base64.length)}
              </p>
            </div>
            <button
              onclick={handleClear}
              class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
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
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('base64Output')}
          </label>
          {#if base64}
<button
              onclick={handleCopy}
              class="text-sm text-amber-600 hover:text-amber-800"
            >
              {t('copy')}
            </button>
{/if}
        </div>
        <textarea
          value={base64}
          readOnly
          placeholder={t('outputPlaceholder')}
          class="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-xs"></textarea>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-amber-700 dark:text-amber-400">{t('infoText')}</p>
      </div>
    </div>

