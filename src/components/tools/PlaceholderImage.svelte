<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['placeholder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.placeholder.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let width = $state(400);

  let height = $state(300);

  let bgColor = $state('#374151');

  let textColor = $state('#9ca3af');

  let text = $state('');

  let canvasRef = $state(null);

  // Functions
  const displayText = text || `${width} × ${height}`;
  function generateImage() {
    const canvas = canvasRef;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    const fontSize = Math.min(width, height) / 8;
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, width / 2, height / 2);
  }
  function downloadImage() {
    generateImage();
    const canvas = canvasRef;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `placeholder-${width}x${height}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
  function copyDataUrl() {
    generateImage();
    const canvas = canvasRef;
    if (!canvas) return;
    navigator.clipboard.writeText(canvas.toDataURL('image/png'));
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('width')}</label>
          <input
            type="number"
            value={width}
            min={1}
            max={2000}
            onchange={(e) => width = Math.min(2000, Math.max(1, Number(e.target.value)))}
            class="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('height')}</label>
          <input
            type="number"
            value={height}
            min={1}
            max={2000}
            onchange={(e) => height = Math.min(2000, Math.max(1, Number(e.target.value)))}
            class="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('bgColor')}</label>
          <div class="flex gap-2">
            <input
              type="color"
              bind:value={bgColor}
              class="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={bgColor}
              class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-2 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('textColor')}</label>
          <div class="flex gap-2">
            <input
              type="color"
              bind:value={textColor}
              class="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={textColor}
              class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-2 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('customText')}</label>
        <input
          type="text"
          bind:value={text}
          placeholder={`${width} × ${height}`}
          class="w-full bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div class="flex gap-2 flex-wrap">
        <button
          onclick={generateImage}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={downloadImage}
          class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
        >
          {tg('download')} PNG
        </button>
        <button
          onclick={copyDataUrl}
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-900 dark:text-white"
        >
          {tg('copy')} Data URL
        </button>
      </div>

      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-center items-center overflow-auto">
        <canvas
          bind:this={canvasRef}
          class="max-w-full border border-gray-300 dark:border-gray-600 rounded"
          style="max-height: 400px"></canvas>
      </div>

      <div class="grid grid-cols-4 gap-2">
        {#each [
          [100, 100], [200, 200], [300, 200], [400, 300],
          [800, 600], [1200, 630], [1920, 1080], [300, 250]
        ] as [w, h] (`${w}x${h}`)}
<button 
            onclick={() => { width = w; height = h; }}
            class="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors text-gray-900 dark:text-white"
          >
            {w}×{h}
          </button>
{/each}
      </div>
    </div>
  
