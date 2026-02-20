<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['neumorphism-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.neumorphism-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let bgColor = $state('#e0e5ec');

  let distance = $state(20);

  let intensity = $state(15);

  let blur = $state(60);

  let shape = $state('flat');

  let borderRadius = $state(50);

  let copied = $state(false);

  let lightColor = $derived(adjustColor(bgColor, intensity));

  let darkColor = $derived(adjustColor(bgColor, -intensity));

  let cssCode = $derived.by(() => {
    return `/* Neumorphism Effect */
background: ${getGradient()};
border-radius: ${borderRadius}px;
box-shadow: ${getShadow()};`;
  });

  let previewStyle = $derived(({
    background: getGradient(),
    borderRadius: `${borderRadius}px`,
    boxShadow: getShadow(),
  }));

  // Functions
  function adjustColor(hex: string, amount: number) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
  function getGradient() {
    switch (shape) {
      case 'concave':
        return `linear-gradient(145deg, ${darkColor}, ${lightColor})`;
      case 'convex':
        return `linear-gradient(145deg, ${lightColor}, ${darkColor})`;
      default:
        return bgColor;
    }
  }
  function getShadow() {
    const isPressed = shape === 'pressed';
    const sign = isPressed ? 'inset ' : '';
    return `${sign}${distance}px ${distance}px ${blur}px ${darkColor}, ${sign}${-distance}px ${-distance}px ${blur}px ${lightColor}`;
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
        class="h-64 rounded-lg flex items-center justify-center"
        style="background: {bgColor}"
      >
        <div 
          style={previewStyle}
          class="w-32 h-32 flex items-center justify-center"
        >
          <span class="text-gray-600 text-sm font-medium">Preview</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('backgroundColor')}
            </label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                bind:value={bgColor}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={bgColor}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('shape')}
            </label>
            <div class="grid grid-cols-4 gap-2">
              {#each (['flat', 'concave', 'convex', 'pressed'] as const) as s (s)}
<button 
                  onclick={() => shape = s}
                  class={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    shape === s
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
                  }`}
                >
                  {t(`shapes.${s}`)}
                </button>
{/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('distance')}: {distance}px
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={distance}
              onchange={(e) => distance = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('intensity')}: {intensity}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={intensity}
              onchange={(e) => intensity = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('blur')}: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={blur}
              onchange={(e) => blur = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('borderRadius')}: {borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={borderRadius}
              onchange={(e) => borderRadius = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      </div>

      <!-- CSS Output -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS {common('output')}
          </label>
          <button
            onclick={handleCopy}
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  
