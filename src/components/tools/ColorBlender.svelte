<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['colorBlend'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.colorBlend.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let color1 = $state('#3b82f6');

  let color2 = $state('#ef4444');

  let steps = $state(5);

  let blendedColors = $derived.by(() => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return [];
    
    const colors: string[] = [];
    for (let i = 0; i <= steps + 1; i++) {
      const ratio = i / (steps + 1);
      const r = rgb1.r + (rgb2.r - rgb1.r) * ratio;
      const g = rgb1.g + (rgb2.g - rgb1.g) * ratio;
      const b = rgb1.b + (rgb2.b - rgb1.b) * ratio;
      colors.push(rgbToHex(r, g, b));
    }
    
    return colors;
  });

  // Functions
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
  function rgbToHex(r: number, g: number, b: number) {
    return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
  }
  function copyColor(color: string) {
    navigator.clipboard.writeText(color);
  }
  function copyAll() {
    navigator.clipboard.writeText(blendedColors.join('\n'));
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1" for="color1">{t('color1')}</label>
          <div class="flex gap-2">
            <input
              id="color1"
              type="color"
              bind:value={color1}
              class="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={color1}
              class="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1" for="color2">{t('color2')}</label>
          <div class="flex gap-2">
            <input
              id="color2"
              type="color"
              bind:value={color2}
              class="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={color2}
              class="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1" for="steps">{t('steps')}</label>
          <input
            id="steps"
            type="number"
            value={steps}
            min={1}
            max={20}
            onchange={(e) => steps = Math.min(20, Math.max(1, Number(e.target.value)))}  
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onclick={copyAll}
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        {tg('copy')} {tg('all')}
      </button>

      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div class="flex h-16 rounded-lg overflow-hidden mb-4">
          {#each blendedColors as color, i (i)}
            <div
              class="flex-1 cursor-pointer hover:scale-y-110 transition-transform"
              style="background-color: {color}"
              onclick={() => copyColor(color)}
              onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') copyColor(color); }}
              role="button"
              tabindex="0"
              title={color}
            ></div>
          {/each}
        </div>
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {#each blendedColors as color, i (i)}
            <button
              class="flex flex-col items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-2 transition-colors"
              onclick={() => copyColor(color)}
            >
              <div
                class="w-10 h-10 rounded-lg mb-1"
                style="background-color: {color}"
              ></div>
              <span class="text-xs font-mono text-gray-600 dark:text-gray-300">{color}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  