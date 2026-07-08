<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['mesh-gradient-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.mesh-gradient-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ColorPoint {
  x: number;
  y: number;
  color: string;
}

  let points = $state([
    { x: 0, y: 0, color: '#ff6b6b' },
    { x: 100, y: 0, color: '#4ecdc4' },
    { x: 0, y: 100, color: '#45b7d1' },
    { x: 100, y: 100, color: '#96ceb4' },
  ]);

  let blur = $state(40);

  let copied = $state(false);

  let cssCode = $derived.by(() => {
    const gradients = points.map((p, i) => {
      return `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${blur}%)`;
    }).join(',\n    ');

    return `background: 
    ${gradients};
background-color: ${points[0]?.color || '#ffffff'};`;
  });

  let previewStyle = $derived.by(() => {
    const gradients = points.map((p) => {
      return `radial-gradient(at ${p.x}% ${p.y}%, ${p.color} 0px, transparent ${blur}%)`;
    }).join(', ');

    return {
      background: gradients,
      backgroundColor: points[0]?.color || '#ffffff',
    };
  });

  // Functions
  function updatePoint(index: number, field: keyof ColorPoint, value: string | number) {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    points = newPoints;
  }
  function randomize() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#a29bfe', '#fd79a8'];
    points = points.map(p => ({
      ...p,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }
  async function handleCopy() {
    await navigator.clipboard.writeText(cssCode);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Preview -->
      <div 
        class="h-64 rounded-lg"
        style={previewStyle}></div>

      <!-- Color Points -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="tool-label">
            {t('colorPoints')}
          </div>
          <button
            onclick={randomize}
            class="px-3 py-1 text-sm bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors"
          >
            {t('randomize')}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each points as point, index (index)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  value={point.color}
                  onchange={(e) => updatePoint(index, 'color', e.target.value)}
                  class="w-10 h-10 rounded cursor-pointer"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('point')} {index + 1}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for={`mesh-gradient-generator-field-8-${index}`} class="block text-xs text-gray-500 dark:text-gray-400 mb-1">X: {point.x}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={point.x}
                    onchange={(e) => updatePoint(index, 'x', Number(e.target.value))}
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" id={`mesh-gradient-generator-field-8-${index}`} />
                </div>
                <div>
                  <label for={`mesh-gradient-generator-field-7-${index}`} class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Y: {point.y}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={point.y}
                    onchange={(e) => updatePoint(index, 'y', Number(e.target.value))}
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" id={`mesh-gradient-generator-field-7-${index}`} />
                </div>
              </div>
            </div>
{/each}
        </div>
      </div>

      <!-- Blur Control -->
      <div>
        <label for="mesh-gradient-generator-field-6" class="tool-label">
          {t('blur')}: {blur}%
        </label>
        <input
          type="range"
          min="20"
          max="80"
          value={blur}
          onchange={(e) => blur = Number(e.target.value)}
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" id="mesh-gradient-generator-field-6" />
      </div>

      <!-- CSS Output -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="tool-label">
            CSS {common('output')}
          </div>
          <button
            onclick={handleCopy}
            class="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  
