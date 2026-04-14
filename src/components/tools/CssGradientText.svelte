<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['css-gradient-text'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-gradient-text.${key}`;
  }

  let text = $state('Gradient Text');

  let color1 = $state('#ff6b6b');

  let color2 = $state('#4ecdc4');

  let color3 = $state('');

  let angle = $state(90);

  let fontSize = $state(48);

  let fontWeight = $state(700);

  // Functions
  function getGradient(): string {
    const colors = [color1, color2, color3].filter(Boolean).join(', ');
    return `linear-gradient(${angle}deg, ${colors})`;
  }
  function getCss(): string {
    return `.gradient-text {
  background: ${getGradient()};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
}`;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(getCss());
  }
  const presets = [
    { nameKey: 'presetSunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3'] },
    { nameKey: 'presetOcean', colors: ['#0093E9', '#80D0C7', ''] },
    { nameKey: 'presetPurple', colors: ['#667eea', '#764ba2', ''] },
    { nameKey: 'presetFire', colors: ['#f12711', '#f5af19', ''] },
    { nameKey: 'presetMint', colors: ['#00b09b', '#96c93d', ''] },
    { nameKey: 'presetNight', colors: ['#232526', '#414345', '#667eea'] },
  ];
  function applyPreset(colors: string[]) {
    color1 = colors[0];
    color2 = colors[1];
    color3 = colors[2] || '';
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label for="gradient-text" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('text')}</label>
            <input type="text" id="gradient-text" name="gradientText" bind:value={text}
              class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white" />
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label for="gradient-color-1" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('color1')}</label>
              <input type="color" id="gradient-color-1" name="gradientColor1" bind:value={color1}
                class="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label for="gradient-color-2" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('color2')}</label>
              <input type="color" id="gradient-color-2" name="gradientColor2" bind:value={color2}
                class="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label for="gradient-color-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('color3')}</label>
              <input type="color" id="gradient-color-3" name="gradientColor3" value={color3 || '#ffffff'} onchange={(e) => color3 = e.target.value}
                class="w-full h-10 rounded cursor-pointer" />
            </div>
          </div>

          <div>
            <label for="gradient-angle" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('angle')}: {angle}°</label>
            <input type="range" id="gradient-angle" name="gradientAngle" min="0" max="360" value={angle}
              onchange={(e) => angle = parseInt(e.target.value)} class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="gradient-font-size" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('fontSize')}: {fontSize}px</label>
              <input type="range" id="gradient-font-size" name="gradientFontSize" min="16" max="120" value={fontSize}
                onchange={(e) => fontSize = parseInt(e.target.value)} class="w-full" />
            </div>
            <div>
              <label for="gradient-font-weight" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('fontWeight')}: {fontWeight}</label>
              <input type="range" id="gradient-font-weight" name="gradientFontWeight" min="100" max="900" step="100" value={fontWeight}
                onchange={(e) => fontWeight = parseInt(e.target.value)} class="w-full" />
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('presets')}</label>
            <div class="flex flex-wrap gap-2">
              {#each presets as preset (preset.nameKey)}
<button  onclick={() => applyPreset(preset.colors)}
                  class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm">{t(preset.nameKey)}</button>
{/each}
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
            <span style="background: getGradient(); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: {fontSize}px; font-weight: fontWeight">{text}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
            <pre class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 overflow-x-auto">{getCss()}</pre>
          </div>

          <button onclick={copyToClipboard}
            class="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>
    </div>
  
