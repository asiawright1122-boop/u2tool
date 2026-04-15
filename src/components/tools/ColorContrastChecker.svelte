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
    const tools = translations['tools'] as Record<string, unknown> || {};
    const scope = tools['color-contrast-checker'] as Record<string, unknown> || {};
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


    <div class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-end">
        <div class="space-y-2">
          <div class="tool-label !mb-0">{'Foreground Color'}</div>
          <div class="flex gap-2">
            <input
              type="color"
              bind:value={foreground}
              class="w-14 h-12 rounded-xl cursor-pointer border-none bg-transparent"
            />
            <input
              type="text"
              bind:value={foreground}
              class="tool-input flex-1 font-mono uppercase"
              placeholder="#000000"
            />
          </div>
        </div>

        <button onclick={swapColors} class="btn-secondary h-12 w-12 flex items-center justify-center rounded-xl mb-0.5" title={tc('swapColors')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
        </button>

        <div class="space-y-2">
          <div class="tool-label !mb-0">{'Background Color'}</div>
          <div class="flex gap-2">
            <input
              type="color"
              bind:value={background}
              class="w-14 h-12 rounded-xl cursor-pointer border-none bg-transparent"
            />
            <input
              type="text"
              bind:value={background}
              class="tool-input flex-1 font-mono uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div
        class="p-12 rounded-3xl text-center shadow-2xl transition-all duration-500 border border-white/10"
        style="background-color: {background}; color: {foreground}"
      >
        <div class="text-5xl font-black mb-4 tracking-tight">{'Aa'}</div>
        <div class="text-xl font-medium">{tc('sampleText')}</div>
        <div class="text-sm mt-3 opacity-80">{tc('smallText')}</div>
      </div>

      <!-- Contrast Ratio & WCAG Results -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-8 glass-card border-none bg-slate-50/50 dark:bg-white/5 flex flex-col items-center justify-center">
          <div class="text-sm tool-label !mb-3">{'Contrast Ratio'}</div>
          <div class="text-5xl font-black tracking-tighter" style="color: {ratio >= 7 ? '#10b981' : ratio >= 4.5 ? '#f59e0b' : '#f43f5e'}">
            {ratio.toFixed(2)}<span class="text-2xl opacity-50 font-medium ml-1">:1</span>
          </div>
        </div>

        <div class="p-6 glass-card border-none bg-slate-50/50 dark:bg-white/5 space-y-4">
          <h3 class="tool-label !mb-4">{'Normal Text'}</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-500">AA (4.5:1)</span>
              <span class={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${wcagNormal.aa ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {wcagNormal.aa ? `Pass` : `Fail`}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-500">AAA (7:1)</span>
              <span class={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${wcagNormal.aaa ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {wcagNormal.aaa ? `Pass` : `Fail`}
              </span>
            </div>
          </div>
        </div>

        <div class="p-6 glass-card border-none bg-slate-50/50 dark:bg-white/5 space-y-4">
          <h3 class="tool-label !mb-4">{'Large Text'}</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-500">AA (3:1)</span>
              <span class={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${wcagLarge.aa ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {wcagLarge.aa ? `Pass` : `Fail`}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-slate-500">AAA (4.5:1)</span>
              <span class={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${wcagLarge.aaa ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {wcagLarge.aaa ? `Pass` : `Fail`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Presets -->
      <div>
        <h3 class="tool-label !mb-4">{'Presets'}</h3>
        <div class="grid grid-cols-2 md:grid-cols-6 gap-3">
          {#each presets as preset, i (i)}
            <button 
              onclick={() => { foreground = preset.fg; background = preset.bg; }}
              class="p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-amber-500 transition-all hover:scale-105 shadow-sm active:scale-95"
              style="background-color: {preset.bg}; color: {preset.fg}"
            >
              <div class="font-bold text-[10px] uppercase tracking-tighter mb-1 select-none whitespace-nowrap overflow-hidden text-ellipsis">{tc(preset.nameKey).split(' ')[0]}</div>
              <div class="text-[10px] opacity-70 font-mono select-none">{getContrastRatio(preset.fg, preset.bg).toFixed(1)}:1</div>
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
  
