<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['css-filter-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-filter-generator.${key}`;
  }

  let blur = $state(0);

  let brightness = $state(100);

  let contrast = $state(100);

  let grayscale = $state(0);

  let hueRotate = $state(0);

  let invert = $state(0);

  let saturate = $state(100);

  let sepia = $state(0);

  let opacity = $state(100);

  let imageUrl = $state('https://picsum.photos/400/300');

  let fileInputRef = $state(null);

  // Functions
  function getFilterString(): string {
    const filters: string[] = [];
    if (blur !== 0) filters.push(`blur(${blur}px)`);
    if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
    if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
    if (grayscale !== 0) filters.push(`grayscale(${grayscale}%)`);
    if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`);
    if (invert !== 0) filters.push(`invert(${invert}%)`);
    if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
    if (sepia !== 0) filters.push(`sepia(${sepia}%)`);
    if (opacity !== 100) filters.push(`opacity(${opacity}%)`);
    return filters.length > 0 ? filters.join(' ') : 'none';
  }
  function getCss(): string {
    return `filter: ${getFilterString()};`;
  }
  function reset() {
    blur = 0; brightness = 100; contrast = 100; grayscale = 0;
    hueRotate = 0; invert = 0; saturate = 100; sepia = 0; opacity = 100;
  }
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => imageUrl = event.target?.result as string;
      reader.readAsDataURL(file);
    }
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(getCss());
  }
  const presets: { nameKey: string; values: Record<string, number> }[] = [
    { nameKey: 'presetGrayscale', values: { grayscale: 100 } },
    { nameKey: 'presetSepia', values: { sepia: 100 } },
    { nameKey: 'presetVintage', values: { sepia: 50, contrast: 120, brightness: 90 } },
    { nameKey: 'presetDramatic', values: { contrast: 150, brightness: 110, saturate: 130 } },
    { nameKey: 'presetFaded', values: { contrast: 80, brightness: 110, saturate: 80 } },
    { nameKey: 'presetInverted', values: { invert: 100 } },
  ];
  function applyPreset(values: Record<string, number>) {
    reset();
    Object.entries(values).forEach(([key, value]) => {
      switch (key) {
        case 'blur': blur = value; break;
        case 'brightness': brightness = value; break;
        case 'contrast': contrast = value; break;
        case 'grayscale': grayscale = value; break;
        case 'hueRotate': hueRotate = value; break;
        case 'invert': invert = value; break;
        case 'saturate': saturate = value; break;
        case 'sepia': sepia = value; break;
        case 'opacity': opacity = value; break;
      }
    });
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2 mb-4">
            {#each presets as preset (preset.nameKey)}
<button  onclick={() => applyPreset(preset.values)}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100">{t(preset.nameKey)}</button>
{/each}
            <button onclick={reset} class="px-3 py-1 bg-rose-500 hover:bg-red-700 rounded text-sm text-white">{t('reset')}</button>
          </div>

          {#each [
            { label: t('blur'), value: blur, set: setBlur, min: 0, max: 20, unit: 'px' },
            { label: t('brightness'), value: brightness, set: setBrightness, min: 0, max: 200, unit: '%' },
            { label: t('contrast'), value: contrast, set: setContrast, min: 0, max: 200, unit: '%' },
            { label: t('grayscale'), value: grayscale, set: setGrayscale, min: 0, max: 100, unit: '%' },
            { label: t('hueRotate'), value: hueRotate, set: setHueRotate, min: 0, max: 360, unit: '°' },
            { label: t('invert'), value: invert, set: setInvert, min: 0, max: 100, unit: '%' },
            { label: t('saturate'), value: saturate, set: setSaturate, min: 0, max: 200, unit: '%' },
            { label: t('sepia'), value: sepia, set: setSepia, min: 0, max: 100, unit: '%' },
            { label: t('opacity'), value: opacity, set: setOpacity, min: 0, max: 100, unit: '%' },
          ] as { label, value, set, min, max, unit } (label)}
<div >
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{label}: {value}{unit}</label>
              <input type="range" min={min} max={max} value={value}
                onchange={(e) => set(parseInt(e.target.value))} class="w-full" />
            </div>
{/each}
        </div>

        <div class="space-y-4">
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <input type="file" bind:this={fileInputRef} onchange={handleFileUpload} accept="image/*" class="hidden" />
            <button onclick={() => fileInputRef?.click()}
              class="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded text-sm text-gray-900 dark:text-gray-100">{t('uploadImage')}</button>
            <img src={imageUrl} alt="Preview" class="w-full rounded-lg"
              style="filter: {getFilterString()}" />
          </div>

          <div>
            <label class="tool-label">{t('output')}</label>
            <pre class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400">{getCss()}</pre>
          </div>

          <button onclick={copyToClipboard}
            class="w-full px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>
    </div>
  
