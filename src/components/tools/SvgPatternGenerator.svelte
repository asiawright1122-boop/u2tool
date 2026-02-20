<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['svg-pattern-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.svg-pattern-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type PatternType = 'dots' | 'lines' | 'grid' | 'zigzag' | 'waves' | 'hexagons' | 'triangles';

  let patternType = $state('dots');

  let size = $state(20);

  let color = $state('#3b82f6');

  let bgColor = $state('#ffffff');

  let opacity = $state(1);

  let copied = $state(false);

  let timerRef = $state(null);

  let generatePattern = $derived.by(() => {
    const s = size;
    const c = color;
    const o = opacity;

    switch (patternType) {
      case 'dots':
        return `<circle cx="${s/2}" cy="${s/2}" r="${s/6}" fill="${c}" fill-opacity="${o}"/>`;
      case 'lines':
        return `<line x1="0" y1="${s}" x2="${s}" y2="0" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'grid':
        return `<path d="M ${s} 0 L 0 0 0 ${s}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'zigzag':
        return `<polyline points="0,${s} ${s/2},0 ${s},${s}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'waves':
        return `<path d="M 0 ${s/2} Q ${s/4} 0, ${s/2} ${s/2} T ${s} ${s/2}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'hexagons':
        const h = s * 0.866;
        return `<polygon points="${s/4},0 ${s*3/4},0 ${s},${h/2} ${s*3/4},${h} ${s/4},${h} 0,${h/2}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      case 'triangles':
        return `<polygon points="${s/2},0 ${s},${s} 0,${s}" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1"/>`;
      default:
        return '';
    }
  });

  let svgCode = $derived.by(() => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  ${generatePattern}
</svg>`;
  });

  let cssBackground = $derived.by(() => {
    const encoded = encodeURIComponent(svgCode);
    return `background-image: url("data:image/svg+xml,${encoded}");`;
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('pattern')}</label>
          <select
            value={patternType}
            onchange={(e) => patternType = e.target.value as PatternType}
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="dots">{t('dots')}</option>
            <option value="lines">{t('lines')}</option>
            <option value="grid">{t('grid')}</option>
            <option value="zigzag">{t('zigzag')}</option>
            <option value="waves">{t('waves')}</option>
            <option value="hexagons">{t('hexagons')}</option>
            <option value="triangles">{t('triangles')}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('size')}</label>
          <input
            type="range"
            min={10}
            max={100}
            value={size}
            onchange={(e) => size = Number(e.target.value)}
            class="w-full"
          />
          <span class="text-xs text-gray-500">{size}px</span>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('color')}</label>
          <input
            type="color"
            bind:value={color}
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('bgColor')}</label>
          <input
            type="color"
            bind:value={bgColor}
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('opacity')}: {opacity}</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={opacity}
          onchange={(e) => opacity = Number(e.target.value)}
          class="w-full"
        />
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-48 overflow-hidden">
        <div
          class="w-full h-full"
          style="background-image: url("data:image/svg+xml,{encodeURIComponent(svgCode)}"); background-repeat: repeat"></div>
      </div>

      <div class="space-y-2">
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">SVG Code</label>
            <button onclick={() => copyCode(svgCode)} class="btn-secondary text-sm">
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <pre class="text-xs text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-32">
            {svgCode}
          </pre>
        </div>

        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-600 dark:text-gray-300">CSS Background</label>
            <button onclick={() => copyCode(cssBackground)} class="btn-secondary text-sm">
              {tg('copy')}
            </button>
          </div>
          <code class="text-xs text-gray-800 dark:text-gray-200 font-mono break-all">
            {cssBackground}
          </code>
        </div>
      </div>
    </div>
  
