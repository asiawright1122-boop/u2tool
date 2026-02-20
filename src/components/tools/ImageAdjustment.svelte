<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-adjustment'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-adjustment.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface AdjustmentParams {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  grayscale: number;
  sepia: number;
}

  let image = $state(null);

  let originalImage = $state(null);

  let params = $state(defaultParams);

  let canvasRef = $state(null);

  $effect(() => {
    if (!originalImage || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply CSS filters
    ctx.filter = `
      brightness(${params.brightness}%)
      contrast(${params.contrast}%)
      saturate(${params.saturation}%)
      hue-rotate(${params.hue}deg)
      blur(${params.blur}px)
      grayscale(${params.grayscale}%)
      sepia(${params.sepia}%)
    `;

    ctx.drawImage(originalImage, 0, 0);
  });

  // Functions
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        image = event.target?.result as string;
        params = defaultParams;
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  function updateParam(key: keyof AdjustmentParams, value: number) {
    params = ({ ...params, [key]: value });
  }
  function resetParams() {
    params = defaultParams;
  }
  function downloadImage() {
    if (!canvasRef) return;
    const link = document.createElement('a');
    link.download = 'adjusted-image.png';
    link.href = canvasRef.toDataURL('image/png');
    link.click();
  }
  const sliders = [
    { key: 'brightness' as const, label: t('brightness'), min: 0, max: 200, unit: '%' },
    { key: 'contrast' as const, label: t('contrast'), min: 0, max: 200, unit: '%' },
    { key: 'saturation' as const, label: t('saturation'), min: 0, max: 200, unit: '%' },
    { key: 'hue' as const, label: t('hue'), min: 0, max: 360, unit: '°' },
    { key: 'blur' as const, label: t('blur'), min: 0, max: 20, unit: 'px' },
    { key: 'grayscale' as const, label: t('grayscale'), min: 0, max: 100, unit: '%' },
    { key: 'sepia' as const, label: t('sepia'), min: 0, max: 100, unit: '%' },
  ];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Settings -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{t('uploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              onchange={handleImageUpload}
              class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {#each sliders as slider (slider.key)}
<div >
              <label class="block text-sm font-medium mb-1">
                {slider.label}: {params[slider.key]}{slider.unit}
              </label>
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                value={params[slider.key]}
                onchange={(e) => updateParam(slider.key, Number(e.target.value))}
                class="w-full"
              />
            </div>
{/each}

          <div class="flex gap-2">
            <button
              onclick={resetParams}
              class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              {t('reset')}
            </button>
            <button
              onclick={downloadImage}
              disabled={!image}
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
            >
              {tg('download')}
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {#if image}
<canvas
              bind:this={canvasRef}
              class="max-w-full max-h-[500px] object-contain"></canvas>
{:else}
<div class="text-gray-500 text-center">
              <p class="text-4xl mb-2">🎨</p>
              <p>{t('noImage')}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
