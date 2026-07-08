<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-frosted-glass'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-frosted-glass.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let image = $state(null);

  let originalImage = $state(null);

  let blurIntensity = $state(10);

  let canvasRef = $state(null);

  $effect(() => {
    if (!originalImage || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Apply blur filter
    ctx.filter = `blur(${blurIntensity}px)`;
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
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  function downloadImage() {
    if (!canvasRef) return;
    const link = document.createElement('a');
    link.download = `frosted-glass-${blurIntensity}px.png`;
    link.href = canvasRef.toDataURL('image/png');
    link.click();
  }
  const presets = [
    { label: t('light'), value: 5 },
    { label: t('medium'), value: 15 },
    { label: t('heavy'), value: 30 },
  ];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Settings -->
        <div class="space-y-4">
          <div>
            <label for="image-frosted-glass-field-5" class="block text-sm font-medium mb-2">{t('uploadImage')}</label>
            <input
              type="file"
              accept="image/*"
              onchange={handleImageUpload}
              class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-700" id="image-frosted-glass-field-5" />
          </div>

          <div>
            <div class="block text-sm font-medium mb-2">{t('presets')}</div>
            <div class="flex gap-2">
              {#each presets as preset (preset.value)}
<button 
                  onclick={() => blurIntensity = preset.value}
                  class={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    blurIntensity === preset.value
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
{/each}
            </div>
          </div>

          <div>
            <label for="image-frosted-glass-field-4" class="block text-sm font-medium mb-2">
              {t('blurIntensity')}: {blurIntensity}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={blurIntensity}
              onchange={(e) => blurIntensity = Number(e.target.value)}
              class="w-full" id="image-frosted-glass-field-4" />
          </div>

          <button
            onclick={downloadImage}
            disabled={!image}
            class="w-full px-4 py-2 bg-emerald-500 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')}
          </button>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {#if image}
<canvas
              bind:this={canvasRef}
              class="max-w-full max-h-[500px] object-contain rounded-lg"></canvas>
{:else}
<div class="text-gray-500 text-center">
              <p class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg></p>
              <p>{t('noImage')}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
