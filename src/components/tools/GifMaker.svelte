<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gif-maker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gif-maker.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface FrameImage {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
}

  let frames = $state([]);

  let delay = $state(500);

  let loop = $state(true);

  let quality = $state(10);

  let isProcessing = $state(false);

  let result = $state(null);

  let previewFrame = $state(0);

  let fileInputRef = $state(null);

  function handleImageUpload(e: Event) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newFrame: FrameImage = {
            id: Math.random().toString(36).substr(2, 9),
            dataUrl: event.target?.result as string,
            width: img.width,
            height: img.height,
          };
          frames = [...frames, newFrame];
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

  // Functions
  function removeFrame(id: string) {
    frames = frames.filter((f) => f.id !== id);
    result = null;
  }
  function moveFrame(index: number, direction: 'up' | 'down') {
    const newFrames = [...frames];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= frames.length) return;
    [newFrames[index], newFrames[newIndex]] = [newFrames[newIndex], newFrames[index]];
    frames = newFrames;
    result = null;
  }
  async function createGif() {
    if (frames.length < 2) return;
    isProcessing = true;

    try {
      // Dynamic import gif.js
      const GIF = (await import('gif.js')).default;

      // Find max dimensions
      const maxWidth = Math.max(...frames.map((f) => f.width));
      const maxHeight = Math.max(...frames.map((f) => f.height));

      const gif = new GIF({
        workers: 2,
        quality,
        repeat: loop ? 0 : -1,
        width: maxWidth,
        height: maxHeight,
        workerScript: gifWorkerUrl,
      });

      // Add frames
      for (const frame of frames) {
        const img = new Image();
        img.src = frame.dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, maxWidth, maxHeight);
          const x = (maxWidth - img.width) / 2;
          const y = (maxHeight - img.height) / 2;
          ctx.drawImage(img, x, y);
          gif.addFrame(canvas, { delay, copy: true });
        }
      }

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        result = url;
        isProcessing = false;
      });

      gif.render();
    } catch (error) {
      console.error('GIF creation error:', error);
      isProcessing = false;
      // Fallback: create simple animated preview
      result = frames[0]?.dataUrl || null;
    }
  }
  function downloadGif() {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `animation-${frames.length}frames.gif`;
    link.click();
  }

</script>


    <div class="space-y-6">
      <!-- Settings -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">{t('frameDelay')}: {delay}ms</label>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={delay}
            onchange={(e) => delay = Number(e.target.value)}
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">{t('quality')}: {quality}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={quality}
            onchange={(e) => quality = Number(e.target.value)}
            class="w-full"
          />
          <p class="text-xs text-gray-500">{t('qualityHint')}</p>
        </div>
        <div class="flex items-center">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              bind:checked={loop}
              class="w-4 h-4"
            />
            <span class="text-sm font-medium">{t('loopForever')}</span>
          </label>
        </div>
      </div>

      <!-- Upload Area -->
      <div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}
        onclick={() => fileInputRef?.click()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500"
      >
        <input
          bind:this={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onchange={handleImageUpload}
          class="hidden"
        />
        <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/><line x1="17" x2="22" y1="17" y2="17"/></svg></div>
        <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
      </div>

      <!-- Frame List -->
      {#if frames.length > 0}
<div class="space-y-4">
          <h3 class="font-medium">{t('frames')} ({frames.length})</h3>
          <div class="flex flex-wrap gap-2">
            {#each frames as frame, index (frame.id)}
<div
                class={`relative group w-20 h-20 ${
                  index === previewFrame ? 'ring-2 ring-amber-500' : ''
                }`}
                style="aspect-ratio: 1/1"
              >
                <img
                  src={frame.dataUrl}
                  alt={`Frame ${index + 1}`}
                  width={80}
                  height={80}
                  class="w-full h-full object-cover rounded border border-gray-200 dark:border-gray-700"
                />
                <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                  <button
                    onclick={() => moveFrame(index, 'up')}
                    disabled={index === 0}
                    class="p-1 bg-white rounded text-xs disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    onclick={() => removeFrame(frame.id)}
                    class="p-1 bg-red-500 text-white rounded text-xs"
                  >
                    ✕
                  </button>
                  <button
                    onclick={() => moveFrame(index, 'down')}
                    disabled={index === frames.length - 1}
                    class="p-1 bg-white rounded text-xs disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
                <span class="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-tr">
                  {index + 1}
                </span>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Actions -->
      {#if frames.length >= 2}
<div class="flex gap-4">
          <button
            onclick={createGif}
            disabled={isProcessing}
            class="btn-primary px-8"
          >
            {isProcessing ? t('processing') : t('createGif')}
          </button>
          {#if result}
<button onclick={downloadGif} class="px-6 py-2 bg-emerald-500 hover:bg-green-700 text-white rounded-lg">
              {tg('download')}
            </button>
{/if}
          <button
            onclick={() => { frames = []; result = null; }}
            class="btn-secondary"
          >
            {tg('clear')}
          </button>
        </div>
{/if}

      <!-- Result -->
      {#if result}
<div class="space-y-2">
          <h3 class="font-medium">{t('result')}</h3>
          <div
            class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-center"
            style="min-height: 200px"
          >
            <img
              src={result}
              alt="GIF Result"
              class="max-w-full max-h-96 rounded"
              style="aspect-ratio: auto"
            />
          </div>
        </div>
{/if}
    </div>

