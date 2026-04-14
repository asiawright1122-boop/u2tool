<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['border-radius-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.border-radius-generator.${key}`;
  }

  let topLeft = $state(20);

  let topRight = $state(20);

  let bottomRight = $state(20);

  let bottomLeft = $state(20);

  let linked = $state(true);

  let boxColor = $state('#3b82f6');

  let unit = $state('px');

  // Functions
  function handleChange(corner: string, value: number) {
    if (linked) {
      topLeft = value;
      topRight = value;
      bottomRight = value;
      bottomLeft = value;
    } else {
      switch (corner) {
        case 'topLeft': topLeft = value; break;
        case 'topRight': topRight = value; break;
        case 'bottomRight': bottomRight = value; break;
        case 'bottomLeft': bottomLeft = value; break;
      }
    }
  }
  function getCss(): string {
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `border-radius: ${topLeft}${unit};`;
    }
    return `border-radius: ${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit};`;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(getCss());
  }
  const presets = [
    { name: t('presetSquare'), values: [0, 0, 0, 0] },
    { name: t('presetRounded'), values: [8, 8, 8, 8] },
    { name: t('presetPill'), values: [50, 50, 50, 50] },
    { name: t('presetLeaf'), values: [0, 50, 0, 50] },
    { name: t('presetDrop'), values: [50, 50, 0, 50] },
    { name: t('presetMessage'), values: [20, 20, 0, 20] },
  ];
  function applyPreset(values: number[]) {
    linked = false;
    topLeft = values[0];
    topRight = values[1];
    bottomRight = values[2];
    bottomLeft = values[3];
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('cornerRadius')}</h3>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input type="checkbox" bind:checked={linked}
                  class="rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                {t('linkAll')}
              </label>
              <select value={unit} onchange={(e) => unit = e.target.value as 'px' | '%'}
                class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white">
                <option value="px">px</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('topLeft')}: {topLeft}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={topLeft}
                onchange={(e) => handleChange('topLeft', parseInt(e.target.value))}
                class="w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('topRight')}: {topRight}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={topRight}
                onchange={(e) => handleChange('topRight', parseInt(e.target.value))}
                class="w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('bottomLeft')}: {bottomLeft}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={bottomLeft}
                onchange={(e) => handleChange('bottomLeft', parseInt(e.target.value))}
                class="w-full" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('bottomRight')}: {bottomRight}{unit}</label>
              <input type="range" min="0" max={unit === '%' ? 50 : 100} value={bottomRight}
                onchange={(e) => handleChange('bottomRight', parseInt(e.target.value))}
                class="w-full" />
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('presets')}</label>
            <div class="flex flex-wrap gap-2">
              {#each presets as preset (preset.name)}
<button  onclick={() => applyPreset(preset.values)}
                  class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300">
                  {preset.name}
                </button>
{/each}
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('boxColor')}</label>
            <input type="color" bind:value={boxColor}
              class="w-full h-10 rounded cursor-pointer" />
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('preview')}</h3>
          <div class="bg-gray-200 dark:bg-gray-600 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div class="w-48 h-48 transition-all duration-200"
              style="background-color: boxColor; border-radius: {topLeft}{unit} {topRight}{unit} {bottomRight}{unit} {bottomLeft}{unit}"></div>
          </div>
          
          <div>
            <label class="tool-label">{t('output')}</label>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400">
              {getCss()}
            </div>
          </div>
          
          <button onclick={copyToClipboard}
            class="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>
    </div>
  
