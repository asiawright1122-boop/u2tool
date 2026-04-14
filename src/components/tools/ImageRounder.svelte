<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-rounder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-rounder.${key}`;
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

  let radius = $state(20);

  let circleMode = $state(false);

  let canvasRef = $state(null);

  $effect(() => {
    if (!originalImage || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = originalImage.width;
    let height = originalImage.height;

    if (circleMode) {
      const size = Math.min(width, height);
      canvas.width = size;
      canvas.height = size;
      width = size;
      height = size;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create rounded rectangle or circle path
    ctx.beginPath();
    if (circleMode) {
      ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    } else {
      const r = Math.min(radius, width / 2, height / 2);
      ctx.moveTo(r, 0);
      ctx.lineTo(width - r, 0);
      ctx.quadraticCurveTo(width, 0, width, r);
      ctx.lineTo(width, height - r);
      ctx.quadraticCurveTo(width, height, width - r, height);
      ctx.lineTo(r, height);
      ctx.quadraticCurveTo(0, height, 0, height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
    }
    ctx.closePath();
    ctx.clip();

    // Draw image
    if (circleMode) {
      const size = Math.min(originalImage.width, originalImage.height);
      const sx = (originalImage.width - size) / 2;
      const sy = (originalImage.height - size) / 2;
      ctx.drawImage(originalImage, sx, sy, size, size, 0, 0, width, height);
    } else {
      ctx.drawImage(originalImage, 0, 0);
    }
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
    link.download = circleMode ? 'circle-image.png' : `rounded-${radius}px.png`;
    link.href = canvasRef.toDataURL('image/png');
    link.click();
  }

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
              class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white hover:file:bg-amber-700"
            />
          </div>

          <div>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={circleMode}
                class="w-4 h-4"
              />
              <span class="text-sm font-medium">{t('circleMode')}</span>
            </label>
          </div>

          {#if !circleMode}
<div>
              <label class="block text-sm font-medium mb-2">{t('radius')}: {radius}px</label>
              <input
                type="range"
                min="0"
                max="200"
                value={radius}
                onchange={(e) => radius = Number(e.target.value)}
                class="w-full"
              />
            </div>
{/if}

          <button
            onclick={downloadImage}
            disabled={!image}
            class="w-full px-4 py-2 bg-emerald-500 hover:bg-green-700 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')} PNG
          </button>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-2 flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] rounded-lg min-h-[400px]">
          {#if image}
<canvas
              bind:this={canvasRef}
              class="max-w-full max-h-[500px] object-contain"></canvas>
{:else}
<div class="text-gray-500 dark:text-gray-400 text-center">
              <p class="text-4xl mb-2">⭕</p>
              <p>{t('noImage')}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
