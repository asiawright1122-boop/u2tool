<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['wave-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.wave-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let height = $state(100);

  let frequency = $state(2);

  let amplitude = $state(20);

  let layers = $state(1);

  let color = $state('#6366f1');

  let position = $state('bottom');

  let copied = $state(false);

  let svgCode = $derived.by(() => {
    const paths = Array.from({ length: layers }, (_, i) => {
      let opacity = 1 - (i * 0.2);
      return `  <path d="${generateWavePath(i)}" fill="${color}" fill-opacity="${opacity}" />`;
    }).join('\n');

    return `<svg viewBox="0 0 1440 ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
${paths}
</svg>`;
  });

  // Functions
  function generateWavePath(layerIndex: number) {
    const width = 1440;
    const baseY = position === 'bottom' ? height - amplitude : amplitude;
    const layerOffset = layerIndex * 5;
    const layerAmplitude = amplitude - layerIndex * 3;
    
    let d = position === 'bottom' 
      ? `M 0 ${height} L 0 ${baseY + layerOffset}`
      : `M 0 0 L 0 ${baseY - layerOffset}`;

    const points = 100;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = baseY + layerOffset + Math.sin((i / points) * Math.PI * 2 * frequency + layerIndex) * layerAmplitude;
      d += ` L ${x} ${y}`;
    }

    d += position === 'bottom'
      ? ` L ${width} ${height} Z`
      : ` L ${width} 0 Z`;

    return d;
  }
  async function handleCopy() {
    await navigator.clipboard.writeText(svgCode);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function handleDownload() {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wave.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <!-- Preview -->
      <div class="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden" style="height: {height + 50}">
        <div 
          class={`absolute left-0 right-0 ${position === 'bottom' ? 'bottom-0' : 'top-0'}`}>{@html svgCode}</div>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('height')}: {height}px
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={height}
              onchange={(e) => height = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('frequency')}: {frequency}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={frequency}
              onchange={(e) => frequency = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('amplitude')}: {amplitude}px
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={amplitude}
              onchange={(e) => amplitude = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('layers')}: {layers}
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={layers}
              onchange={(e) => layers = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('position')}
            </label>
            <div class="flex gap-2">
              <button
                onclick={() => position = 'top'}
                class={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  position === 'top'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                {t('top')}
              </button>
              <button
                onclick={() => position = 'bottom'}
                class={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  position === 'bottom'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                {t('bottom')}
              </button>
            </div>
          </div>

          <div>
            <label class="tool-label">
              {t('color')}
            </label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                bind:value={color}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={color}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          onclick={handleCopy}
          class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          {copied ? common('copied') : common('copy')} SVG
        </button>
        <button
          onclick={handleDownload}
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-emerald-500 transition-colors"
        >
          {common('download')} SVG
        </button>
      </div>

      <!-- SVG Output -->
      <div>
        <label class="tool-label">
          SVG {common('output')}
        </label>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono max-h-48">
          {svgCode}
        </pre>
      </div>
    </div>
  
