<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['svg-to-image'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.svg-to-image.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { sanitizeSvg } from '@/lib/sanitize';

  let svgCode = $state('');

  let format = $state('png');

  let scale = $state(1);

  let bgColor = $state('#ffffff');

  let transparent = $state(true);

  let previewUrl = $state(null);

  let canvasRef = $state(null);

  // Functions
  const formats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
  ];
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      svgCode = event.target?.result as string;
    };
    reader.readAsText(file);
  }
  function convert() {
    if (!svgCode.trim() || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create SVG blob
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Fill background
      if (!transparent || format === 'jpeg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw SVG
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Generate preview
      const dataUrl = canvas.toDataURL(`image/${format}`, 0.92);
      previewUrl = dataUrl;

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error('Failed to load SVG');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }
  function download() {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = `converted-image.${format}`;
    link.href = previewUrl;
    link.click();
  }
  function loadSample() {
    svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="20" fill="url(#grad1)"/>
  <circle cx="100" cy="80" r="40" fill="white" opacity="0.9"/>
  <rect x="60" y="130" width="80" height="50" rx="10" fill="white" opacity="0.9"/>
  <text x="100" y="170" text-anchor="middle" fill="#667eea" font-size="14" font-family="Arial">SVG Demo</text>
</svg>`;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{t('uploadSvg')}</label>
            <input
              type="file"
              accept=".svg"
              onchange={handleFileUpload}
              class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div class="flex gap-2">
            <button
              onclick={loadSample}
              class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg text-sm"
            >
              {t('loadSample')}
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('svgCode')}</label>
            <textarea
              bind:value={svgCode}
              class="tool-textarea h-48 font-mono text-sm"
              placeholder={t('placeholder')}></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">{t('format')}</label>
              <select
                value={format}
                onchange={(e) => format = e.target.value as typeof format}
                class="tool-input"
              >
                {#each formats as f (f.value)}
<option  value={f.value}>{f.label}</option>
{/each}
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{t('scale')}: {scale}x</label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={scale}
                onchange={(e) => scale = Number(e.target.value)}
                class="w-full"
              />
            </div>
          </div>

          {#if format !== 'png' || !transparent}
<div>
              <label class="block text-sm font-medium mb-2">{t('backgroundColor')}</label>
              <div class="flex gap-2">
                <input
                  type="color"
                  bind:value={bgColor}
                  class="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  bind:value={bgColor}
                  class="tool-input flex-1"
                />
              </div>
            </div>
{:else}
{null}
{/if}

          {#if format === 'png'}
<label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={transparent}
                class="w-4 h-4"
              />
              <span class="text-sm">{t('transparentBackground')}</span>
            </label>
{/if}

          <div class="flex gap-3">
            <button
              onclick={convert}
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {tg('convert')}
            </button>
            <button
              onclick={download}
              disabled={!previewUrl}
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg"
            >
              {tg('download')}
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-white">{t('preview')}</label>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[300px] flex items-center justify-center"
            style="background-image: linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px">
            {#if previewUrl}
<img src={previewUrl} alt="Preview" class="max-w-full max-h-[400px] object-contain" />
{:else if svgCode}
<div class="max-w-full max-h-[400px]" >{@html sanitizeSvg(svgCode)}</div>
{:else}
<div class="text-gray-500 dark:text-gray-300 text-center">
                <p class="text-4xl mb-2">📷</p>
                <p>{t('noPreview')}</p>
              </div>
{/if}
          </div>
          <canvas bind:this={canvasRef} class="hidden"></canvas>
        </div>
      </div>
    </div>
  
