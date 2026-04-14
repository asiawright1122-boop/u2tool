<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['noise-texture-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.noise-texture-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let canvasRef = $state(null);

  let noiseType = $state('random');

  let intensity = $state(50);

  let scale = $state(1);

  let baseColor = $state('#1a1a2e');

  let noiseColor = $state('#ffffff');

  let size = $state(256);

  let copied = $state(false);

  $effect(() => {
    generateNoise();
  });

  // Functions
  function generateNoise() {
    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Fill base color
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    // Parse noise color
    const nr = parseInt(noiseColor.slice(1, 3), 16);
    const ng = parseInt(noiseColor.slice(3, 5), 16);
    const nb = parseInt(noiseColor.slice(5, 7), 16);

    const alpha = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      let noiseValue = 0;

      if (noiseType === 'random') {
        noiseValue = Math.random();
      } else if (noiseType === 'grain') {
        noiseValue = Math.random() > 0.5 ? 1 : 0;
      } else if (noiseType === 'perlin') {
        const x = (i / 4) % size;
        const y = Math.floor((i / 4) / size);
        noiseValue = (Math.sin(x / scale / 10) + Math.cos(y / scale / 10) + 2) / 4;
        noiseValue += (Math.random() - 0.5) * 0.3;
      }

      // Blend noise with base color
      data[i] = data[i] + (nr - data[i]) * noiseValue * alpha;
      data[i + 1] = data[i + 1] + (ng - data[i + 1]) * noiseValue * alpha;
      data[i + 2] = data[i + 2] + (nb - data[i + 2]) * noiseValue * alpha;
    }

    ctx.putImageData(imageData, 0, 0);
  }
  function handleDownload() {
    const canvas = canvasRef;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `noise-${noiseType}-${size}x${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
  async function handleCopyDataUrl() {
    const canvas = canvasRef;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    await navigator.clipboard.writeText(dataUrl);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  const cssCode = `background-image: url('data:image/png;base64,...');
/* Or use the downloaded PNG file */
background-repeat: repeat;`;

</script>


    <div class="space-y-6">
      <!-- Preview -->
      <div class="flex justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <canvas
          bind:this={canvasRef}
          class="border border-gray-300 dark:border-gray-600 rounded"
          style="image-rendering: pixelated"></canvas>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('noiseType')}
            </label>
            <div class="grid grid-cols-3 gap-2">
              {#each (['random', 'perlin', 'grain'] as const) as type (type)}
<button 
                  onclick={() => noiseType = type}
                  class={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    noiseType === type
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {t(`types.${type}`)}
                </button>
{/each}
            </div>
          </div>

          <div>
            <label class="tool-label">
              {t('intensity')}: {intensity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={intensity}
              onchange={(e) => intensity = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('scale')}: {scale}x
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={scale}
              onchange={(e) => scale = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('size')}: {size}px
            </label>
            <select
              value={size}
              onchange={(e) => size = Number(e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={64}>64 x 64</option>
              <option value={128}>128 x 128</option>
              <option value={256}>256 x 256</option>
              <option value={512}>512 x 512</option>
            </select>
          </div>

          <div>
            <label class="tool-label">
              {t('baseColor')}
            </label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                bind:value={baseColor}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={baseColor}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="tool-label">
              {t('noiseColor')}
            </label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                bind:value={noiseColor}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={noiseColor}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          onclick={generateNoise}
          class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          {t('regenerate')}
        </button>
        <button
          onclick={handleCopyDataUrl}
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {copied ? common('copied') : t('copyDataUrl')}
        </button>
        <button
          onclick={handleDownload}
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-emerald-500 transition-colors"
        >
          {common('download')} PNG
        </button>
      </div>

      <!-- CSS Usage -->
      <div>
        <label class="tool-label">
          CSS {t('usage')}
        </label>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  
