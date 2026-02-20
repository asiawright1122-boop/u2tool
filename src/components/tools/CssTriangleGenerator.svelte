<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['css-triangle-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-triangle-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Direction = 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';

  let direction = $state('up');

  let width = $state(100);

  let height = $state(100);

  let color = $state('#3b82f6');

  let copied = $state(false);

  let timerRef = $state(null);

  let cssCode = $derived.by(() => {
    const w = width;
    const h = height;
    const c = color;

    const styles: Record<Direction, string> = {
      'up': `width: 0;
height: 0;
border-left: ${w/2}px solid transparent;
border-right: ${w/2}px solid transparent;
border-bottom: ${h}px solid ${c};`,
      'down': `width: 0;
height: 0;
border-left: ${w/2}px solid transparent;
border-right: ${w/2}px solid transparent;
border-top: ${h}px solid ${c};`,
      'left': `width: 0;
height: 0;
border-top: ${h/2}px solid transparent;
border-bottom: ${h/2}px solid transparent;
border-right: ${w}px solid ${c};`,
      'right': `width: 0;
height: 0;
border-top: ${h/2}px solid transparent;
border-bottom: ${h/2}px solid transparent;
border-left: ${w}px solid ${c};`,
      'up-left': `width: 0;
height: 0;
border-top: ${h}px solid ${c};
border-right: ${w}px solid transparent;`,
      'up-right': `width: 0;
height: 0;
border-top: ${h}px solid ${c};
border-left: ${w}px solid transparent;`,
      'down-left': `width: 0;
height: 0;
border-bottom: ${h}px solid ${c};
border-right: ${w}px solid transparent;`,
      'down-right': `width: 0;
height: 0;
border-bottom: ${h}px solid ${c};
border-left: ${w}px solid transparent;`,
    };

    return styles[direction];
  });

  let previewStyle = $derived.by(() => {
    const w = width;
    const h = height;
    const c = color;

    const styles: Record<Direction, Record<string, string>> = {
      'up': { width: 0, height: 0, borderLeft: `${w/2}px solid transparent`, borderRight: `${w/2}px solid transparent`, borderBottom: `${h}px solid ${c}` },
      'down': { width: 0, height: 0, borderLeft: `${w/2}px solid transparent`, borderRight: `${w/2}px solid transparent`, borderTop: `${h}px solid ${c}` },
      'left': { width: 0, height: 0, borderTop: `${h/2}px solid transparent`, borderBottom: `${h/2}px solid transparent`, borderRight: `${w}px solid ${c}` },
      'right': { width: 0, height: 0, borderTop: `${h/2}px solid transparent`, borderBottom: `${h/2}px solid transparent`, borderLeft: `${w}px solid ${c}` },
      'up-left': { width: 0, height: 0, borderTop: `${h}px solid ${c}`, borderRight: `${w}px solid transparent` },
      'up-right': { width: 0, height: 0, borderTop: `${h}px solid ${c}`, borderLeft: `${w}px solid transparent` },
      'down-left': { width: 0, height: 0, borderBottom: `${h}px solid ${c}`, borderRight: `${w}px solid transparent` },
      'down-right': { width: 0, height: 0, borderBottom: `${h}px solid ${c}`, borderLeft: `${w}px solid transparent` },
    };

    return styles[direction];
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyCSS() {
    await navigator.clipboard.writeText(cssCode);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const directions: Direction[] = ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'];

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        {#each directions as dir (dir)}
<button 
            onclick={() => direction = dir}
            class={`px-3 py-2 rounded-lg transition-colors ${
              direction === dir
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {t(dir)}
          </button>
{/each}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('width')}: {width}px</label>
          <input
            type="range"
            min={20}
            max={200}
            value={width}
            onchange={(e) => width = Number(e.target.value)}
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('height')}: {height}px</label>
          <input
            type="range"
            min={20}
            max={200}
            value={height}
            onchange={(e) => height = Number(e.target.value)}
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('color')}</label>
          <input
            type="color"
            bind:value={color}
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-48">
        <div style={previewStyle}></div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-300">CSS</label>
          <button onclick={copyCSS} class="btn-secondary text-sm">
            {copied ? tg('copied') : tg('copy')}
          </button>
        </div>
        <pre class="text-sm text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
          {cssCode}
        </pre>
      </div>
    </div>
  
