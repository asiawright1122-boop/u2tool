<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let baseColor = $state('#3B82F6');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
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
      h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  }
  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
    return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  }
  const [h, s, l] = hexToHsl(baseColor);
  const shades = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(lv => hslToHex(h, s, lv));
  const complementary = hslToHex((h + 180) % 360, s, l);
  const analogous = [hslToHex((h - 30 + 360) % 360, s, l), baseColor, hslToHex((h + 30) % 360, s, l)];
  const triadic = [baseColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
  async function copy(color: string) {
    await navigator.clipboard.writeText(color);
    copied = color;
    setTimeout(() => copied = '', 1500);
  }

</script>

{#snippet ColorBox(color)}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }} onclick={() => copy(color)} class="cursor-pointer group">
      <div class="h-16 rounded-lg border border-gray-300 dark:border-gray-600" style="background-color: {color}"></div>
      <p class="text-xs text-center mt-1 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{copied === color ? '✓' : color}</p>
    </div>
{/snippet}


    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <label for="color-picker" class="sr-only">{t('palette.baseColor')}</label>
        <input type="color" id="color-picker" name="baseColor" bind:value={baseColor} class="w-16 h-16 rounded cursor-pointer" />
        <label for="color-hex" class="sr-only">{t('palette.hexCode')}</label>
        <input type="text" id="color-hex" name="hexColor" bind:value={baseColor} class="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-gray-900 dark:text-white" />
      </div>
      <div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('palette.shades')}</h3>
        <div class="grid grid-cols-9 gap-2">{#each shades as c, i (i)}
{@render ColorBox(c)}
{/each}</div>
      </div>
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('palette.complementary')}</h3>
          <div class="grid grid-cols-2 gap-2">{@render ColorBox(baseColor)}{@render ColorBox(complementary)}</div>
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('palette.analogous')}</h3>
          <div class="grid grid-cols-3 gap-2">{#each analogous as c, i (i)}
{@render ColorBox(c)}
{/each}</div>
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('palette.triadic')}</h3>
          <div class="grid grid-cols-3 gap-2">{#each triadic as c, i (i)}
{@render ColorBox(c)}
{/each}</div>
        </div>
      </div>
    </div>

