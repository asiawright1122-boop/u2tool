<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-shadow-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-shadow-generator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Shadow {
  x: number;
  y: number;
  blur: number;
  color: string;
}

  let text = $state('Hello World');

  let fontSize = $state(48);

  let textColor = $state('#333333');

  let shadows = $state([
    { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.5)' }
  ] as Shadow[]);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function getCssValue() {
    return shadows.map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.color}`).join(', ');
  }
  function addShadow() {
    shadows = [...shadows, { x: 2, y: 2, blur: 4, color: 'rgba(0,0,0,0.5)' }];
  }
  function removeShadow(index: number) {
    shadows = shadows.filter((_, i) => i !== index);
  }
  function updateShadow(index: number, field: keyof Shadow, value: number | string) {
    const newShadows = [...shadows];
    newShadows[index] = { ...newShadows[index], [field]: value };
    shadows = newShadows;
  }
  async function copyCSS() {
    const css = `text-shadow: ${getCssValue()};`;
    await navigator.clipboard.writeText(css);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function applyPreset(preset: string) {
    switch (preset) {
      case 'glow':
        shadows = [{ x: 0, y: 0, blur: 10, color: '#00ff00' }];
        break;
      case 'emboss':
        shadows = [
          { x: -1, y: -1, blur: 0, color: '#ffffff' },
          { x: 1, y: 1, blur: 0, color: '#000000' }
        ];
        break;
      case '3d':
        shadows = [
          { x: 1, y: 1, blur: 0, color: '#666666' },
          { x: 2, y: 2, blur: 0, color: '#555555' },
          { x: 3, y: 3, blur: 0, color: '#444444' },
          { x: 4, y: 4, blur: 0, color: '#333333' }
        ];
        break;
      case 'neon':
        shadows = [
          { x: 0, y: 0, blur: 5, color: '#ff00ff' },
          { x: 0, y: 0, blur: 10, color: '#ff00ff' },
          { x: 0, y: 0, blur: 20, color: '#ff00ff' }
        ];
        break;
    }
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button onclick={() => applyPreset('glow')} class="btn-secondary">{t('glow')}</button>
        <button onclick={() => applyPreset('emboss')} class="btn-secondary">{t('emboss')}</button>
        <button onclick={() => applyPreset('3d')} class="btn-secondary">{t('3d')}</button>
        <button onclick={() => applyPreset('neon')} class="btn-secondary">{t('neon')}</button>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex items-center justify-center min-h-32">
        <span
          style="font-size: {fontSize}px; color: textColor; text-shadow: getCssValue()"
        >
          {text}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="text-shadow-generator-field-15" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('previewText')}</label>
          <input
            type="text"
            bind:value={text}
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white" id="text-shadow-generator-field-15" />
        </div>
        <div>
          <label for="text-shadow-generator-field-14" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('fontSize')}</label>
          <input
            type="range"
            min={12}
            max={120}
            value={fontSize}
            onchange={(e) => fontSize = Number(e.target.value)}
            class="w-full" id="text-shadow-generator-field-14" />
          <span class="text-sm text-gray-500">{fontSize}px</span>
        </div>
        <div>
          <label for="text-shadow-generator-field-13" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('textColor')}</label>
          <input
            type="color"
            bind:value={textColor}
            class="w-full h-10 rounded cursor-pointer" id="text-shadow-generator-field-13" />
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">{t('shadows')}</h3>
          <button onclick={addShadow} class="btn-secondary text-sm">+ {t('addShadow')}</button>
        </div>
        {#each shadows as shadow, index (index)}
<div  class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 grid grid-cols-5 gap-2 items-center">
            <div>
              <label for={`text-shadow-generator-field-12-${index}`} class="text-xs text-gray-500">X</label>
              <input
                type="number"
                value={shadow.x}
                onchange={(e) => updateShadow(index, 'x', Number(e.target.value))}
                class="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm" id={`text-shadow-generator-field-12-${index}`} />
            </div>
            <div>
              <label for={`text-shadow-generator-field-11-${index}`} class="text-xs text-gray-500">Y</label>
              <input
                type="number"
                value={shadow.y}
                onchange={(e) => updateShadow(index, 'y', Number(e.target.value))}
                class="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm" id={`text-shadow-generator-field-11-${index}`} />
            </div>
            <div>
              <label for={`text-shadow-generator-field-10-${index}`} class="text-xs text-gray-500">{t('blur')}</label>
              <input
                type="number"
                value={shadow.blur}
                onchange={(e) => updateShadow(index, 'blur', Number(e.target.value))}
                class="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm" id={`text-shadow-generator-field-10-${index}`} />
            </div>
            <div>
              <label for={`text-shadow-generator-field-9-${index}`} class="text-xs text-gray-500">{t('color')}</label>
              <input
                type="text"
                value={shadow.color}
                onchange={(e) => updateShadow(index, 'color', e.target.value)}
                class="w-full px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm" id={`text-shadow-generator-field-9-${index}`} />
            </div>
            <button
              onclick={() => removeShadow(index)}
              disabled={shadows.length === 1}
              class="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              ✕
            </button>
          </div>
{/each}
      </div>

      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-300">CSS</div>
          <button onclick={copyCSS} class="btn-secondary text-sm">
            {copied ? tg('copied') : tg('copy')}
          </button>
        </div>
        <code class="text-sm text-gray-800 dark:text-gray-200 font-mono">
          text-shadow: {getCssValue()};
        </code>
      </div>
    </div>
  
