<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['image-flip-rotate'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.image-flip-rotate.${key}`;
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

  let flipH = $state(false);

  let flipV = $state(false);

  let rotation = $state(0);

  let canvasRef = $state(null);

  $effect(() => {
    if (!originalImage || !canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    const newWidth = originalImage.width * cos + originalImage.height * sin;
    const newHeight = originalImage.width * sin + originalImage.height * cos;

    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Move to center
    ctx.translate(newWidth / 2, newHeight / 2);

    // Apply rotation
    ctx.rotate(radians);

    // Apply flip
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Draw image centered
    ctx.drawImage(originalImage, -originalImage.width / 2, -originalImage.height / 2);

    ctx.restore();
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
        flipH = false;
        flipV = false;
        rotation = 0;
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
  function downloadImage() {
    if (!canvasRef) return;
    const link = document.createElement('a');
    link.download = `transformed-${rotation}deg.png`;
    link.href = canvasRef.toDataURL('image/png');
    link.click();
  }
  const rotatePresets = [0, 90, 180, 270];

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
            <label class="block text-sm font-medium mb-2">{t('flip')}</label>
            <div class="flex gap-2">
              <button
                onclick={() => flipH = !flipH}
                class={`flex-1 px-4 py-2 rounded-lg ${flipH ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                ↔ {t('horizontal')}
              </button>
              <button
                onclick={() => flipV = !flipV}
                class={`flex-1 px-4 py-2 rounded-lg ${flipV ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                ↕ {t('vertical')}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{t('rotation')}: {rotation}°</label>
            <div class="flex gap-2 mb-2">
              {#each rotatePresets as deg (deg)}
<button 
                  onclick={() => rotation = deg}
                  class={`flex-1 px-2 py-1 rounded text-sm ${rotation === deg ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {deg}°
                </button>
{/each}
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={rotation}
              onchange={(e) => rotation = Number(e.target.value)}
              class="w-full"
            />
          </div>

          <div class="flex gap-2">
            <button
              onclick={() => rotation = (rotation - 90 + 360) % 360}
              class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              ↺ -90°
            </button>
            <button
              onclick={() => rotation = (rotation + 90) % 360}
              class="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              ↻ +90°
            </button>
          </div>

          <button
            onclick={() => { flipH = false; flipV = false; rotation = 0; }}
            class="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          >
            {t('reset')}
          </button>

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
              class="max-w-full max-h-[500px] object-contain"></canvas>
{:else}
<div class="text-gray-500 text-center">
              <p class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg></p>
              <p>{t('noImage')}</p>
            </div>
{/if}
        </div>
      </div>
    </div>
  
