<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['favicon'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.favicon.${key}`;
  }

  // Types
  interface GeneratedFavicon {
  size: number;
  dataUrl: string;
}

  const FAVICON_SIZES = [16, 24, 32, 48, 64, 128, 180, 192, 256, 512];

  let originalImage = $state<string | null>(null);

  let favicons = $state<GeneratedFavicon[]>([]);

  let fileName = $state('');

  let isProcessing = $state(false);

  let selectedSizes = $state([16, 32, 48, 64]);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  let fileInputRef = $state<HTMLInputElement | null>(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

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
      originalImage = event.target?.result as string;
      favicons = [];
    };
    reader.readAsDataURL(file);
  }
  function toggleSize(size: number) {
    selectedSizes = selectedSizes.includes(size) ? selectedSizes.filter((s) => s !== size) : [...selectedSizes, size].sort((a, b) => a - b)
    ;
  }
  function generateFavicons() {
    if (!originalImage || selectedSizes.length === 0) return;

    isProcessing = true;

    const img = new Image();
    img.onload = () => {
      const generated: GeneratedFavicon[] = [];

      for (const size of selectedSizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Draw image scaled to fit
        ctx.drawImage(img, 0, 0, size, size);

        generated.push({
          size,
          dataUrl: canvas.toDataURL('image/png'),
        });
      }

      favicons = generated;
      isProcessing = false;
    };
    img.src = originalImage;
  }
  function downloadFavicon(favicon: GeneratedFavicon) {
    const link = document.createElement('a');
    link.href = favicon.dataUrl;
    link.download = `favicon-${favicon.size}x${favicon.size}.png`;
    link.click();
  }
  function downloadAll() {
    favicons.forEach((favicon, index) => {
      setTimeout(() => downloadFavicon(favicon), index * 100);
    });
  }
  function clearAll() {
    originalImage = null;
    favicons = [];
    fileName = '';
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }
  function generateIcoHtml() {
    const links = favicons
      .map(
        (f) =>
          `<link rel="icon" type="image/png" sizes="${f.size}x${f.size}" href="/favicon-${f.size}x${f.size}.png">`
      )
      .join('\n');
    return links;
  }
  function copyHtml() {
    navigator.clipboard.writeText(generateIcoHtml());
  }

</script>


    <div class="space-y-6">
      <!-- Size Selection -->
      <div class="flex flex-wrap items-center gap-4">
        <label class="text-sm text-gray-700 dark:text-gray-300">{t('sizes')}:</label>
        <div class="flex flex-wrap gap-2">
          {#each FAVICON_SIZES as size (size)}
<button 
              onclick={() => toggleSize(size)}
              class={`px-3 py-1 rounded text-sm ${
                selectedSizes.includes(size)
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {size}x{size}
            </button>
{/each}
        </div>
        <button
          onclick={clearAll}
          class="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm ml-auto text-gray-900 dark:text-gray-100"
        >
          {t('clear')}
        </button>
      </div>

      <!-- File Input -->
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
        <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div>
        <p class="text-gray-700 dark:text-gray-300">{t('dropzone')}</p>
        <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">{t('hint')}</p>
        {#if fileName}
<p class="text-sm text-gray-600 dark:text-gray-300 mt-2">{fileName}</p>
{/if}
      </div>

      <!-- Original Preview -->
      {#if originalImage}
<div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">{t('original')}</label>
          <div class="flex items-center justify-center min-h-[192px]">
            <img
              src={originalImage}
              alt="Original"
              class="max-w-full max-h-48 object-contain"
              style="aspect-ratio: auto"
            />
          </div>
        </div>
{/if}

      <!-- Generate Button -->
      {#if originalImage}
<div class="flex justify-center">
          <button
            onclick={generateFavicons}
            disabled={isProcessing || selectedSizes.length === 0}
            class="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium text-white"
          >
            {isProcessing ? t('processing') : t('generate')}
          </button>
        </div>
{/if}

      <!-- Generated Favicons -->
      {#if favicons.length > 0}
<div class="space-y-4">
          <div class="flex justify-between items-center">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('generated')}</label>
            <button
              onclick={downloadAll}
              class="px-3 py-1.5 bg-emerald-500 hover:bg-green-700 rounded text-sm text-white"
            >
              {t('downloadAll')}
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {#each favicons as favicon (favicon.size)}
<div 
                class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center"
              >
                <div class="flex items-center justify-center h-20 mb-2" style="aspect-ratio: 1/1">
                  <img
                    src={favicon.dataUrl}
                    alt={`${favicon.size}x${favicon.size}`}
                    width={Math.min(favicon.size, 64)}
                    height={Math.min(favicon.size, 64)}
                    style="width: {Math.min(favicon.size, 64)}; height: {Math.min(favicon.size, 64)}"
                    class="pixelated"
                  />
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {favicon.size}x{favicon.size}
                </div>
                <button
                  onclick={() => downloadFavicon(favicon)}
                  class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs w-full text-gray-900 dark:text-gray-100"
                >
                  {t('download')}
                </button>
              </div>
{/each}
          </div>

          <!-- HTML Code -->
          <div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-center mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('htmlCode')}</label>
              <button
                onclick={copyHtml}
                class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
              >
                {t('copy')}
              </button>
            </div>
            <pre class="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
              <code>{generateIcoHtml()}</code>
            </pre>
          </div>
        </div>
{/if}
    </div>
  
