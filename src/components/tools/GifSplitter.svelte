<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gif-splitter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gif-splitter.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import JSZip from 'jszip';

  // Types
  interface GifFrame {
  dataUrl: string;
  delay: number;
  index: number;
}

  let gif = $state(null);

  let frames = $state([]);

  let selectedFrames = $state([]);

  let isProcessing = $state(false);

  let fileInputRef = $state(null);

  // Functions
  async function handleGifUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes('gif')) return;

    isProcessing = true;
    gif = URL.createObjectURL(file);

    try {
      // Use gifuct-js to parse GIF
      const { parseGIF, decompressFrames } = await import('gifuct-js');
      const arrayBuffer = await file.arrayBuffer();
      let gif = parseGIF(arrayBuffer);
      const gifFrames = decompressFrames(gif, true);

      const extractedFrames: GifFrame[] = [];

      for (let i = 0; i < gifFrames.length; i++) {
        const frame = gifFrames[i];
        const canvas = document.createElement('canvas');
        canvas.width = frame.dims.width;
        canvas.height = frame.dims.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        ctx.putImageData(imageData, 0, 0);

        extractedFrames.push({
          dataUrl: canvas.toDataURL('image/png'),
          delay: frame.delay,
          index: i,
        });
      }

      frames = extractedFrames;
      selectedFrames = extractedFrames.map((_, i) => i);
    } catch (error) {
      console.error('GIF parsing error:', error);
      // Fallback: just show the GIF
      frames = [];
    }

    isProcessing = false;
  }
  function toggleFrame(index: number) {
    selectedFrames = selectedFrames.includes(index) ? selectedFrames.filter((i) => i !== index) : [...selectedFrames, index].sort((a, b) => a - b)
    ;
  }
  function selectAll() {
    selectedFrames = frames.map((_, i) => i);
  }
  function deselectAll() {
    selectedFrames = [];
  }
  function _downloadSingle(frame: GifFrame) {
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = `frame-${frame.index + 1}.png`;
    link.click();
  }
  async function downloadSelected() {
    if (selectedFrames.length === 0) return;

    const zip = new JSZip();
    selectedFrames.forEach((index) => {
      const frame = frames[index];
      const base64Data = frame.dataUrl.split(',')[1];
      zip.file(`frame-${index + 1}.png`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gif-frames-${selectedFrames.length}.zip`;
    link.click();
  }
  function clearAll() {
    gif = null;
    frames = [];
    selectedFrames = [];
    if (fileInputRef) {
      fileInputRef.value = '';
    }
  }

</script>


    <div class="space-y-6">
      <!-- Upload -->
      {#if !gif}
<label class="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500">
          <input
            bind:this={fileInputRef}
            type="file"
            accept="image/gif"
            onchange={handleGifUpload}
            class="hidden"
          />
          <div class="text-4xl mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/></svg></div>
          <p class="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
{:else}
<div class="space-y-6">
          <!-- Original GIF -->
          <div class="flex items-start gap-4">
            <div>
              <h3 class="text-sm font-medium mb-2">{t('originalGif')}</h3>
              <img src={gif} alt="Original GIF" class="max-w-xs rounded border border-gray-200 dark:border-gray-700" />
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {t('totalFrames')}: {frames.length}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {t('selectedFrames')}: {selectedFrames.length}
              </p>
            </div>
          </div>

          <!-- Frame Selection -->
          {#if frames.length > 0}
<div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="font-medium">{t('frames')}</h3>
                <div class="flex gap-2">
                  <button onclick={selectAll} class="text-sm text-amber-600 hover:underline">
                    {t('selectAll')}
                  </button>
                  <button onclick={deselectAll} class="text-sm text-amber-600 hover:underline">
                    {t('deselectAll')}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {#each frames as frame (frame.index)}
<div 
                    onclick={() => toggleFrame(frame.index)}
                    class={`relative cursor-pointer rounded overflow-hidden ${
                      selectedFrames.includes(frame.index)
                        ? 'ring-2 ring-amber-500'
                        : 'opacity-50'
                    }`}
                  >
                    <img
                      src={frame.dataUrl}
                      alt={`Frame ${frame.index + 1}`}
                      class="w-full aspect-square object-cover"
                    />
                    <span class="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-1">
                      {frame.index + 1}
                    </span>
                    {#if selectedFrames.includes(frame.index)}<span class="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1">
                        ✓
                      </span>{/if}
                  </div>
{/each}
              </div>
            </div>
{/if}

          <!-- Actions -->
          <div class="flex gap-4">
            <button
              onclick={downloadSelected}
              disabled={selectedFrames.length === 0}
              class="px-6 py-2 bg-emerald-500 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg"
            >
              {t('downloadSelected')} ({selectedFrames.length})
            </button>
            <button onclick={clearAll} class="btn-secondary">
              {tg('clear')}
            </button>
          </div>
        </div>
{/if}

      {#if isProcessing}
<div class="text-center py-8">
          <div class="animate-spin text-4xl mb-2">⏳</div>
          <p class="text-gray-600 dark:text-gray-300">{t('processing')}</p>
        </div>
{/if}
    </div>
  
