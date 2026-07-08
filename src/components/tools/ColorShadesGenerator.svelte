<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['color-shades-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.color-shades-generator.${key}`;
  }

  let baseColor = $state('#3b82f6');

  let shadeCount = $state(10);

  let shades = $state([]);

  $effect(() => {
    const [h, s] = hexToHsl(baseColor);
    const newShades: string[] = [];

    for (let i = 0; i < shadeCount; i++) {
      const l = 95 - (i * (90 / (shadeCount - 1)));
      newShades.push(hslToHex(h, s, Math.max(5, Math.min(95, l))));
    }
    shades = newShades;
  });

  // Functions
  function hexToHsl(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, l * 100];
  }
  function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  function copyColor(color: string) {
    navigator.clipboard.writeText(color);
  }
  function copyAll() {
    const css = shades.map((shade, i) => `--color-${(i + 1) * 100}: ${shade};`).join('\n');
    navigator.clipboard.writeText(css);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="tool-label">{t('baseColor')}</label>
          <div class="flex gap-2">
            <input type="color" bind:value={baseColor}
              class="w-16 h-10 rounded cursor-pointer" />
            <input type="text" bind:value={baseColor}
              class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono" />
          </div>
        </div>
        <div>
          <label class="tool-label">{t('numberOfShades', { count: shadeCount })}</label>
          <input type="range" min="5" max="15" value={shadeCount}
            onchange={(e) => shadeCount = parseInt(e.target.value)}
            class="w-full mt-2" />
        </div>
        <div class="flex items-end">
          <button onclick={copyAll}
            class="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors text-white">
            {t('copyCssVariables')}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
        {#each shades as shade, index (index)}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}  onclick={() => copyColor(shade)}
            class="cursor-pointer group">
            <div class="h-20 rounded-lg transition-transform group-hover:scale-105"
              style="background-color: {shade}"></div>
            <div class="mt-1 text-center">
              <div class="text-xs text-gray-600 dark:text-gray-300">{(index + 1) * 100}</div>
              <div class="text-xs font-mono text-gray-600 dark:text-gray-300">{shade}</div>
            </div>
          </div>
{/each}
      </div>

      <div>
        <label class="tool-label">{t('output')}</label>
        <pre class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 overflow-x-auto">
          {#each shades as shade, i}
`--color-${(i + 1) * 100}: ${shade};`).join('\n'
{/each}
        </pre>
      </div>
    </div>

