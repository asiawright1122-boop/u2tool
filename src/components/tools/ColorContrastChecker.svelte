<script lang="ts">
  import { getContrastRatio, getWCAGLevel } from '@/lib/tool-stubs';

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
  function tc(key: string): string {
    const scope = translations['tools']['color-contrast-checker'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.color-contrast-checker.${key}`;
  }

  let foreground = $state('#000000');

  let background = $state('#ffffff');

  let ratio = $state(21);

  let wcagNormal = $state({ aa: true, aaa: true });

  let wcagLarge = $state({ aa: true, aaa: true });

  $effect(() => {
    const r = getContrastRatio(foreground, background);
    ratio = r;
    wcagNormal = getWCAGLevel(r, false);
    wcagLarge = getWCAGLevel(r, true);
  });

  // Functions
  function swapColors() {
    const temp = foreground;
    foreground = background;
    background = temp;
  }
  const presets = [
    { fg: '#000000', bg: '#ffffff', nameKey: 'presetBlackOnWhite' },
    { fg: '#ffffff', bg: '#000000', nameKey: 'presetWhiteOnBlack' },
    { fg: '#1a1a1a', bg: '#f5f5f5', nameKey: 'presetDarkGrayOnLight' },
    { fg: '#0066cc', bg: '#ffffff', nameKey: 'presetBlueOnWhite' },
    { fg: '#ffffff', bg: '#0066cc', nameKey: 'presetWhiteOnBlue' },
    { fg: '#333333', bg: '#ffcc00', nameKey: 'presetDarkOnYellow' },
  ];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-2">{'Foreground Color'}</label>
          <div class="flex gap-2">
            <input
              type="color"
              bind:value={foreground}
              class="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={foreground}
              class="tool-input flex-1 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        <button onclick={swapColors} class="btn-secondary p-2 mb-1" title={tc('swapColors')}>
          ⇄
        </button>

        <div>
          <label class="block text-sm font-medium mb-2">{'Background Color'}</label>
          <div class="flex gap-2">
            <input
              type="color"
              bind:value={background}
              class="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={background}
              class="tool-input flex-1 font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div
        class="p-8 rounded-lg text-center"
        style="background-color: {background}; color: {foreground}"
      >
        <div class="text-4xl font-bold mb-2">{'Preview'}</div>
        <div class="text-lg">{tc('sampleText')}</div>
        <div class="text-sm mt-2">{tc('smallText')}</div>
      </div>

      <!-- Contrast Ratio -->
      <div class="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
        <div class="text-5xl font-bold mb-2" style="color: {ratio >= 7 ? '#22c55e' : ratio >= 4.5 ? '#eab308' : '#ef4444'}">
          {ratio.toFixed(2)}:1
        </div>
        <div class="text-gray-600 dark:text-gray-300">{'Contrast Ratio'}</div>
      </div>

      <!-- WCAG Results -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 class="font-medium mb-3 text-gray-900 dark:text-white">{'Normal Text'}</h3>
          <div class="space-y-2 text-gray-900 dark:text-white">
            <div class="flex justify-between items-center">
              <span>AA (4.5:1)</span>
              <span class={`px-2 py-1 rounded text-sm text-white ${wcagNormal.aa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagNormal.aa ? `✓ ${'Pass'}` : `✗ ${'Fail'}`}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span>AAA (7:1)</span>
              <span class={`px-2 py-1 rounded text-sm text-white ${wcagNormal.aaa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagNormal.aaa ? `✓ ${'Pass'}` : `✗ ${'Fail'}`}
              </span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 class="font-medium mb-3 text-gray-900 dark:text-white">{'Large Text'}</h3>
          <div class="space-y-2 text-gray-900 dark:text-white">
            <div class="flex justify-between items-center">
              <span>AA (3:1)</span>
              <span class={`px-2 py-1 rounded text-sm text-white ${wcagLarge.aa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagLarge.aa ? `✓ ${'Pass'}` : `✗ ${'Fail'}`}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span>AAA (4.5:1)</span>
              <span class={`px-2 py-1 rounded text-sm text-white ${wcagLarge.aaa ? 'bg-green-600' : 'bg-red-600'}`}>
                {wcagLarge.aaa ? `✓ ${'Pass'}` : `✗ ${'Fail'}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Presets -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">{'Presets'}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          {#each presets as preset, i (i)}
<button 
              onclick={() => { foreground = preset.fg; background = preset.bg; }}
              class="p-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-left"
              style="background-color: {preset.bg}; color: {preset.fg}"
            >
              <div class="font-medium text-sm">{tc(preset.nameKey)}</div>
              <div class="text-xs opacity-75">{getContrastRatio(preset.fg, preset.bg).toFixed(1)}:1</div>
            </button>
{/each}
        </div>
      </div>

      <!-- Info -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{'WCAG Guidelines'}</h3>
        <ul class="space-y-1">
          <li>• {tc('guidelinesAA')}</li>
          <li>• {tc('guidelinesAAA')}</li>
          <li>• {tc('guidelinesLarge')}</li>
        </ul>
      </div>
    </div>
  
