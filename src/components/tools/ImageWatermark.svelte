<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-watermark'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-watermark.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let image = $state(null);

  let watermarkText = $state('© My Watermark');

  let fontSize = $state(24);

  let opacity = $state(50);

  let position = $state('bottom-right');

  let color = $state('#ffffff');

  let rotation = $state(0);

  let canvasRef = $state(null);

  let originalImage = $state(null);

  $effect(() => {
    if (!originalImage || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Set watermark style
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;

    const textMetrics = ctx.measureText(watermarkText);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    if (position === 'tile') {
      // Tile watermark
      ctx.save();
      const spacing = Math.max(textWidth, textHeight) * 2;
      for (let y = 0; y < canvas.height + spacing; y += spacing) {
        for (let x = 0; x < canvas.width + spacing; x += spacing) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();
    } else {
      // Single watermark
      let x = 0;
      let y = 0;
      const padding = 20;

      switch (position) {
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = (canvas.height + textHeight) / 2;
          break;
        case 'top-left':
          x = padding;
          y = textHeight + padding;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = textHeight + padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'bottom-right':
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
      }

      ctx.save();
      ctx.translate(x + textWidth / 2, y - textHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(watermarkText, -textWidth / 2, textHeight / 2);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  });

  // Functions
  const positions = [
    { value: 'center', labelKey: 'posCenter' },
    { value: 'top-left', labelKey: 'posTopLeft' },
    { value: 'top-right', labelKey: 'posTopRight' },
    { value: 'bottom-left', labelKey: 'posBottomLeft' },
    { value: 'bottom-right', labelKey: 'posBottomRight' },
    { value: 'tile', labelKey: 'posTile' },
  ];
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
    link.download = 'watermarked-image.png';
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
            <label class="block text-sm font-medium mb-2">{t('watermarkText')}</label>
            <input
              type="text"
              bind:value={watermarkText}
              class="tool-input"
              placeholder={t('textPlaceholder')}
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('position')}</label>
            <select
              value={position}
              onchange={(e) => position = e.target.value as typeof position}
              class="tool-input"
            >
              {#each positions as pos (pos.value)}
<option  value={pos.value}>
                  {t(pos.labelKey)}
                </option>
{/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('fontSize')}: {fontSize}px</label>
            <input
              type="range"
              min="12"
              max="120"
              value={fontSize}
              onchange={(e) => fontSize = Number(e.target.value)}
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('opacity')}: {opacity}%</label>
            <input
              type="range"
              min="10"
              max="100"
              value={opacity}
              onchange={(e) => opacity = Number(e.target.value)}
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('rotation')}: {rotation}°</label>
            <input
              type="range"
              min="-45"
              max="45"
              value={rotation}
              onchange={(e) => rotation = Number(e.target.value)}
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('color')}</label>
            <div class="flex gap-2">
              <input
                type="color"
                bind:value={color}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={color}
                class="tool-input flex-1"
              />
            </div>
          </div>

          <button
            onclick={downloadImage}
            disabled={!image}
            class="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg"
          >
            {tg('download')}
          </button>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-2 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px]">
          {#if image}
<canvas
              bind:this={canvasRef}
              class="max-w-full max-h-[500px] object-contain border border-gray-300 dark:border-gray-600 rounded"></canvas>
{:else}
<div class="text-gray-500 dark:text-gray-300 text-center">
              <p class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></p>
              <p>{t('noImage')}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
