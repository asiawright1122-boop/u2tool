<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-border'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-border.${key}`;
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

  let borderWidth = $state(20);

  let borderColor = $state('#ffffff');

  let canvasRef = $state(null);

  $effect(() => {
    if (!originalImage || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newWidth = originalImage.width + borderWidth * 2;
    const newHeight = originalImage.height + borderWidth * 2;

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Fill border/padding
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, newWidth, newHeight);

    // Draw image in center
    ctx.drawImage(originalImage, borderWidth, borderWidth);
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
    link.download = `bordered-${borderWidth}px.png`;
    link.href = canvasRef.toDataURL('image/png');
    link.click();
  }
  const presetColors = ['#ffffff', '#000000', '#f5f5f5', '#1a1a1a', '#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

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

          <div>
            <label class="block text-sm font-medium mb-2">{t('borderWidth')}: {borderWidth}px</label>
            <input
              type="range"
              min="0"
              max="100"
              value={borderWidth}
              onchange={(e) => borderWidth = Number(e.target.value)}
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('borderColor')}</label>
            <div class="flex flex-wrap gap-2 mb-2">
              {#each presetColors as color (color)}
<button 
                  onclick={() => borderColor = color}
                  class={`w-8 h-8 rounded border-2 ${borderColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                  style="background-color: {color}"
                />
{/each}
            </div>
            <div class="flex gap-2">
              <input
                type="color"
                bind:value={borderColor}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={borderColor}
                class="tool-input flex-1"
              />
            </div>
          </div>

          <button
            onclick={downloadImage}
            disabled={!image}
            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')}
          </button>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {#if image}
<canvas
              bind:this={canvasRef}
              class="max-w-full max-h-[500px] object-contain shadow-lg"></canvas>
{:else}
<div class="text-gray-500 text-center">
              <p class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></p>
              <p>{t('noImage')}</p>
            </div>
{/if}
        </div>
      </div>

      <!-- Info -->
      {#if originalImage}
<div class="text-sm text-gray-600 dark:text-gray-400">
          {t('originalSize')}: {originalImage.width}×{originalImage.height} → 
          {t('newSize')}: {originalImage.width + borderWidth * 2}×{originalImage.height + borderWidth * 2}
        </div>
{/if}
    </div>
  
