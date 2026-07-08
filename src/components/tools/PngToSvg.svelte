<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['png-to-svg'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.png-to-svg.${key}`;
  }

  let imageUrl = $state('');

  let svgOutput = $state('');

  let threshold = $state(128);

  let mode = $state('embed');

  let copied = $state(false);

  let timerRef = $state(null);

  let canvasRef = $state(null);

  let fileInputRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageUrl = event.target?.result as string;
        svgOutput = '';
      };
      reader.readAsDataURL(file);
    }
  }
  function embedAsSvg() {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
  <image href="${imageUrl}" width="${img.width}" height="${img.height}"/>
</svg>`;
      svgOutput = svg;
    };
    img.src = imageUrl;
  }
  function traceToSvg() {
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

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple edge detection and path generation
      const paths: string[] = [];
      const visited = new Set<string>();

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          if (brightness < threshold && !visited.has(`${x},${y}`)) {
            visited.add(`${x},${y}`);
            paths.push(`M${x},${y}h1v1h-1z`);
          }
        }
      }

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}">
  <path d="${paths.join('')}" fill="black"/>
</svg>`;
      svgOutput = svg;
    };
    img.src = imageUrl;
  }
  function convert() {
    if (mode === 'embed') {
      embedAsSvg();
    } else {
      traceToSvg();
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(svgOutput);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function downloadSvg() {
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
        {#if imageUrl}
<div class="space-y-4">
            <img
              src={imageUrl}
              alt="Preview"
              class="max-w-full max-h-48 mx-auto rounded-lg"
            />
            <button
              onclick={() => {
                imageUrl = '';
                svgOutput = '';
                if (fileInputRef) fileInputRef.value = '';
              }}
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
              accept="image/png,image/jpeg,image/gif"
              onchange={handleFileUpload}
              class="hidden"
              id="png-upload"
            />
            <label
              for="png-upload"
              class="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
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
              <label for="png-to-svg-field-6" class="tool-label">
                {t('conversionMode')}
              </label>
              <select
                value={mode}
                onchange={(e) => mode = e.target.value as 'embed' | 'trace'}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="png-to-svg-field-6">
                <option value="embed">{t('embedMode')}</option>
                <option value="trace">{t('traceMode')}</option>
              </select>
            </div>
            {#if mode === 'trace'}
<div>
                <label for="png-to-svg-field-5" class="tool-label">
                  {t('threshold')}: {threshold}
                </label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={threshold}
                  onchange={(e) => threshold = Number(e.target.value)}
                  class="w-full" id="png-to-svg-field-5" />
              </div>
{/if}
          </div>

          <button
            onclick={convert}
            class="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {t('convert')}
          </button>
        </div>
{/if}

      {#if svgOutput}
<div class="space-y-4">
          <div>
            <label for="png-to-svg-field-4" class="tool-label">
              {t('svgOutput')}
            </label>
            <textarea
              value={svgOutput}
              readOnly
              class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm" id="png-to-svg-field-4"></textarea>
          </div>
          <div class="flex gap-4">
            <button
              onclick={copyToClipboard}
              class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {copied ? t('copied') : t('copy')}
            </button>
            <button
              onclick={downloadSvg}
              class="px-6 py-3 btn-success rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {t('download')}
            </button>
          </div>
        </div>
{/if}

      <canvas bind:this={canvasRef} class="hidden"></canvas>
    </div>
  
