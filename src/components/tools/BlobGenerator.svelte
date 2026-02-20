<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['blob-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.blob-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let complexity = $state(6);

  let contrast = $state(50);

  let size = $state(200);

  let color = $state('#6366f1');

  let path = $state('');

  let copied = $state(false);

  function generateBlob() {
    const points: { x: number; y: number }[] = [];
    const angleStep = (Math.PI * 2) / complexity;
    const radius = size / 2;
    const center = size / 2;

    for (let i = 0; i < complexity; i++) {
      const angle = i * angleStep;
      const variance = (contrast / 100) * radius * 0.5;
      const r = radius - variance + Math.random() * variance * 2;
      points.push({
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      });
    }

    // Create smooth bezier curve
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    d += ' Z';
    path = d;
  }

  // Functions
  const svgCode = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="${color}" />
</svg>`;
  const cssCode = `clip-path: path('${path}');`;
  async function handleCopySvg() {
    await navigator.clipboard.writeText(svgCode);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function handleDownload() {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blob.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <!-- Preview -->
      <div class="flex justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <path d={path} fill={color}></path>
        </svg>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('complexity')}: {complexity}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={complexity}
              onchange={(e) => complexity = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('contrast')}: {contrast}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={contrast}
              onchange={(e) => contrast = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('size')}: {size}px
            </label>
            <input
              type="range"
              min="100"
              max="400"
              value={size}
              onchange={(e) => size = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
          onclick={generateBlob}
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('generate')}
        </button>
        <button
          onclick={handleCopySvg}
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {copied ? common('copied') : t('copySvg')}
        </button>
        <button
          onclick={handleDownload}
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {common('download')} SVG
        </button>
      </div>

      <!-- SVG Output -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SVG {common('output')}
        </label>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono max-h-48">
          {svgCode}
        </pre>
      </div>

      <!-- CSS Output -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          CSS clip-path
        </label>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  
